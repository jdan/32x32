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

    return {
        // Constants
        WIDTH: PIXEL_COUNT,
        HEIGHT: PIXEL_COUNT,

        // Drawing methods
        pixel,
        rect,
    }
}