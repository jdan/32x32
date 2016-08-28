import React, { Component } from "react"
import { StyleSheet, css } from "aphrodite"

import Zoomable from "./Zoomable.js"
import { createPainter } from "./painter.js"

const ZOOMED_WIDTH = 600

export default class Toy extends Component {
    componentDidMount() {
        const { draw } = this.props

        const ctx = this.canvasNode.getContext("2d")
        const painter = createPainter(ctx, ZOOMED_WIDTH, ZOOMED_WIDTH)

        draw(painter, 0)
    }

    render() {
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
            onClick={() => !this.props.zoomed && this.props.onSelect()}
        >
            <Zoomable
                zoomWidth={ZOOMED_WIDTH}
                zoomed={this.props.zoomed}
            >
                <canvas
                    ref={(node) => node !== null && (this.canvasNode = node)}
                    width={ZOOMED_WIDTH}
                    height={ZOOMED_WIDTH}
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