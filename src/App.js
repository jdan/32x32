import React, { Component } from "react"
import { StyleSheet, css } from "aphrodite"

import Gallery, { desktopQuery, desktopWidth, galleryHeight, padding } from "./Gallery.js"
import toys from "./toys"
import Toy from "./Toy.js"

import { Song, Sequencer, Sampler } from "react-music"

const focusSize = 600

class App extends Component {
    constructor() {
        super()

        this.input = {
            x: 9999,
            y: 9999,
            key: {},
            keyp: {},
        }

        this.state = {
            zoomedIndex: 0,
            soundPlaying: false,
        }
    }

    getCurrentToy() {
        return toys[this.state.zoomedIndex]
    }

    handleSelect(index) {
        const { slug } = toys[index]
        history.replaceState({}, "", "#" + slug)
        document.title = slug + " | 32x32"

        this.setState({
            zoomedIndex: index,
        })
    }

    componentDidMount() {
        const slug = document.location.hash.slice(1)
        if (slug) {
            this.setState({
                zoomedIndex: toys.findIndex((toy) => toy.slug === slug),
            })
        }

        // Set up document-wide event listeners
        document.addEventListener("keydown", (e) => {
            this.handleKeyDown(e)
        })

        document.addEventListener("keyup", (e) => {
            this.handleKeyUp(e)
        })
    }

    handleKeyDown(e) {
        this.input.key[e.keyCode] = true

        // The entry in `keyp` must be non-existant (via onKeyUp) in order
        // for us to set it to true. It will be set to false in the next
        // frame.
        //
        // TODO: We can swap this out with a more explicit state machine
        if (this.input.keyp[e.keyCode] === undefined) {
            this.input.keyp[e.keyCode] = true
        }
    }

    handleKeyUp(e) {
        delete this.input.key[e.keyCode]
        delete this.input.keyp[e.keyCode]
    }

    handlePlay() {
        this.setState({
            soundPlaying: true,
        })
    }

    handleStop() {
        this.setState({
            soundPlaying: false,
        })
    }

    renderFocus() {
        const toy = this.getCurrentToy()
        const renderSound = (toy.sample && toy.bpm && this.state.soundPlaying)

        return <div>
            <Toy
                {...toy}
                width={focusSize}
                height={focusSize}
                handlePlay={() => this.handlePlay()}
                handleStop={() => this.handleStop()}
                focused={true}
                input={this.input}
            />

            {renderSound &&
                <Song tempo={toy.bpm} playing={true}>
                    <Sequencer resolution={16} bars={4}>
                        <Sampler
                            sample={toy.sample}
                            steps={[0]}
                        />
                    </Sequencer>
                </Song>}
        </div>
    }

    render() {
        const currentToy = this.getCurrentToy()

        return <main className={css(styles.main)}>
            <div className={css(styles.focus)}>
                {this.renderFocus()}

                <div className={css(styles.info)}>
                    <h1 className={css(styles.title)}>{currentToy.title}</h1>
                    {currentToy.description}
                </div>
            </div>

            <Gallery
                toys={toys}
                input={this.input}
                onSelect={(i) => this.handleSelect(i)}
            />
        </main>
    }
}

const styles = StyleSheet.create({
    main: {

    },

    focus: {
        position: "absolute",
        top: galleryHeight,
        bottom: 0,
        left: 0,
        right: 0,
        overflowY: "scroll",
        WebkitOverflowScrolling: "touch",

        [desktopQuery]: {
            top: padding,
            left: desktopWidth,
        },
    },

    info: {
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        padding: 8,
    },

    title: {
        marginTop: 0,
    },
})

export default App
