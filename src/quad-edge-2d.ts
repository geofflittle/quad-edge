import { Edge } from "./edge"
import { Point2D } from "./two-d"
import { ccw } from "./math"

export const rightOf = (x: Point2D, e: Edge<Point2D>) => e.odata && e.ddata && ccw(x, e.ddata, e.odata)

export const leftOf = (x: Point2D, e: Edge<Point2D>) => e.odata && e.ddata && ccw(x, e.odata, e.ddata)

export const locate = (x: Point2D, e: Edge<Point2D>): Edge<Point2D> | undefined => {
    let cur = e
    let tries = 0
    while (true && tries <= 10) {
        tries++
        console.log("x", {
            x: x.x,
            y: x.y
        })
        console.log("cur", {
            id: cur.id
        })
        if (cur.odata == undefined || cur.ddata == undefined) {
            return undefined
        } else if (x.equals(cur.odata) || x.equals(cur.ddata)) {
            console.log("found")
            return cur
        } else if (rightOf(x, cur)) {
            console.log("rightof cur, using sym")
            cur = e.sym
        } else if (!rightOf(x, cur.onext)) {
            console.log("not rightof cur.onext, using onext")
            cur = cur.onext
        } else if (!rightOf(x, cur.dprev)) {
            console.log("not rightof cur.dprev, using dprev")
            cur = cur.dprev
        } else {
            console.log("found")
            return cur
        }
    }
}
