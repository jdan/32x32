import Color from "color"

const maze = [
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "XXX  XXX       XXX    XXXXXXXXXX",
    "XXX  XXX XXXXX XXX XXXXXXXXXXXXX",
    "XXXX XXX XXXXX XXX XXX    XXXXXX",
    "XXXX XXX XXXXX         XX XXXXXX",
    "XXXX     XXXXXXXXXXXXX    XXXXXX",
    "XXXX XXXXXXX   @  XXXXXXX XXXXXX",
    "XXXX XXXXXXX XXXXXXXXXXXX XXXXXX",
    "XXXX           XXXXXXXXXXXXXXXXX",
    "XXXXXXX XXXXXXXXXXXXXXXXX XXXXXX",
    "XXX XXX XXXXXXXXXXXXXX    XXXXXX",
    "XXX XXX          XXXXX XXXXXXXXX",
    "XXX XXXXXXXXX XXXXXXXX XXXXXXXXX",
    "XXX                        XXXXX",
    "XXXXXXXXXXXXX XXXXXXXXXXXXXXXXXX",
    "XXXXXXX                XXXXXX XX",
    "XXX     XXXXXXXXXXXX XXXXXXXX XX",
    "XXXXXXX XXXXXXXXXXXX XXXXXXXX XX",
    "XXXXXXX      XXXXXXX       XX XX",
    "XX   XXXXXXX    XXXX XXXXX    XX",
    "XXX XXXXXXXXXX XXXXX XXXXX XXXXX",
    "XXX      XXXXX XXXXX       XXXXX",
    "XXX XXXX XXXXX XXXXX XXXXXXXXXXX",
    "XXXXXXXX XXXXX       XXXX    XXX",
    "XXXX     XXXXX XXXXX XXXX XXXXXX",
    "XXXX XXX XXXXX XXXXX       XXXXX",
    "XXXX XXX XXXXX XXXXXXXXX XXXXXXX",
    "XXXX           XXXXXXXXX XXXXXXX",
    "XXXXXXXXX XXXXXXXXXXXXXX XXXXXXX",
    "XXXXXXXXX       #        XXXXXXX",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
]

function characterToCoords(c) {
    const y = maze.findIndex((row) => row.split("").indexOf(c) > -1)
    const x = maze[y].split("").findIndex((i) => i === c)

    return { x, y }
}

let character = characterToCoords("#")
let hasWon = false

function getBackgroundColor(hasWon, frame) {
    if (!hasWon) {
        return "rgb(0, 200, 0)"
    }

    const color = Color().hsl((frame * 3) % 360, 100, 50)
    return color.rgbString()
}

export function draw({ painter, input, frame }) {
    painter.pixels(maze, {
        "X": getBackgroundColor(hasWon, frame),
        "@": "rgb(200, 200, 0)",
    })

    painter.pixel(character.x, character.y, "rgb(100, 100, 200)")

    if (hasWon) {
        return
    }

    let dx = 0
    let dy = 0
    if (input.keyp["ArrowUp"]) {
        dy = -1
    } else if (input.keyp["ArrowDown"]) {
        dy = 1
    } else if (input.keyp["ArrowLeft"]) {
        dx = -1
    } else if (input.keyp["ArrowRight"]) {
        dx = 1
    }

    const tile = maze[character.y + dy][character.x + dx]
    if (tile === "X") {
        return
    }

    if (tile === "@") {
        hasWon = true
    }
    character.x += dx
    character.y += dy
}

export const title = "Maze"
export const slug = "maze"