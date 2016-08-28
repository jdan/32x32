import React, { Component } from "react"
import { Motion, spring } from "react-motion"
import { StyleSheet, css } from "aphrodite"

export default class Zoomable extends Component {
    constructor() {
        super()

        this.zoomableNode = null
        this.state = {
            zoomed: false,
        }
    }

    handleClick() {
        const { zoomWidth } = this.props

        if (!this.state.zoomed) {
            this.setState({
                zoomed: true,
            })
        }
    }

    getTranslateSprings() {
        const { zoomWidth } = this.props

        if (this.zoomableNode && this.state.zoomed) {
            const { top, left, width } = this.zoomableNode.getBoundingClientRect()

            const desiredX = window.innerWidth / 2 - zoomWidth / 2
            const desiredY = window.innerHeight / 2 - zoomWidth / 2

            return {
                scale: spring(zoomWidth / width),
                translateX: spring(desiredX - left),
                translateY: spring(desiredY - top),
            }
        } else {
            return {
                translateX: spring(0),
                translateY: spring(0),
                scale: spring(1),
            }
        }
    }

    render() {
        const { children, containerStyle } = this.props

        return <div style={containerStyle}>
            <Motion style={this.getTranslateSprings()}>
                {({translateX, translateY, scale}) =>
                    <div
                        className={css(!this.state.zoomed && styles.normal)}
                        ref={(node) => node !== null && (this.zoomableNode = node)}
                        style={{
                            transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                            transformOrigin: "0 0",
                        }}
                        onClick={() => this.handleClick()}
                    >
                        {children}
                    </div>
                }

            </Motion>
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
    normal: {
        cursor: "zoom-in",
    },
})