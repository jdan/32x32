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
        const { draw, width, height } = this.props
        const ctx = this.canvasNode.getContext("2d")
        const painter = createPainter(ctx, width, height)

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
        const inlineStyle = {
            transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
        }

        return <div
            className={css(styles.container)}
            style={{
                width: this.props.width,
                height: this.props.height,
            }}
        >
            <canvas
                ref={(node) => node !== null && (this.canvasNode = node)}
                className={css(
                    this.state.transitionable && styles.transitionable,
                    !zoomed && styles.normal,
                    zoomed && styles.zoomed
                )}
                style={inlineStyle}
                onClick={() => this.handleClick()}
                width={this.props.width}
                height={this.props.height}
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