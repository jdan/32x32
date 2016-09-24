import React, { Component } from "react"

import { createPainter } from "./painter.js"

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

    renderCanvas() {
        const { width, height } = this.props

        const ctx = this.canvasNode.getContext("2d")
        ctx.fillStyle = "rgb(255, 255, 255)"
        ctx.fillRect(0, 0, width, height)

        this.painter = createPainter(ctx, width, height)

        const draw = () => {
            this.props.draw({
                painter: this.painter,
                input: this.props.input,
                frame: this.frame,
                play: () => this.props.handlePlay(),
                stop: () => this.props.handleStop(),
            })
        }

        // Call an initial draw
        draw()

        if (this.props.focused) {
            this.frame = 0
            this.timer = setInterval(() => {
                ++this.frame;
                draw()

                // Clear any buttons that were just pressed
                Object.keys(this.props.input.keyp).forEach((code) => {
                    this.props.input.keyp[code] = false
                })
            }, 16)
        }
    }

    // TODO: We can probably throttle this
    handleMouseMove(e) {
        const { width, height } = this.props

        if (this.props.focused) {
            const rect = e.target.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            // Map a value v from [a,b] to [c,d]
            function map(v, a, b, c, d) {
                return (v - a) / (b - a) * (d - c) + c
            }

            this.props.input.x = Math.round(map(x, 0, width, 0, this.painter.WIDTH))
            this.props.input.y = Math.round(map(y, 0, height, 0, this.painter.HEIGHT))
        }
    }

    render() {
        return <canvas
            ref={(node) => node !== null && (this.canvasNode = node)}
            style={{
                width: "100%",
                maxWidth: this.props.width,
            }}
            width={this.props.width}
            height={this.props.height}
            onMouseMove={(e) => this.handleMouseMove(e)}
        />
    }
}

export const ToyPropType = {
    title: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
    description: React.PropTypes.node,
    draw: React.PropTypes.func.isRequired,
    focused: React.PropTypes.bool,
    sample: React.PropTypes.string,
    bpm: React.PropTypes.number,
}

Toy.propTypes = {
    ...ToyPropType,

    handlePlay: React.PropTypes.func,
    handleStop: React.PropTypes.func,

    // Global input
    input: React.PropTypes.object,

    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
}

Toy.defaultProps = {
    handlePlay: () => {},
    handleStop: () => {},
}
