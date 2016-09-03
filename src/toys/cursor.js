export function draw({ painter, input }) {
    painter.rect(0, 0, 32, 32, "rgb(0, 0, 0)")

    painter.pixels([
        [0, 0, 0, 1],
        [0, 0, 1, 1],
        [0, 1, 0, 1],
        [1, 1, 1, 0],
    ], [
        "rgb(255, 255, 255)",
        "rgba(255, 255, 255, 0)",
    ], input.x, input.y)
}

export const title = "A mouse cursor"