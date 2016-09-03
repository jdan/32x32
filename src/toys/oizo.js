export function draw({ painter }) {
    // Black background
    painter.rect(0, 0, 32, 32, "rgb(0, 0, 0)")

    const grid = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 2, 2, 2, 2, 0, 0],
        [0, 2, 2, 1, 1, 2, 2, 0],
        [2, 2, 2, 2, 2, 2, 2, 2],
        [2, 1, 1, 1, 1, 1, 1, 2],
        [2, 2, 3, 3, 2, 2, 2, 2],
    ]

    // Scale the grid from 8x8 to 16x12
    const expandedGrid = []
    for (let row of grid) {
        const expandedRow = []
        for (let item of row) {
            // Push each item 2 times
            expandedRow.push(item)
            expandedRow.push(item)
        }
        // Push each row 2 times
        expandedGrid.push(expandedRow)
        expandedGrid.push(expandedRow)
    }

    painter.pixels(expandedGrid, [
        "rgb(255, 255, 0)",
        "rgb(0, 0, 0)",
        "rgb(255, 255, 255)",
        "rgb(255, 0, 0)",
    ], 8, 8)
}

export const title = "Mr Oizo"