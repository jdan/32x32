import React, { Component } from "react"
import { StyleSheet, css } from "aphrodite"

export default class Zoomable extends Component {
    constructor() {
        super()

        this.zoomableNode = null
        this.state = {
            zoomed: false,
            transitionable: false,

            translateX: 0,
            translateY: 0,
            scale: 1,
        }
    }

    handleClick() {
        const { zoomWidth } = this.props

        if (!this.state.zoomed) {
            const { top, left, width } = this.zoomableNode.getBoundingClientRect()

            this.setState({
                translateX: left,
                translateY: top,
                zoomed: true,
            }, () => {
                // On the next frame, transition to the box centered in the screen
                const windowWidth = window.innerWidth
                const windowHeight = window.innerHeight
                const scale = zoomWidth / width

                requestAnimationFrame(() => {
                    this.setState({
                        translateX: windowWidth / 2 - zoomWidth / 2,
                        translateY: windowHeight / 2 - zoomWidth / 2,
                        scale,
                        transitionable: true,
                    })

                    // Invoke the `onZoom` callback
                    this.props.onZoom()
                })
            })
        }
    }

    render() {
        const { children, containerStyle } = this.props
        const { zoomed, translateX, translateY, scale } = this.state

        const inlineStyle = {
            transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
        }

        return <div style={containerStyle}>
            <div
                ref={(node) => node !== null && (this.zoomableNode = node)}
                style={inlineStyle}
                className={css(
                    this.state.transitionable && styles.transitionable,
                    !zoomed && styles.normal,
                    zoomed && styles.zoomed
                )}
                onClick={() => this.handleClick()}
            >
                {children}
            </div>
        </div>
    }
}

Zoomable.propTypes = {
    children: React.PropTypes.node.isRequired,
    containerStyle: React.PropTypes.object,
    onZoom: React.PropTypes.func,
    zoomWidth: React.PropTypes.number,
}

Zoomable.defaultProps = {
    onZoom: () => {},
    style: {},
    zoomWidth: 600,
}

const styles = StyleSheet.create({
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