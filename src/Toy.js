import React, { Component } from "react"
import Zoomable from "./Zoomable.js"
import { createPainter } from "./painter.js"

const ZOOMED_WIDTH = 600

export default class Toy extends Component {
    constructor() {
        super()
        this.canvasNode = null
    }

    componentDidMount() {
        this.drawFirstFrame()
    }

    drawFirstFrame() {
        const { draw } = this.props

        const ctx = this.canvasNode.getContext("2d")
        const painter = createPainter(ctx, ZOOMED_WIDTH, ZOOMED_WIDTH)

        draw(painter, 0)
    }

    render() {
        const containerStyle = {
            width: this.props.width,
            height: this.props.height,
            display: "inline-block",
        }

        return <Zoomable
            containerStyle={containerStyle}
            zoomWidth={ZOOMED_WIDTH}
            onZoom={() => this.drawFirstFrame()}
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
}