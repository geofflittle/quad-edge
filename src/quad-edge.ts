import { Point2D, makeLine } from "./point-2d"

import { generateId } from "ts-core"

const EPS = 0.001

export interface Edge<T> {
    readonly id: string
    data: T
    org: T
    dest: T
    readonly rot: Edge<T>
    readonly sym: Edge<T>
    readonly invrot: Edge<T>
    onext: Edge<T>
    readonly oprev: Edge<T>
    readonly dnext: Edge<T>
    readonly dprev: Edge<T>
    readonly lnext: Edge<T>
    readonly lprev: Edge<T>
    readonly rnext: Edge<T>
    readonly rprev: Edge<T>
    readonly oorbit: Edge<T>[]
    readonly dorbit: Edge<T>[]
    readonly lorbit: Edge<T>[]
    readonly rorbit: Edge<T>[]
}

export type QuadEdge<T> = [Edge<T>, Edge<T>, Edge<T>, Edge<T>]

/*

\                ^ 
 \ dnext        / oprev
  \            /
   v  e       /
    <---------
   ^          \
  /            \
 / dprev        \ onext
/                v

---

^                / 
 \ rprev        / rnext
  \            /
   \  e       v
    <---------
   /          ^
  /            \
 / lnext        \ lprev
v                \

*/
const edge = <T>(quad: QuadEdge<T>, index: number): Edge<T> => {
    const id = generateId()
    let data: T
    let onext: Edge<T>
    const e = {
        get id() {
            return id
        },
        set data(d: T) {
            data = d
        },
        get org() {
            return data
        },
        // TODO: Setting the org should set the orgs for the other orbits
        set org(d: T) {
            // this.oorbit.forEach(e => {
            //     console.log("setting data for", e.id)
            e.data = d
            // })
        },
        get dest() {
            return this.sym.org
        },
        set dest(d: T) {
            this.sym.org = d
        },
        get rot() {
            return quad[(index + 1) % 4]
        },
        get sym() {
            return quad[(index + 2) % 4]
        },
        get invrot() {
            return quad[(index + 3) % 4]
        },
        get onext() {
            return onext
        },
        set onext(e: Edge<T>) {
            onext = e
        },
        get oprev() {
            return this.rot.onext.rot
        },
        get dnext() {
            return this.sym.onext.sym
        },
        get dprev() {
            return this.invrot.onext.invrot
        },
        get lnext() {
            return this.invrot.onext.rot
        },
        get lprev() {
            return this.onext.sym
        },
        get rnext() {
            return this.rot.onext.invrot
        },
        get rprev() {
            return this.sym.onext
        },
        get index() {
            return index
        },
        // TODO: Fix the following
        get oorbit() {
            const seen: { [key: string]: Edge<T> } = {}
            let cur: Edge<T> = this
            do {
                seen[cur.id] = cur
                cur = cur.onext
            } while (!seen[cur.id])
            return [...Object.values(seen)]
        },
        get dorbit() {
            const seen: { [key: string]: Edge<T> } = {}
            let cur: Edge<T> = this
            do {
                seen[cur.id] = cur
                cur = cur.dnext
            } while (!seen[cur.id])
            return [...Object.values(seen)]
        },
        get lorbit() {
            const seen: { [key: string]: Edge<T> } = {}
            let cur: Edge<T> = this
            do {
                seen[cur.id] = cur
                cur = cur.lnext
            } while (!seen[cur.id])
            return [...Object.values(seen)]
        },
        get rorbit() {
            const seen: { [key: string]: Edge<T> } = {}
            let cur: Edge<T> = this
            do {
                seen[cur.id] = cur
                cur = cur.rnext
            } while (!seen[cur.id])
            return [...Object.values(seen)]
        }
    }
    return (onext = e)
}

export const makeEdge = <T>(org: T, dest: T) => {
    const quad: QuadEdge<T> = <QuadEdge<T>>new Array(4)
    const e_0 = (quad[0] = edge(quad, 0))
    const e_1 = (quad[1] = edge(quad, 1))
    const e_2 = (quad[2] = edge(quad, 2))
    const e_3 = (quad[3] = edge(quad, 3))
    e_0.onext = e_0
    e_1.onext = e_3
    e_2.onext = e_2
    e_3.onext = e_1
    e_0.data = org
    e_0.sym.data = dest
    return e_0
}

/**
 * Splice takes two edges and concats their edge rings.  If these edges are
 * singular and disjoint, this operation will set each edge's onext and rot's
 * onext to the other.  If these edges are joined and have each other as onexts,
 * this operation will split them so that they are singular.
 *
 * If either of these edges is not singular, splice concats their left faces.
 */
export const splice = <T>(a: Edge<T>, b: Edge<T>) => {
    const alpha = a.onext.rot
    const beta = b.onext.rot

    const t1 = b.onext
    const t2 = a.onext
    const t3 = beta.onext
    const t4 = alpha.onext
    a.onext = t1
    b.onext = t2
    alpha.onext = t3
    beta.onext = t4
}

export const deleteEdge = <T>(e: Edge<T>) => {
    splice(e, e.oprev)
    splice(e.sym, e.sym.oprev)
}

export const subdivision = <T>(a: T, b: T, c: T) => {
    const e_a = makeEdge(a, b)
    const e_b = makeEdge(b, c)
    const e_c = makeEdge(c, a)
    splice(e_a.sym, e_b)
    splice(e_b.sym, e_c)
    splice(e_c.sym, e_a)
    return e_a
}

export const addEdge = <T>(e_0: Edge<T>, t: T) => {
    const e_1 = makeEdge(e_0.dest, t)
    splice(e_0.sym, e_1)
    return e_1
}

export const polygon = <T>(ts: T[]) => {
    if (ts.length < 2) {
        throw new Error()
    }
    const first = makeEdge(ts[0], ts[1])
    const last = ts.slice(1).reduce(addEdge, first)
    splice(last.sym, first)
    return first
}

/**
 * Add a new edge e connecting the destination of a to the origin of b, in such
 * a way that all three have the same left face after the connection is
 * complete.
 * Additionally, the data pointers of the new edge are set.
 *
 * @param a
 * @param b
 */
export const connect = <T>(a: Edge<T>, b: Edge<T>) => {
    const e = makeEdge(a.dest, b.org)
    splice(e, a.lnext)
    splice(e.sym, b)
    return e
}

// export const swap = <T>(e: Edge<T>) => {
//     const a = e.oprev
//     const b = e.sym.oprev
//     splice(e, a)
//     splice(e.sym, b)
//     splice(e, a.lnext)
//     splice(e.sym, b.lnext)
//     e.org = a.dest
//     e.dest = b.dest
// }

// // double the area defined by a, b, and c
// export const triArea = (a: Point2D, b: Point2D, c: Point2D) => (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x)

// // true iff d is inside the circle defined by a, b, and c
// export const inCircle = (a: Point2D, b: Point2D, c:Point2D, d:Point2D) =>
//     (a.x*a.x + a.y*a.y) * triArea(b, c, d) -
//     (b.x*b.x + b.y*b.y) * triArea(a, c, d) +
//     (c.x*c.x + c.y*c.y) * triArea(a, b, d) -
//     (d.x*d.x + d.y*d.y) * triArea(a, b, c) > 0

// // true iff a, b, and c are in counterclockwise order
// export const ccw = (a: Point2D, b: Point2D, c: Point2D) => triArea(a,b,c) > 0

// export const rightOf = (a: Point2D, e: Edge<Point2D>) => ccw(a, e.dest, e.org)

// export const leftOf = (a: Point2D, e: Edge<Point2D>) => ccw(a, e.org, e.dest)

// export const onEdge = (a: Point2D, e: Edge<Point2D>) => {
//     const t1 = a.minus(e.org).norm
//     const t2 = a.minus(e.dest).norm
//     if (t1 < EPS || t2 < EPS) {
//         return true
//     }
//     const t3 = e.org.minus(e.dest).norm
//     if (t1 > t3 || t2 > t3) {
//         return false
//     }
//     const line = makeLine(e.org, e.dest)
//     return Math.abs(line.eval(a)) < EPS
// }

// export const locate = (e: Edge<Point2D>, a: Point2D) => {
//     let cur = e
//     while (true) {
//         if (a.equals(cur.org) || a.equals(cur.dest)) {
//             return cur
//         }
//         if (rightOf(a, cur)) {
//             cur = e.sym
//             continue
//         }
//         if (!rightOf(a, e.onext)) {
//             cur = e.onext
//             continue
//         }
//         if (!rightOf(a, e.dprev)) {
//             cur = e.dprev
//             continue
//         }
//         return cur
//     }
// }

// export const insertSite = (edge: Edge<Point2D>, a: Point2D) => {
//     let e = locate(edge, a)
//     if (a.equals(e.org) || a.equals(e.dest)) {
//         return
//     }
//     if (onEdge(a, e)) {
//         e = e.oprev
//         deleteEdge(e.onext)
//     }

//     let base = makeEdge(e.org, a)
//     splice(base, e)
//     let e_1 = base
//     do {
//         base = connect(e, base.sym)
//         e = base.oprev
//     } while (e.lnext != e_1)

//     do {
//         const t = e.oprev
//         if (rightOf(t.dest, e) && inCircle(e.org, t.dest, e.dest, a)) {
//             swap(e)
//             e = e.oprev
//             continue
//         }
//         if (e.onext == e_1) {
//             return
//         }
//         e = e.onext.lprev
//     } while (true)
// }
