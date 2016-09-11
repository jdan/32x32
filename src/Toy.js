import React, { Component } from "react"
import { StyleSheet, css } from "aphrodite"

import { createPainter } from "./painter.js"

// TODO: These should probably be dynamic
const THUMBNAIL_WIDTH = 80
const FOCUSED_WIDTH = 600

export default class Toy extends Component {
    constructor() {
        super()

        this.node = null
        this.painter = null
        this.frame = 0
        this.timer = null
    }

    componentDidMount() {
        this.renderCanvas()
    }

    componentDidUpdate(oldProps) {
        if (oldProps.draw !== this.props.draw) {
            clearInterval(this.timer)
            this.timer = null
            this.frame = 0

            this.renderCanvas()
        }
    }

    getCanvasSize() {
        return (this.props.focused) ? FOCUSED_WIDTH : THUMBNAIL_WIDTH
    }

    renderCanvas() {
        const { draw } = this.props
        const canvasSize = this.getCanvasSize()

        const ctx = this.canvasNode.getContext("2d")
        ctx.fillStyle = "rgb(255, 255, 255)"
        ctx.fillRect(0, 0, canvasSize, canvasSize)

        this.painter = createPainter(ctx, canvasSize, canvasSize)

        draw({
            painter: this.painter,
            input: this.props.input,
            frame: 0,
        })

        if (this.props.focused) {
            this.frame = 0
            this.timer = setInterval(() => {
                draw({
                    painter: this.painter,
                    input: this.props.input,
                    frame: ++this.frame,
                })

                // Clear any buttons that were just pressed
                Object.keys(this.props.input.keyp).forEach((code) => {
                    this.props.input.keyp[code] = false
                })
            }, 16)
        }
    }

    // TODO: We can probably throttle this
    handleMouseMove(e) {
        const canvasSize = this.getCanvasSize()

        if (this.props.focused) {
            const rect = e.target.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            // Map a value v from [a,b] to [c,d]
            function map(v, a, b, c, d) {
                return (v - a) / (b - a) * (d - c) + c
            }

            this.props.input.x = Math.round(map(x, 0, canvasSize, 0, this.painter.WIDTH))
            this.props.input.y = Math.round(map(y, 0, canvasSize, 0, this.painter.HEIGHT))
        }
    }

    render() {
        const canvasSize = this.getCanvasSize()

        return <canvas
            ref={(node) => node !== null && (this.canvasNode = node)}
            width={canvasSize}
            height={canvasSize}
            onMouseMove={(e) => this.handleMouseMove(e)}
        />
    }
}

Toy.propTypes = {
    title: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
    description: React.PropTypes.string,
    draw: React.PropTypes.func.isRequired,
    focused: React.PropTypes.bool,

    // Global input
    input: React.PropTypes.object,
}
