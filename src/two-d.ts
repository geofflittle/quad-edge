export interface Point2D {
    readonly x: number
    readonly y: number
    readonly norm: number
    equals: (a: Point2D) => boolean
    minus: (a: Point2D) => Point2D
    toJSON: () => object
}

export interface Line2D {
    readonly a: number
    readonly b: number
    readonly c: number
    eval: (p: Point2D) => number
}

export const makePoint2D = (x: number, y: number): Point2D => ({
    x,
    y,
    get norm() {
        return Math.sqrt(x * x + y * y)
    },
    equals: (p: Point2D) => x == p.x && y == p.y,
    minus: (p: Point2D) => makePoint2D(x - p.x, y - p.y),
    toJSON() {
        return {
            x,
            y,
            norm: this.norm
        }
    }
})

export const makeLine = (p: Point2D, q: Point2D): Line2D => {
    const t = q.minus(p)
    const len = t.norm
    const a = t.y / len
    const b = -t.x / len
    const c = -(a * p.x + b * p.y)
    return {
        a,
        b,
        c,
        eval: (p: Point2D) => a * p.x + b * p.y + c
    }
}
