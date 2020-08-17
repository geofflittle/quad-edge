import { Point2D, makePoint2D } from "../src/two-d"

export const text = (
    ctx: CanvasRenderingContext2D,
    fillStyle: string | CanvasGradient | CanvasPattern,
    font: string,
    value: string,
    a: Point2D
) => {
    ctx.fillStyle = fillStyle
    ctx.font = font
    ctx.fillText(value, a.x, a.y)
}

const translateInf = (x: number) => {
    switch (x) {
        case -Infinity:
            return Number.MIN_SAFE_INTEGER
        case Infinity:
            return Number.MAX_SAFE_INTEGER
        default:
            return x
    }
}

export const line = (
    ctx: CanvasRenderingContext2D,
    a: Point2D,
    b: Point2D,
    lineWidth: number,
    strokeStyle: string | CanvasGradient | CanvasPattern,
    label?: string
) => {
    ctx.beginPath()
    ctx.moveTo(translateInf(a.x), translateInf(a.y))
    ctx.lineTo(translateInf(b.x), translateInf(b.y))
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = strokeStyle
    ctx.stroke()
    if (label != undefined) {
        const dx = b.x - a.x
        const dy = b.y - a.y
        ctx.save()
        ctx.textAlign = "center"
        ctx.translate(a.x + dx / 2, a.y + dy / 2)
        ctx.rotate(Math.atan2(dy, dx))
        text(ctx, strokeStyle, "bold 10px Courier New", label, makePoint2D(0, -10))
        ctx.restore()
    }
}

export const strokeCircle = (
    ctx: CanvasRenderingContext2D,
    center: Point2D,
    r: number,
    lineWidth: number,
    strokeStyle: string | CanvasGradient | CanvasPattern
) => {
    ctx.beginPath()
    ctx.ellipse(center.x, center.y, r, r, 0, 0, 2 * Math.PI)
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = strokeStyle
    ctx.stroke()
}

export const fillCircle = (
    ctx: CanvasRenderingContext2D,
    center: Point2D,
    r: number,
    fillStyle: string | CanvasGradient | CanvasPattern
) => {
    ctx.beginPath()
    ctx.ellipse(center.x, center.y, r, r, 0, 0, 2 * Math.PI)
    ctx.fillStyle = fillStyle
    ctx.fill()
}
