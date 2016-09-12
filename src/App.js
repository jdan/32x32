import React, { Component } from "react"
import { StyleSheet, css } from "aphrodite"
import toys from "./toys"
import Toy from "./Toy.js"

import { Song, Sequencer, Sampler } from "react-music"
import wav from "./toys/oizo.wav"

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
            zoomedIndex: -1,
            soundPlaying: false,
        }
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
        const toy = toys[this.state.zoomedIndex]
        const renderSound = (toy.sample && toy.bpm && this.state.soundPlaying)

        return <div className={css(styles.focus)}>
            <Toy
                {...toy}
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

    renderToys() {
        // We should compute something based on the screen size
        const size = 80

        return <div>
            {toys.map((toy, i) => {
                return <button
                    onClick={() => this.handleSelect(i)}
                    key={toy.slug}
                >
                    <Toy
                        {...toy}
                        input={this.input}
                    />
                </button>
            })}
        </div>
    }

    render() {
        return <main>
            {this.renderFocus()}
            {this.renderToys()}
        </main>
    }
}

const styles = StyleSheet.create({

})

export default App
