const r = Math.floor(Math.random() * 255)
const g = Math.floor(Math.random() * 255)
const b = Math.floor(Math.random() * 255)

export function draw({ painter, frame }) {
    painter.rect(0, 0, painter.WIDTH, painter.HEIGHT, `rgb(${r}, ${g}, ${b})`)

    const theta = frame * (2 * Math.PI) / 200
    const radius = (painter.WIDTH / 2)

    const x = radius * 0.8 * Math.cos(theta) + radius
    const y = radius * 0.8 * Math.sin(theta) + radius

    painter.pixel(Math.round(x), Math.round(y), "rgb(255, 255, 255)")
}

export const title = "A circle!"
export const slug = "circle"