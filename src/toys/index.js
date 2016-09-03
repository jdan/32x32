import * as hello from "./hello.js"
import * as circle from "./circle.js"
import * as lines from "./lines.js"
import * as bubbles from "./bubbles.js"

const toys = [circle, lines, bubbles]

for (let i = 0; i < 200; i++) {
    toys.push(hello)
}

export default toys