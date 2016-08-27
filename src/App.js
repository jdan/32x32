import React, { Component } from "react"
import toys from "./toys"

class App extends Component {
    render() {
        const size = 64

        return <div>
            {toys.map((Item, i) => {
                return <Item
                    key={i}
                    width={size}
                    height={size}
                    running={false}
                />
            })}
        </div>
    }
}

export default App
