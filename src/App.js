import React, { Component } from "react"
import toys from "./toys"
import Toy from "./Toy.js"

class App extends Component {
    constructor() {
        super()
        this.state = {
            zoomedIndex: -1,
        }
    }

    handleKeyDown(e) {
        if (e.key === "Escape") {
            this.handleDeselect()
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

    handleDeselect() {
        // Clear the current hash
        history.replaceState({}, "", window.location.pathname)
        document.title = "32x32"

        this.setState({
            zoomedIndex: -1,
        })
    }

    componentDidMount() {
        const slug = document.location.hash.slice(1)
        if (slug) {
            this.setState({
                zoomedIndex: toys.findIndex((toy) => toy.slug === slug),
            })
        }
    }

    componentDidUpdate(oldProps, oldState) {
        if (oldState.zoomedIndex !== this.state.zoomedIndex) {
            if (this.state.zoomedIndex > -1) {
                document.body.style.overflowY = "hidden"
            } else {
                document.body.style.overflowY = "auto"
            }
        }
    }

    render() {
        // We should compute something based on the screen size
        const size = 80

        return <div onKeyDown={(e) => this.handleKeyDown(e)}>
            {toys.map((toy, i) => {
                const isSelected = (this.state.zoomedIndex === i)
                const somethingElseIsSelected = (this.state.zoomedIndex > -1 && !isSelected)

                return <Toy
                    key={i}
                    {...toy}

                    width={size}
                    height={size}

                    zoomed={isSelected}

                    onSelect={() => this.handleSelect(i)}
                    onDeselect={() => this.handleDeselect(i)}
                    hackSomethingElseIsSelected={somethingElseIsSelected}
                />
            })}
        </div>
    }
}

export default App
