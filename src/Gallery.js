/**
 * A gallery of toys
 */

import React, { Component } from "react"
import { StyleSheet, css } from "aphrodite"

import Toy, { ToyPropType } from "./Toy.js"

export const thumbnailSize = 80

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

const styles = StyleSheet.create({
    gallery: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,

        height: 2 * thumbnailSize,
    },

    toy: {
        padding: 0,
        border: "none",
        height: thumbnailSize,
    },
})