import React, { Component } from "react"
import toys from "./toys"
import Toy from "./Toy.js"

class App extends Component {
    render() {
        const size = 64

        return <div>
            {toys.map((toy, i) => {
                return <Toy
                    key={i}
                    width={size}
                    height={size}
                    running={false}
                    draw={toy.draw}
                    title={toy.title}
                    description={toy.description}
                />
            })}
        </div>
    }
}

export default App
