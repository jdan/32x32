import React, { Component } from "react"
import { Motion, spring } from "react-motion"
import { StyleSheet, css } from "aphrodite"

export default class Zoomable extends Component {
    constructor() {
        super()
        this.zoomableNode = null
    }

    getTranslateSprings() {
        const { zoomed, zoomWidth } = this.props

        if (this.zoomableNode && zoomed) {
            // This causes issues if we switch between items really quickly (1-2-1)
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
        return <Motion style={this.getTranslateSprings()}>
            {({translateX, translateY, scale}) =>
                <div
                    className={css(!this.props.zoomed && styles.normal)}
                    ref={(node) => node !== null && (this.zoomableNode = node)}
                    style={{
                        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                        transformOrigin: "0 0",
                    }}
                >
                    {this.props.children}
                </div>
            }
        </Motion>
    }
}

Zoomable.propTypes = {
    children: React.PropTypes.node.isRequired,
    onZoom: React.PropTypes.func,
    zoomed: React.PropTypes.bool.isRequired,
    zoomWidth: React.PropTypes.number,
}

Zoomable.defaultProps = {
    onZoom: () => {},
    zoomWidth: 600,
}

const styles = StyleSheet.create({
    normal: {
        cursor: "zoom-in",
    },
})