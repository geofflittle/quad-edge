import { Point2D, makeLine } from "./two-d"
import { ccw, inCircle } from "./math"

import { Edge } from "./edge"
import { EdgeBag } from "./quad-edge"

export const rightOf = (x: Point2D, e: Edge<Point2D>) => {
    if (!e.odata || !e.ddata) {
        throw new Error("No o or d data")
    }
    return ccw(x, e.ddata, e.odata)
}

export const leftOf = (x: Point2D, e: Edge<Point2D>) => {
    if (!e.odata || !e.ddata) {
        throw new Error("No o or d data")
    }
    return ccw(x, e.odata, e.ddata)
}

export const locate = (x: Point2D, e: Edge<Point2D>): Edge<Point2D> => {
    let cur = e
    let found = false
    while (!found) {
        if (cur.odata == undefined || cur.ddata == undefined) {
            throw new Error("No o or d data")
        } else if (x.equals(cur.odata) || x.equals(cur.ddata)) {
            found = true
        } else if (rightOf(x, cur)) {
            cur = e.sym
        } else if (!rightOf(x, cur.onext)) {
            cur = cur.onext
        } else if (!rightOf(x, cur.dprev)) {
            cur = cur.dprev
        } else {
            found = true
        }
    }
    return cur
}

const EPS = 0.0001

export const onEdge = (x: Point2D, e: Edge<Point2D>): boolean => {
    if (!e.odata || !e.ddata) {
        throw new Error("No o or d data")
    }
    const a = e.odata
    const b = e.ddata
    const t1 = x.minus(a).norm
    const t2 = x.minus(b).norm
    console.log({ a, b, t1, t2 })
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

export const insertSite = (bag: EdgeBag<Point2D>, x: Point2D) => {
    let cur = bag.edge
    if (!cur.odata || !cur.ddata) {
        throw new Error("No o or d data")
    }
    cur = locate(x, cur)
    console.log(`located edge with id ${cur.id}`)
    if (cur.odata == x || cur.ddata == x) {
        return
    }
    // FIXME
    // if (onEdge(x, cur)) {
    //     console.log(`point is on edge`)
    //     cur = cur.oprev
    //     bag.deleteEdge(cur.onext)
    // } else {
    //     console.log(`point is not on edge`)
    // }
    let base = bag.createEdge()
    base.odata = cur.odata
    base.ddata = x
    bag.splice(cur, base)
    const startingEdge = base
    do {
        // Need to check this use of connect
        console.log("connecting")
        base = bag.connect(cur, base.sym)
        cur = base.oprev
    } while (cur.lnext.id != startingEdge.id)

    do {
        const t = cur.oprev
        if (!cur.odata || !cur.ddata || !t.odata || !t.ddata) {
            throw new Error("No o or d data")
        }
        if (rightOf(t.ddata, cur) && inCircle(cur.odata, t.ddata, cur.ddata, x)) {
            console.log("swapping")
            bag.swap(cur)
            cur = cur.oprev
        } else if (cur.onext.id == startingEdge.id) {
            return
        } else {
            console.log("continuing")
            cur = cur.onext.lprev
        }
    } while (true)
}
