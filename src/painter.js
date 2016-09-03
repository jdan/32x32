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

    function _mapPixel(arr, color) {
        for (const {x, y} of arr) {
            pixel(x, y, color)
        }
    }

    function line(x1, y1, x2, y2, color) {
        const line = bresenham(x1, y1, x2, y2)
        _mapPixel(line, color)
    }

    function circle(x0, y0, radius, color) {
        let x = radius
        let y = 0
        let err = 0

        while (x >= y) {
            _mapPixel([
                { x: x0 + x, y: y0 + y },
                { x: x0 + y, y: y0 + x },
                { x: x0 - y, y: y0 + x },
                { x: x0 - x, y: y0 + y },
                { x: x0 - x, y: y0 - y },
                { x: x0 - y, y: y0 - x },
                { x: x0 + y, y: y0 - x },
                { x: x0 + x, y: y0 - y },
            ], color)

            y += 1
            err += 1 + 2*y
            if (2*(err - x) + 1 > 0) {
                x -= 1
                err += 1 - 2*x
            }
        }
    }

    function pixels(grid, palette, x=0, y=0) {
        for (let j = 0; j < grid.length; j++) {
            for (let i = 0; i < grid[j].length; i++) {
                pixel(i+x, j+y, palette[grid[j][i]])
            }
        }
    }

    return {
        // Constants
        WIDTH: PIXEL_COUNT,
        HEIGHT: PIXEL_COUNT,

        // Drawing methods
        pixel,
        pixels,
        rect,
        line,
        circle,
    }
}