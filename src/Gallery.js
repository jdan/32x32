/**
 * A gallery of toys
 */

import React, { Component } from "react"
import { StyleSheet, css } from "aphrodite"

import Toy, { ToyPropType } from "./Toy.js"

export default class Gallery extends Component {
    render() {
        const { toys, input, onSelect } = this.props

        return <div className={css(styles.gallery)}>
            {toys.map((toy, i) => {
                return <button
                    className={css(styles.toy)}
                    onClick={() => onSelect(i)}
                    key={toy.slug}
                >
                    <Toy
                        {...toy}
                        width={thumbnailSize}
                        height={thumbnailSize}
                        input={input}
                    />
                </button>
            })}
        </div>
    }
}

Gallery.propTypes = {
    toys: React.PropTypes.arrayOf(
        React.PropTypes.shape(ToyPropType).isRequired
    ).isRequired,
    onSelect: React.PropTypes.func.isRequired,
    input: React.PropTypes.object.isRequired,
}

const thumbnailSize = 80
const padding = 4

// The gallery is two thumbnails tall, and has 3 layers of padding
export const galleryHeight = 2 * thumbnailSize + 3 * padding

const styles = StyleSheet.create({
    gallery: {
        position: "absolute",
        top: padding,
        left: padding,
        right: padding,

        height: galleryHeight,

        display: "flex",
        alignContent: "flex-start",
        flexDirection: "column",
        flexWrap: "wrap",

        overflowX: "scroll",
        WebkitOverflowScrolling: "touch",

        // Hide the scrollbar
        "::-webkit-scrollbar": {
            display: "none",
        },
    },

    toy: {
        display: "block",
        padding: 0,
        border: "none",
        width: thumbnailSize,
        height: thumbnailSize,
        marginBottom: padding,
        marginRight: padding,
    },
})