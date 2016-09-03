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
            this.setState({
                zoomedIndex: -1,
            })
        }
    }

    handleSelect(index) {
        this.setState({
            zoomedIndex: index,
        })
    }

    handleDeselect(index) {
        this.setState({
            zoomedIndex: -1,
        })
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
