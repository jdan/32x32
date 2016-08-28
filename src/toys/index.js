import * as hello from "./hello.js"
import * as circle from "./circle.js"

const toys = [circle]

for (let i = 0; i < 200; i++) {
    toys.push(hello)
}

export default toys