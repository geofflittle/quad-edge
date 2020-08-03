import { Point2D, makeLine, makePoint2D } from "./two-d"

export type Matrix3x3 = [[number, number, number], [number, number, number], [number, number, number]]

export const determinant3x3 = ([[a, b, c], [d, e, f], [g, h, i]]: Matrix3x3) =>
    a * e * i + b * f * g + c * d * h - g * e * c - h * f * a - i * d * b

/**
 * Note, this assumes the points lie on the euclidean plane with the y-axis pointing "down"
 */
export const ccw = (a: Point2D, b: Point2D, c: Point2D): boolean =>
    determinant3x3([
        [a.x, a.y, 1],
        [b.x, b.y, 1],
        [c.x, c.y, 1]
    ]) <= 0

/**
 * Note, this assumes the points lie on the euclidean plane with the y-axis pointing "down"
 */
export const inCircle = (a: Point2D, b: Point2D, c: Point2D, d: Point2D) => {
    const adx = a.x - d.x
    const ady = a.y - d.y
    const bdx = b.x - d.x
    const bdy = b.y - d.y
    const cdx = c.x - d.x
    const cdy = c.y - d.y
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

const EPS = 0.000001

export const onEdge = (x: Point2D, a: Point2D, b: Point2D) => {
    const t1 = x.minus(a).norm
    const t2 = x.minus(b).norm
    if (t1 < EPS || t2 < EPS) {
        return true
    }
    const t3 = a.minus(b).norm
    if (t1 > t3 || t2 > t3) {
        return false
    }
    const line = makeLine(a, b)
    return Math.abs(line.eval(a)) < EPS
}
