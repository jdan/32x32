import React, { Component } from "react"
import { StyleSheet, css } from "aphrodite"
import { createPainter } from "./painter.js"

// May want to update these on the fly for different screen sizes
const ZOOMED_WIDTH = 600

export default class Toy extends Component {
    constructor() {
        super()
        this.canvasNode = null
        this.state = {
            zoomed: false,
            transitionable: false,

            translateX: 0,
            translateY: 0,
            scale: 1,
        }
    }

    componentDidMount() {
        this.drawFirstFrame()
    }

    componentDidUpdate() {
        this.drawFirstFrame()
    }

    drawFirstFrame() {
        const { draw } = this.props
        const { zoomed } = this.state

        const canvasWidth = zoomed ? ZOOMED_WIDTH : this.props.width
        const canvasHeight = zoomed ? ZOOMED_WIDTH : this.props.height

        const ctx = this.canvasNode.getContext("2d")
        const painter = createPainter(ctx, canvasWidth, canvasHeight)

        draw(painter, 0)
    }

    handleClick() {
        if (!this.state.zoomed) {
            const { top, left, width } = this.canvasNode.getBoundingClientRect()

            this.setState({
                translateX: left,
                translateY: top,
                zoomed: true,
            }, () => {
                // On the next frame, transition to the box centered in the screen
                const windowWidth = window.innerWidth
                const windowHeight = window.innerHeight
                const scale = ZOOMED_WIDTH / width

                requestAnimationFrame(() => {
                    this.setState({
                        translateX: windowWidth / 2 - ZOOMED_WIDTH / 2,
                        translateY: windowHeight / 2 - ZOOMED_WIDTH / 2,
                        scale,
                        transitionable: true,
                    })
                })
            })
        }
    }

    render() {
        const { zoomed, translateX, translateY, scale } = this.state

        const containerSizing = {
            width: this.props.width,
            height: this.props.height,
        }

        const canvasStyle = {
            ...containerSizing,
            transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
        }

        const canvasWidth = zoomed ? ZOOMED_WIDTH : this.props.width
        const canvasHeight = zoomed ? ZOOMED_WIDTH : this.props.height

        return <div
            className={css(styles.container)}
            style={containerSizing}
        >
            <canvas
                ref={(node) => node !== null && (this.canvasNode = node)}
                className={css(
                    this.state.transitionable && styles.transitionable,
                    !zoomed && styles.normal,
                    zoomed && styles.zoomed
                )}
                style={canvasStyle}
                onClick={() => this.handleClick()}
                width={canvasWidth}
                height={canvasHeight}
            />
        </div>
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

const styles = StyleSheet.create({
    container: {
        display: "inline-block",
    },

    transitionable: {
        transition: "all 300ms ease-in-out",
        transformOrigin: "0 0",
    },

    normal: {
        cursor: "zoom-in",
    },

    zoomed: {
        position: "absolute",
        top: 0,
        left: 0,
    },
})