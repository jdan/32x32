export function draw({ painter }) {
    painter.rect(0, 0, painter.WIDTH, painter.HEIGHT, "rgb(0, 0, 0)")

    // Paint a random pixel red
    painter.pixel(
        Math.floor(Math.random() * painter.WIDTH),
        Math.floor(Math.random() * painter.WIDTH),
        "rgb(255, 0, 0)")
}

export const title = "Hello, world!"
export const slug = "hello"