import * as hello from "./hello.js"
import * as circle from "./circle.js"
import * as lines from "./lines.js"

const toys = [circle, lines]

for (let i = 0; i < 200; i++) {
    toys.push(hello)
}

export default toys