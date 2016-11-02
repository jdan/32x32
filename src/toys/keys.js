// Let's show off how input.key and input.keyp work

let keyDecay = 0
let keypDecay = 0

const A = 65

export function draw({ painter, input, frame }) {
    painter.background("rgb(0, 0, 0)")

    keyDecay = Math.max(keyDecay - 1, 0)
    keypDecay = Math.max(keypDecay - 1, 0)

    if (input.key[A]) {
        keyDecay = 255
    }

    if (input.keyp[A]) {
        keypDecay = 255
    }

    painter.rect(0, 0, 32, 16, `rgb(0, ${keyDecay}, ${keyDecay})`)
    painter.rect(0, 16, 32, 32, `rgb(0, ${keypDecay}, ${keypDecay})`)
}

export const title = "Keyboard input"
export const slug = "keys"