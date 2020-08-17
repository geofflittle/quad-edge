import { Point2D, makeLine, makePoint2D } from "./two-d"
import { comp, makePoly, mult, sub } from "./polynomial"

export type Matrix3x3 = [[number, number, number], [number, number, number], [number, number, number]]

export const determinant3x3 = ([[a, b, c], [d, e, f], [g, h, i]]: Matrix3x3) =>
    a * e * i + b * f * g + c * d * h - g * e * c - h * f * a - i * d * b

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

/**
 * Note, this assumes the points lie on the euclidean plane with the y-axis pointing "down"
 */
export const ccw = (a: Point2D, b: Point2D, c: Point2D): boolean => {
    const a_x = makePoly(a.x)
    const a_y = makePoly(a.y)
    const b_x = makePoly(b.x)
    const b_y = makePoly(b.y)
    const c_x = makePoly(c.x)
    const c_y = makePoly(c.y)
    const det = sub(mult(sub(b_x, a_x), sub(c_y, a_y)), mult(sub(c_x, a_x), sub(b_y, a_y)))
    return comp(det, [1]) == -1
}

export const ccw2 = (a: Point2D, b: Point2D, c: Point2D): boolean => {
    return true
}

/**
 * Note, this assumes the points lie on the euclidean plane with the y-axis pointing "down"
 */
export const inCircle = (a: Point2D, b: Point2D, c: Point2D, d: Point2D) => {
    const adx = translateInf(a.x) - translateInf(d.x)
    const ady = translateInf(a.y) - translateInf(d.y)
    const bdx = translateInf(b.x) - translateInf(d.x)
    const bdy = translateInf(b.y) - translateInf(d.y)
    const cdx = translateInf(c.x) - translateInf(d.x)
    const cdy = translateInf(c.y) - translateInf(d.y)
    const abdet = adx * bdy - bdx * ady
    const bcdet = bdx * cdy - cdx * bdy
    const cadet = cdx * ady - adx * cdy
    const alift = adx * adx + ady * ady
    const blift = bdx * bdx + bdy * bdy
    const clift = cdx * cdx + cdy * cdy
    return alift * bcdet + blift * cadet + clift * abdet <= 0
}

export const getCircle = (a: Point2D, b: Point2D, c: Point2D): [Point2D, number] => {
    const alift = a.x * a.x + a.y * a.y
    const blift = b.x * b.x + b.y * b.y
    const clift = c.x * c.x + c.y * c.y
    const x_num = determinant3x3([
        [alift, a.y, 1],
        [blift, b.y, 1],
        [clift, c.y, 1]
    ])
    const y_num = determinant3x3([
        [a.x, alift, 1],
        [b.x, blift, 1],
        [c.x, clift, 1]
    ])
    const denom =
        2 *
        determinant3x3([
            [a.x, a.y, 1],
            [b.x, b.y, 1],
            [c.x, c.y, 1]
        ])
    const x = x_num / denom
    const y = y_num / denom
    const r = Math.sqrt(Math.pow(a.x - x, 2) + Math.pow(a.y - y, 2))
    return [makePoint2D(x, y), r]
}
