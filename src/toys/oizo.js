let playing = false
let startTime = null

const BPM = 122
const SAMPLE_LENGTH = 60 * 1000 / BPM * 16

export function draw({ painter, input, frame, play, stop }) {
    // Black background
    painter.rect(0, 0, 32, 32, "rgb(0, 0, 0)")

    const grid = [
        "00000000",
        "00100100",
        "00000000",
        "00222200",
        "02211220",
        "22222222",
        "21111112",
        "22222222",
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
    ], 8, 8)

    if (playing) {
        const timeDelta = (new Date()) - startTime
        const completion = (timeDelta % SAMPLE_LENGTH) / SAMPLE_LENGTH

        // There are 4 steps in the song
        const step = Math.floor(completion * 4)

        // Each step has 16 beats
        const beat = Math.floor((completion % 0.25) * 4 * 16)

        const pattern = "XX-XX-XX-XX-X-X-"
        if (pattern[beat] === "X") {
            // Draw the tongue
            const x = [10, 12, 16, 18][step]
            painter.rect(x, 22, 4, 2, "rgb(255, 0, 0)")
        }
    } else if (input.keyp[80]) {
        // Can we start it some other way?
        playing = true
        startTime = new Date()
        play()
    }

    if (input.keyp[83]) {
        playing = false
        startTime = null
        stop()
    }
}

export const title = "Mr Oizo"
export const slug = "oizo"

// Loop info
export { default as sample } from "./oizo.wav"
export const bpm = BPM
