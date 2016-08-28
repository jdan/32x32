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
                opacity: spring(0.8),
            }
        } else {
            return {
                translateX: spring(0),
                translateY: spring(0),
                scale: spring(1),
                opacity: spring(0),
            }
        }
    }

    render() {
        return <Motion style={this.getTranslateSprings()}>
            {({translateX, translateY, scale, opacity}) =>
                // We'll use a wrapper "reference" node, which retains its shape
                // while its child resizes!
                //
                // We need a consistent shape in order to perform measurements
                // on-demand to figure out translations and scaling.
                <div
                    ref={(node) => node !== null && (this.referenceNode = node)}
                    // For some reason, without height: 100% we get a couple pixels on the bottom!
                    style={{ height: "100%" }}
                >
                    {this.props.zoomed && <div
                        className={css(styles.backdrop)}
                        style={{ opacity }}
                    />}

                    <div
                        className={css(
                            this.props.zoomed && styles.zoomed,
                            !this.props.zoomed && styles.normal
                        )}
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
    zoomed: React.PropTypes.bool.isRequired,
    zoomWidth: React.PropTypes.number,
}

Zoomable.defaultProps = {
    zoomWidth: 600,
}

const MAX_ZINDEX = 9999;

const styles = StyleSheet.create({
    normal: {
        cursor: "zoom-in",
        // Likewise, we need height: 100% to prevent a couple extra pixels on the bottom
        height: "100%",
    },

    zoomed: {
        position: "absolute",
        zIndex: MAX_ZINDEX,
    },

    backdrop: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        zIndex: MAX_ZINDEX - 1,
    },
})