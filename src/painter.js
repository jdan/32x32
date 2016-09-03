import bresenham from "bresenham"

export function createPainter(ctx, width, height) {
    const PIXEL_COUNT = 32
    const PIXEL_WIDTH = width / PIXEL_COUNT
    const PIXEL_HEIGHT = height / PIXEL_COUNT

    function rect(x, y, w, h, color) {
        ctx.save()
        ctx.fillStyle = color
        ctx.fillRect(x*PIXEL_WIDTH, y*PIXEL_HEIGHT, w*PIXEL_WIDTH, h*PIXEL_HEIGHT)
        ctx.restore()
    }

    function pixel(x, y, color) {
        rect(x, y, 1, 1, color)
    }

    function line(x1, y1, x2, y2, color) {
        const line = bresenham(x1, y1, x2, y2)
        for (const {x, y} of line) {
            pixel(x, y, color)
        }
    }

    return {
        // Constants
        WIDTH: PIXEL_COUNT,
        HEIGHT: PIXEL_COUNT,

        // Drawing methods
        pixel,
        rect,
        line,
    }
}