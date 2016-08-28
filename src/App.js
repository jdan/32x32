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

    handleZoom(index) {
        this.setState({
            zoomedIndex: index,
        })
    }

    render() {
        const size = 80

        return <div>
            {toys.map((toy, i) => {
                return <Toy
                    key={i}
                    {...toy}

                    width={size}
                    height={size}

                    running={false}

                    onSelect={() => this.handleZoom(i)}
                    zoomed={(this.state.zoomedIndex === i)}
                />
            })}
        </div>
    }
}

export default App
