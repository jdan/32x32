import React, { Component } from "react"
import { StyleSheet, css } from "aphrodite"

import Zoomable from "./Zoomable.js"
import { createPainter } from "./painter.js"

const ZOOMED_WIDTH = 600

export default class Toy extends Component {
    constructor() {
        super()
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

    renderCanvas() {
        const { draw } = this.props
        const { canvasWidth, canvasHeight } = this.getCanvasDimensions()

        const ctx = this.canvasNode.getContext("2d")
        ctx.fillStyle = "rgb(255, 255, 255)"
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        const painter = createPainter(ctx, canvasWidth, canvasHeight)

        draw({
            painter,
            frame: 0,
        })

        if (this.props.zoomed && this.state.running) {
            this.frame = 0
            this.timer = setInterval(() => {
                draw({
                    painter,
                    frame: ++this.frame,
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