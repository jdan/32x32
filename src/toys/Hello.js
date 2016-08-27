import React from "react"
import Toy from "./Toy.js"

function draw(painter) {
    painter.rect(0, 0, painter.WIDTH, painter.HEIGHT, "rgb(0, 0, 0)")

    // Paint a random pixel red
    painter.pixel(
        Math.floor(Math.random() * painter.WIDTH),
        Math.floor(Math.random() * painter.WIDTH),
        "rgb(255, 0, 0)")
}

const Hello = (props) => {
    return <Toy
        {...props}
        title="Hello, world!"
        draw={draw}
    />
}

export default Hello