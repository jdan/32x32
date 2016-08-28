import React, { Component } from "react"
import { Motion, spring } from "react-motion"
import { StyleSheet, css } from "aphrodite"
import throttle from "lodash.throttle"

export default class Zoomable extends Component {
    constructor() {
        super()
        this.referenceNode = null
    }

    componentDidMount() {
        this.throttledResize = throttle(() => {
            if (this.props.zoomed) {
                this.forceUpdate()
            }
        }, 33);

        window.addEventListener("resize", this.throttledResize)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.throttledResize)
    }

    getTranslateSprings() {
        const { zoomed, zoomWidth } = this.props

        if (this.referenceNode && zoomed) {
            const { top, left, width } = this.referenceNode.getBoundingClientRect()

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
                // We'll use a wrapper "reference" node, which retains its shape
                // while its child resizes!
                //
                // We need a consistent shape in order to perform measurements
                // on-demand to figure out translations and scaling.
                <div ref={(node) => node !== null && (this.referenceNode = node)}>
                    <div
                        className={css(!this.props.zoomed && styles.normal)}
                        style={{
                            transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                            transformOrigin: "0 0",
                        }}
                    >
                        {this.props.children}
                    </div>
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