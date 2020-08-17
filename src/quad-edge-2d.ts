import { Point2D, makeLine } from "./two-d"
import { ccw, inCircle } from "./math"

import { Edge } from "./edge"
import { EdgeBag } from "./quad-edge"
import { cons } from "fp-ts/lib/NonEmptyArray"

export const rightOf = (p: Point2D, a: Point2D, b: Point2D) => {
    return ccw(p, b, a)
}

export const leftOf = (p: Point2D, a: Point2D, b: Point2D) => {
    return ccw(p, a, b)
}

export const locate = (p: Point2D, e: Edge<Point2D>): Edge<Point2D> => {
    let cur = e
    let located = false
    while (!located) {
        // console.log(`checking locate for ${cur}`)
        if (cur.odata == undefined || cur.ddata == undefined) {
            throw new Error("No o or d data")
        } else if (p.equals(cur.odata) || p.equals(cur.ddata)) {
            located = true
        } else if (rightOf(p, cur.odata, cur.ddata)) {
            // console.log(`${p} is to the right of cur ${cur}`)
            cur = cur.sym
        } else if (cur.onext.odata == undefined || cur.onext.ddata == undefined) {
            throw new Error("No o or d data")
        } else if (!rightOf(p, cur.onext.odata, cur.onext.ddata)) {
            // console.log(`${p} is not to the right of cur.onext ${cur.onext}`)
            cur = cur.onext
        } else if (cur.dprev.odata == undefined || cur.dprev.ddata == undefined) {
            throw new Error("No o or d data")
        } else if (!rightOf(p, cur.dprev.odata, cur.dprev.ddata)) {
            // console.log(`${p} is not to the right of cur.dprev ${cur.dprev}`)
            cur = cur.dprev
        } else {
            // console.log(`located ${cur}`)
            located = true
        }
    }
    return cur
}

const EPS = 0.0001

export const onEdge = (p: Point2D, e: Edge<Point2D>): boolean => {
    if (!e.odata || !e.ddata) {
        throw new Error("No o or d data")
    }
    const a = e.odata
    const b = e.ddata
    const t1 = p.minus(a).norm
    const t2 = p.minus(b).norm
    // console.log({ a, b, t1, t2 })
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

const isInf = (x: number) => x == -Infinity || x == Infinity

export const isBoundaryPoint = (p: Point2D) => isInf(p.x) || isInf(p.y)

export const isBoundaryEdge = (e: Edge<Point2D>) =>
    e.odata && isBoundaryPoint(e.odata) && e.ddata && isBoundaryPoint(e.ddata)

export const insertSite = (bag: EdgeBag<Point2D>, p: Point2D) => {
    // console.log(`inserting ${p}`)
    let loc = bag.edge
    if (!loc.odata || !loc.ddata) {
        throw new Error("No o or d data")
    }
    // Locate an edge whose left face contains the site
    loc = locate(p, loc)
    if (loc.odata == p || loc.ddata == p) {
        return
    }
    // FIXME: Address the case where the site is on an existing edge
    // if (onEdge(x, cur)) {
    //     console.log(`point is on edge`)
    //     cur = cur.oprev
    //     bag.deleteEdge(cur.onext)
    // } else {
    //     console.log(`point is not on edge`)
    // }

    // Get the face that the point lies within
    const face = Array.from(loc.lorbit)
    // console.log(`got face ${face.map((e) => `${e}`).join(", ")}`)

    // Create the first spoke to the site
    const firstSpoke = bag.createEdge()
    firstSpoke.odata = p

    let spoke = firstSpoke
    bag.splice(loc, spoke.sym)
    // console.log(`created spoke ${spoke}`)
    face.forEach((e) => {
        if (e.id == loc.id) {
            // We've already created a spoke for this edge, it was the first one
            return
        }
        // Create the next spoke
        spoke = bag.connect(spoke, e)
        // console.log(`created spoke ${spoke}`)
    })

    let e
    const seen: Set<string> = new Set()
    const queue: Edge<Point2D>[] = [loc]
    while ((e = queue.shift()) != undefined) {
        // console.log(`checking delaunay for ${e}`)
        if (seen.has(e.id)) {
            // console.log(`have seen ${e}`)
            continue
        }
        const t = e.oprev
        if (!t.ddata || !t.odata || !e.odata || !e.ddata) {
            throw new Error("No data")
        } else if (rightOf(t.ddata, e.odata, e.ddata) && inCircle(e.odata, t.ddata, e.ddata, p)) {
            // console.log(`${p} is in circle of ${e} and ${t}`)
            if (!isBoundaryEdge(e)) {
                // console.log(`swapping ${e.id}`)
                bag.swap(e)
            } else {
                // console.log(`not swapping ${e.id}`)
            }
            if (!seen.has(e.oprev.id)) {
                queue.push(e.oprev)
            }
        } else {
            // console.log(`popping an edge`)
            if (!seen.has(e.onext.lprev.id)) {
                queue.push(e.onext.lprev)
            }
        }
        seen.add(e.id)
    }
}
