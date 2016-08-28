import React, { Component } from "react"
import { StyleSheet, css } from "aphrodite"

import Zoomable from "./Zoomable.js"
import { createPainter } from "./painter.js"

const ZOOMED_WIDTH = 600

export default class Toy extends Component {
    constructor(props) {
        super()
        this.state = {
            canvasWidth: props.width,
            canvasHeight: props.height,
        }
    }

    componentDidMount() {
        this.renderCanvas()
    }

    componentDidUpdate(oldProps, oldState) {
        if (oldState.canvasWidth !== this.state.canvasWidth) {
            this.renderCanvas()
        }
    }

    renderCanvas() {
        const { draw } = this.props
        const { canvasWidth, canvasHeight } = this.state

        const ctx = this.canvasNode.getContext("2d")
        const painter = createPainter(ctx, canvasWidth, canvasHeight)

        draw(painter, 0)
    }

    handleClick() {
        const willBeZoomed = !this.props.zoomed

        if (willBeZoomed) {
            this.setState({
                canvasWidth: ZOOMED_WIDTH,
                canvasHeight: ZOOMED_WIDTH,
            })

            this.props.onSelect()
        } else {
            this.setState({
                canvasWidth: this.props.width,
                canvasHeight: this.props.height,
            })
        }
    }

    render() {
        const { canvasWidth, canvasHeight } = this.state

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
    // Pass-through props from Toy implementations
    running: React.PropTypes.bool.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,

    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.string,
    draw: React.PropTypes.func.isRequired,

    zoomed: React.PropTypes.bool.isRequired,
    onSelect: React.PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
    toy: {
        background: "none",

        ":focus": {
            outline: "2px solid blue",
        },
    },

    thumbnail: {
        cursor: "zoom-in",
    }
})