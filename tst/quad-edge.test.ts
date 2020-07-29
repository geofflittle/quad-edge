import {
    Edge,
    QuadEdge,
    addEdge,
    connect,
    deleteEdge,
    edgeToString,
    makeEdge,
    polygon,
    splice,
    swap
} from "../src/quad-edge"

import { makePoint2D } from "../src/point-2d"

const verifyIsolatedEdge = <T>(e_0: Edge<T>) => {
    const e_1 = e_0.rot
    const e_2 = e_1.rot
    const e_3 = e_2.rot

    // e_0's rot is e_1
    expect(e_0.rot).toEqual(e_1)

    // e_0's sym is e_2
    expect(e_0.sym).toEqual(e_2)

    // e_0's invrot is e_3
    expect(e_0.invrot).toEqual(e_3)

    // e_0's onext is e_0
    expect(e_0.onext).toEqual(e_0)

    // e_0's oprev is e_0
    expect(e_0.oprev).toEqual(e_0)

    // e_0's dnext is e_0
    expect(e_0.dnext).toEqual(e_0)

    // e_0's dprev is e_0
    expect(e_0.dprev).toEqual(e_0)

    // e_0's lnext is e_0's sym
    expect(e_0.lnext).toEqual(e_0.sym)

    // e_0's lprev is e_0's sym
    expect(e_0.lprev).toEqual(e_0.sym)

    // e_0's rnext is e_0's sym
    expect(e_0.rnext).toEqual(e_0.sym)

    // e_0's rprev is e_0's sym
    expect(e_0.rprev).toEqual(e_0.sym)

    // TODO: Add orbits
}

const verifyLine = <T>(e_0: Edge<T>, e_1: Edge<T>) => {
    // e_0 has no onext, e_1 has e_0's sym as onext
    expect(e_0.onext.id).toEqual(e_0.id)
    expect(e_1.onext.id).toEqual(e_0.sym.id)

    // e_0 has no oprev, e_1 has e_0's sym as oprev
    expect(e_0.oprev.id).toEqual(e_0.id)
    expect(e_1.oprev.id).toEqual(e_0.sym.id)

    // e_0 has e_1's sym as dnext, e_1 has no dnext
    expect(e_0.dnext.id).toEqual(e_1.sym.id)
    expect(e_1.dnext.id).toEqual(e_1.id)

    // e_0 has e_1's sym as dprev, e_1 has no dprev
    expect(e_0.dprev.id).toEqual(e_1.sym.id)
    expect(e_1.dprev.id).toEqual(e_1.id)

    // e_0 has e_1 as lnext, e_1 has e_1's sym as lnrxt
    expect(e_0.lnext.id).toEqual(e_1.id)
    expect(e_1.lnext.id).toEqual(e_1.sym.id)

    // e_0 has e_1's sym as lprev, e_1 has e_0 as lprev
    expect(e_0.lprev.id).toEqual(e_0.sym.id)
    expect(e_1.lprev.id).toEqual(e_0.id)

    // e_0 has e_0's sym as rnext, e_1 has e_0 as rnext
    expect(e_0.rnext.id).toEqual(e_0.sym.id)
    expect(e_1.rnext.id).toEqual(e_0.id)

    // e_0 has e_1 as rprev, e_1 has e_1's sym as rprev
    expect(e_0.rprev.id).toEqual(e_1.id)
    expect(e_1.rprev.id).toEqual(e_1.sym.id)
}

const verifyLoop = <T>(loopEdgeRef: Edge<T>) => {
    const e_a = loopEdgeRef
    const e_b = e_a.lnext

    // onext relationships
    expect(e_a.onext.id).toEqual(e_b.sym.id)
    expect(e_b.onext.id).toEqual(e_a.sym.id)

    // oprev relationships
    expect(e_a.oprev.id).toEqual(e_b.sym.id)
    expect(e_b.oprev.id).toEqual(e_a.sym.id)

    // dnext relationships
    expect(e_a.dnext.id).toEqual(e_b.sym.id)
    expect(e_b.dnext.id).toEqual(e_a.sym.id)

    // dprev relationships
    expect(e_a.dprev.id).toEqual(e_b.sym.id)
    expect(e_b.dprev.id).toEqual(e_a.sym.id)

    // lnext relationships
    expect(e_a.lnext.id).toEqual(e_b.id)
    expect(e_b.lnext.id).toEqual(e_a.id)

    // lprev relationships
    expect(e_a.lprev.id).toEqual(e_b.id)
    expect(e_b.lprev.id).toEqual(e_a.id)

    // rnext relationships
    expect(e_a.rnext.id).toEqual(e_b.id)
    expect(e_b.rnext.id).toEqual(e_a.id)

    // rprev relationships
    expect(e_a.rprev.id).toEqual(e_b.id)
    expect(e_b.rprev.id).toEqual(e_a.id)

    // oorbit relationships
    expect(e_a.oorbit.map((e) => e.id)).toEqual([e_a.id, e_b.sym.id])
    expect(e_b.oorbit.map((e) => e.id)).toEqual([e_b.id, e_a.sym.id])

    // dorbit relationships
    expect(e_a.dorbit.map((e) => e.id)).toEqual([e_a.id, e_b.sym.id])
    expect(e_b.dorbit.map((e) => e.id)).toEqual([e_b.id, e_a.sym.id])

    // lorbit relationships
    expect(e_a.lorbit.map((e) => e.id)).toEqual([e_a.id, e_b.id])
    expect(e_b.lorbit.map((e) => e.id)).toEqual([e_b.id, e_a.id])

    // rorbit relationships
    expect(e_a.rorbit.map((e) => e.id)).toEqual([e_a.id, e_b.id])
    expect(e_b.rorbit.map((e) => e.id)).toEqual([e_b.id, e_a.id])
}

const verifyTriangle = <T>(triangleEdgeRef: Edge<T>) => {
    const e_a = triangleEdgeRef
    const e_b = e_a.lnext
    const e_c = e_b.lnext

    // onext relationships
    expect(e_a.onext.id).toEqual(e_c.sym.id)
    expect(e_b.onext.id).toEqual(e_a.sym.id)
    expect(e_c.onext.id).toEqual(e_b.sym.id)

    // oprev relationships
    expect(e_a.oprev.id).toEqual(e_c.sym.id)
    expect(e_b.oprev.id).toEqual(e_a.sym.id)
    expect(e_c.oprev.id).toEqual(e_b.sym.id)

    // dnext relationships
    expect(e_a.dnext.id).toEqual(e_b.sym.id)
    expect(e_b.dnext.id).toEqual(e_c.sym.id)
    expect(e_c.dnext.id).toEqual(e_a.sym.id)

    // dprev relationships
    expect(e_a.dprev.id).toEqual(e_b.sym.id)
    expect(e_b.dprev.id).toEqual(e_c.sym.id)
    expect(e_c.dprev.id).toEqual(e_a.sym.id)

    // lnext relationships
    expect(e_a.lnext.id).toEqual(e_b.id)
    expect(e_b.lnext.id).toEqual(e_c.id)
    expect(e_c.lnext.id).toEqual(e_a.id)

    // lprev relationships
    expect(e_a.lprev.id).toEqual(e_c.id)
    expect(e_b.lprev.id).toEqual(e_a.id)
    expect(e_c.lprev.id).toEqual(e_b.id)

    // rnext relationships
    expect(e_a.rnext.id).toEqual(e_c.id)
    expect(e_b.rnext.id).toEqual(e_a.id)
    expect(e_c.rnext.id).toEqual(e_b.id)

    // rprev relationships
    expect(e_a.rprev.id).toEqual(e_b.id)
    expect(e_b.rprev.id).toEqual(e_c.id)
    expect(e_c.rprev.id).toEqual(e_a.id)

    // oorbit relationships
    expect(e_a.oorbit.map((e) => e.id)).toEqual([e_a.id, e_c.sym.id])
    expect(e_b.oorbit.map((e) => e.id)).toEqual([e_b.id, e_a.sym.id])
    expect(e_c.oorbit.map((e) => e.id)).toEqual([e_c.id, e_b.sym.id])

    // dorbit relationships
    expect(e_a.dorbit.map((e) => e.id)).toEqual([e_a.id, e_b.sym.id])
    expect(e_b.dorbit.map((e) => e.id)).toEqual([e_b.id, e_c.sym.id])
    expect(e_c.dorbit.map((e) => e.id)).toEqual([e_c.id, e_a.sym.id])

    // lorbit relationships
    expect(e_a.lorbit.map((e) => e.id)).toEqual([e_a.id, e_b.id, e_c.id])
    expect(e_b.lorbit.map((e) => e.id)).toEqual([e_b.id, e_c.id, e_a.id])
    expect(e_c.lorbit.map((e) => e.id)).toEqual([e_c.id, e_a.id, e_b.id])

    // rorbit relationships
    expect(e_a.rorbit.map((e) => e.id)).toEqual([e_a.id, e_c.id, e_b.id])
    expect(e_b.rorbit.map((e) => e.id)).toEqual([e_b.id, e_a.id, e_c.id])
    expect(e_c.rorbit.map((e) => e.id)).toEqual([e_c.id, e_b.id, e_a.id])
}

const verifySquare = <T>(squareEdgeRef: Edge<T>) => {
    const e_a = squareEdgeRef
    const e_b = e_a.lnext
    const e_c = e_b.lnext
    const e_d = e_c.lnext

    // onext relationships
    expect(e_a.onext.id).toEqual(e_d.sym.id)
    expect(e_b.onext.id).toEqual(e_a.sym.id)
    expect(e_c.onext.id).toEqual(e_b.sym.id)
    expect(e_d.onext.id).toEqual(e_c.sym.id)

    // oprev relationships
    expect(e_a.oprev.id).toEqual(e_d.sym.id)
    expect(e_b.oprev.id).toEqual(e_a.sym.id)
    expect(e_c.oprev.id).toEqual(e_b.sym.id)
    expect(e_d.oprev.id).toEqual(e_c.sym.id)

    // dnext relationships
    expect(e_a.dnext.id).toEqual(e_b.sym.id)
    expect(e_b.dnext.id).toEqual(e_c.sym.id)
    expect(e_c.dnext.id).toEqual(e_d.sym.id)
    expect(e_d.dnext.id).toEqual(e_a.sym.id)

    // dprev relationships
    expect(e_a.dprev.id).toEqual(e_b.sym.id)
    expect(e_b.dprev.id).toEqual(e_c.sym.id)
    expect(e_c.dprev.id).toEqual(e_d.sym.id)
    expect(e_d.dprev.id).toEqual(e_a.sym.id)

    // lnext relationships"
    expect(e_a.lnext.id).toEqual(e_b.id)
    expect(e_b.lnext.id).toEqual(e_c.id)
    expect(e_c.lnext.id).toEqual(e_d.id)
    expect(e_d.lnext.id).toEqual(e_a.id)

    // lprev relationships
    expect(e_a.lprev.id).toEqual(e_d.id)
    expect(e_b.lprev.id).toEqual(e_a.id)
    expect(e_c.lprev.id).toEqual(e_b.id)
    expect(e_d.lprev.id).toEqual(e_c.id)

    // rnext relationships
    expect(e_a.rnext.id).toEqual(e_d.id)
    expect(e_b.rnext.id).toEqual(e_a.id)
    expect(e_c.rnext.id).toEqual(e_b.id)
    expect(e_d.rnext.id).toEqual(e_c.id)

    // rprev relationships
    expect(e_a.rprev.id).toEqual(e_b.id)
    expect(e_b.rprev.id).toEqual(e_c.id)
    expect(e_c.rprev.id).toEqual(e_d.id)
    expect(e_d.rprev.id).toEqual(e_a.id)

    // oorbit relationships
    expect(e_a.oorbit.map((e) => e.id)).toEqual([e_a.id, e_d.sym.id])
    expect(e_b.oorbit.map((e) => e.id)).toEqual([e_b.id, e_a.sym.id])
    expect(e_c.oorbit.map((e) => e.id)).toEqual([e_c.id, e_b.sym.id])
    expect(e_d.oorbit.map((e) => e.id)).toEqual([e_d.id, e_c.sym.id])

    // dorbit relationships
    expect(e_a.dorbit.map((e) => e.id)).toEqual([e_a.id, e_b.sym.id])
    expect(e_b.dorbit.map((e) => e.id)).toEqual([e_b.id, e_c.sym.id])
    expect(e_c.dorbit.map((e) => e.id)).toEqual([e_c.id, e_d.sym.id])
    expect(e_d.dorbit.map((e) => e.id)).toEqual([e_d.id, e_a.sym.id])

    // lorbit relationships
    expect(e_a.lorbit.map((e) => e.id)).toEqual([e_a.id, e_b.id, e_c.id, e_d.id])
    expect(e_b.lorbit.map((e) => e.id)).toEqual([e_b.id, e_c.id, e_d.id, e_a.id])
    expect(e_c.lorbit.map((e) => e.id)).toEqual([e_c.id, e_d.id, e_a.id, e_b.id])
    expect(e_d.lorbit.map((e) => e.id)).toEqual([e_d.id, e_a.id, e_b.id, e_c.id])

    // rorbit relationships
    expect(e_a.rorbit.map((e) => e.id)).toEqual([e_a.id, e_d.id, e_c.id, e_b.id])
    expect(e_b.rorbit.map((e) => e.id)).toEqual([e_b.id, e_a.id, e_d.id, e_c.id])
    expect(e_c.rorbit.map((e) => e.id)).toEqual([e_c.id, e_b.id, e_a.id, e_d.id])
    expect(e_d.rorbit.map((e) => e.id)).toEqual([e_d.id, e_c.id, e_b.id, e_a.id])
}

describe("makeEdge", () => {
    it("makes an isolated edge", () => {
        verifyIsolatedEdge(makeEdge(0, 1))
    })
})

describe("splice", () => {
    it("makes a line", () => {
        const a = makeEdge(0, 1)
        const b = makeEdge(2, 3)
        splice(a, b)
        verifyLine(a.sym, b)
    })
})

describe("addEdge", () => {
    it("makes a line", () => {
        const e_0 = makeEdge(0, 1)
        const e_1 = addEdge(e_0, 2)
        verifyLine(e_0, e_1)
    })
})

describe("connect", () => {
    it("makes a triangle", () => {
        const a = makeEdge(0, 1)
        const b = addEdge(a, 2)
        const c = connect(b, a)

        verifyTriangle(a)
    })
})

describe("polygon", () => {
    it("makes a 2-edge loop", () => {
        const loopEdgeRef = polygon(2)

        verifyLoop(loopEdgeRef)
    })

    it("makes a triangle", () => {
        const triangleEdgeRef = polygon(3)

        verifyTriangle(triangleEdgeRef)
    })

    it("makes a square", () => {
        const squareEdgeRef = polygon(4)

        verifySquare(squareEdgeRef)
    })
})

describe("deleteEdge", () => {
    it("makes two isolated edges from a loop", () => {
        const loopEdgeRef = polygon(2)
        const otherEdgeRef = loopEdgeRef.lnext
        deleteEdge(otherEdgeRef)

        verifyIsolatedEdge(loopEdgeRef)
        verifyIsolatedEdge(otherEdgeRef)
    })

    it("makes an isolated edge and line from a triangle", () => {
        const a = polygon(3)
        const b = a.lnext
        const c = b.lnext
        deleteEdge(c)

        verifyIsolatedEdge(c)
        verifyLine(a, b)
    })
})

// describe("swap", () => {
//     it("rotates an edge within its quadrilateral", () => {
//         const a = polygon(4)
//         const b = a.lnext
//         const c = b.lnext
//         const d = c.lnext
//         const e = connect(a, c.sym)

//         console.log({ a: edgeToString(a) })
//         console.log({ b: edgeToString(b) })
//         console.log({ c: edgeToString(c) })
//         console.log({ d: edgeToString(d) })
//         console.log({ e: edgeToString(e) })

//         // swap(e)
//     })
// })
