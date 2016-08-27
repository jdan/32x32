import React, { Component } from "react"
import { createPainter } from "../painter.js"

export default class Toy extends Component {
    constructor() {
        super()
        this.canvasNode = null
    }

    componentDidMount() {
        const { draw, width, height } = this.props
        const ctx = this.canvasNode.getContext("2d")
        const painter = createPainter(ctx, width, height)

        draw(painter, 0)
    }

    render() {
        return <canvas
            ref={(node) => node !== null && (this.canvasNode = node)}
            width={this.props.width}
            height={this.props.height}
        />
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