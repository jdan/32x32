import * as circle from "./circle.js"
import * as lines from "./lines.js"
import * as bubbles from "./bubbles.js"
import * as oizo from "./oizo.js"
import * as cursor from "./cursor.js"
import * as keys from "./keys.js"
import * as maze from "./maze.js"
import * as blank from "./blank.js"

const toys = [
    circle,
    lines,
    bubbles,
    oizo,
    cursor,
    keys,
    maze,
]

toys[-1] = blank

export default toys
