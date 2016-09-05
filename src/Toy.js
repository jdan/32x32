import React, { Component } from "react"
import { StyleSheet, css } from "aphrodite"

import Zoomable from "./Zoomable.js"
import { createPainter } from "./painter.js"

const ZOOMED_WIDTH = 600

export default class Toy extends Component {
    constructor() {
        super()

        this.painter = null
        this.input = {
            x: 9999,
            y: 9999,
            key: {},
            keyp: {},
        }

        this.state = {
            running: false,
        }
    }

    componentDidMount() {
        this.renderCanvas()
    }

    componentDidUpdate(oldProps, oldState) {
        if (oldProps.zoomed !== this.props.zoomed) {
            this.renderCanvas()

            if (this.props.zoomed) {
                // Give the animation time to breathe
                setTimeout(() => {
                    this.setState({
                        running: true,
                    })
                }, 100)
            } else {
                this.setState({
                    running: false,
                })
            }
        }

        if (oldState.running !== this.state.running) {
            this.renderCanvas()
        }
    }

    getCanvasDimensions() {
        if (this.props.zoomed) {
            return {
                canvasWidth: ZOOMED_WIDTH,
                canvasHeight: ZOOMED_WIDTH,
            }
        } else {
            return {
                canvasWidth: this.props.width,
                canvasHeight: this.props.height,
            }
        }
    }

    isActive() {
        return this.painter && this.props.zoomed && this.state.running
    }

    renderCanvas() {
        const { draw } = this.props
        const { canvasWidth, canvasHeight } = this.getCanvasDimensions()

        const ctx = this.canvasNode.getContext("2d")
        ctx.fillStyle = "rgb(255, 255, 255)"
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        this.painter = createPainter(ctx, canvasWidth, canvasHeight)

        draw({
            painter: this.painter,
            input: this.input,
            frame: 0,
        })

        if (this.isActive()) {
            this.frame = 0
            this.timer = setInterval(() => {
                draw({
                    painter: this.painter,
                    input: this.input,
                    frame: ++this.frame,
                })

                // Clear any buttons that were just pressed
                Object.keys(this.input.keyp).forEach((code) => {
                    this.input.keyp[code] = false
                })
            }, 16)
        } else {
            clearInterval(this.timer)
            this.timer = null
            this.frame = 0
        }
    }

    handleClick() {
        if (!this.props.zoomed) {
            this.props.onSelect()
        }
    }

    // TODO: We can probably throttle this
    handleMouseMove(e) {
        const { canvasWidth, canvasHeight } = this.getCanvasDimensions()

        if (this.isActive()) {
            const rect = e.target.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            // Map a value v from [a,b] to [c,d]
            function map(v, a, b, c, d) {
                return (v - a) / (b - a) * (d - c) + c
            }

            this.input.x = Math.round(map(x, 0, canvasWidth, 0, this.painter.WIDTH))
            this.input.y = Math.round(map(y, 0, canvasHeight, 0, this.painter.HEIGHT))
        }
    }

    handleKeyDown(e) {
        this.input.key[e.key] = true

        // The entry in `keyp` must be non-existant (via onKeyUp) in order
        // for us to set it to true. It will be set to false in the next
        // frame.
        //
        // TODO: We can swap this out with a more explicit state machine
        if (this.input.keyp[e.key] === undefined) {
            this.input.keyp[e.key] = true
        }
    }

    handleKeyUp(e) {
        delete this.input.key[e.key]
        delete this.input.keyp[e.key]
    }

    render() {
        const { canvasWidth, canvasHeight } = this.getCanvasDimensions()

        const inlineStyle = {
            width: this.props.width,
            height: this.props.height,

            // Sadly, Aphrodite doesn't apply these until the next frame,
            // but I need them right away in order to measure the bounding
            // rect.
            border: "none",
            padding: 0,
        }

        return <button
            aria-label={this.props.title}
            style={inlineStyle}
            className={css(
                styles.toy,
                !this.props.zoomed && styles.thumbnail
            )}
            onClick={() => this.handleClick()}
            onKeyDown={(e) => this.handleKeyDown(e)}
            onKeyUp={(e) => this.handleKeyUp(e)}
        >
            <Zoomable
                hackSomethingElseIsSelected={this.props.hackSomethingElseIsSelected}
                zoomWidth={ZOOMED_WIDTH}
                zoomed={this.props.zoomed}
            >
                <canvas
                    ref={(node) => node !== null && (this.canvasNode = node)}
                    width={canvasWidth}
                    height={canvasHeight}
                    onMouseMove={(e) => this.handleMouseMove(e)}
                    style={{
                        width: this.props.width,
                        height: this.props.height,
                    }}
                />
            </Zoomable>
        </button>
    }
}

Toy.propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,

    title: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
    description: React.PropTypes.string,
    draw: React.PropTypes.func.isRequired,

    zoomed: React.PropTypes.bool.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    hackSomethingElseIsSelected: React.PropTypes.bool.isRequired,
}

const styles = StyleSheet.create({
    toy: {
        background: "none",
        margin: 4,

        ":focus": {
            outline: "2px solid blue",
        },
    },

    thumbnail: {
        cursor: "zoom-in",
    }
})