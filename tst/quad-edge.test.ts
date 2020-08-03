import {
    Edge,
    QuadEdge,
    addEdge,
    connect,
    deleteEdge,
    doubleCcwTriArea,
    edgeToString,
    inCircle,
    makeEdge,
    polygon,
    setIdSeed,
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

const verifyLine = <T>(a: Edge<T>, b: Edge<T>) => {
    // e_0 has no onext, e_1 has e_0's sym as onext
    expect(a.onext.id).toEqual(a.id)
    expect(b.onext.id).toEqual(a.sym.id)

    // e_0 has no oprev, e_1 has e_0's sym as oprev
    expect(a.oprev.id).toEqual(a.id)
    expect(b.oprev.id).toEqual(a.sym.id)

    // e_0 has e_1's sym as dnext, e_1 has no dnext
    expect(a.dnext.id).toEqual(b.sym.id)
    expect(b.dnext.id).toEqual(b.id)

    // e_0 has e_1's sym as dprev, e_1 has no dprev
    expect(a.dprev.id).toEqual(b.sym.id)
    expect(b.dprev.id).toEqual(b.id)

    // e_0 has e_1 as lnext, e_1 has e_1's sym as lnrxt
    expect(a.lnext.id).toEqual(b.id)
    expect(b.lnext.id).toEqual(b.sym.id)

    // e_0 has e_1's sym as lprev, e_1 has e_0 as lprev
    expect(a.lprev.id).toEqual(a.sym.id)
    expect(b.lprev.id).toEqual(a.id)

    // e_0 has e_0's sym as rnext, e_1 has e_0 as rnext
    expect(a.rnext.id).toEqual(a.sym.id)
    expect(b.rnext.id).toEqual(a.id)

    // e_0 has e_1 as rprev, e_1 has e_1's sym as rprev
    expect(a.rprev.id).toEqual(b.id)
    expect(b.rprev.id).toEqual(b.sym.id)
}

const verifyCorner = <T>(a: Edge<T>, b: Edge<T>, c: Edge<T>) => {
    // verify onexts
    expect(a.onext.id).toEqual(b.id)
    expect(b.onext.id).toEqual(c.id)
    expect(c.onext.id).toEqual(a.id)

    // verify oprevs
    expect(a.oprev.id).toEqual(c.id)
    expect(b.oprev.id).toEqual(a.id)
    expect(c.oprev.id).toEqual(b.id)

    // verify dnexts
    expect(a.dnext.id).toEqual(a.id)
    expect(b.dnext.id).toEqual(b.id)
    expect(c.dnext.id).toEqual(c.id)

    // verify dprev
    expect(a.dprev.id).toEqual(a.id)
    expect(b.dprev.id).toEqual(b.id)
    expect(c.dprev.id).toEqual(c.id)

    // verify lnext
    expect(a.lnext.id).toEqual(a.sym.id)
    expect(b.lnext.id).toEqual(b.sym.id)
    expect(c.lnext.id).toEqual(c.sym.id)

    // verify lprev
    expect(a.lprev.id).toEqual(b.sym.id)
    expect(b.lprev.id).toEqual(c.sym.id)
    expect(c.lprev.id).toEqual(a.sym.id)

    // verify rnext
    expect(a.rnext.id).toEqual(c.sym.id)
    expect(b.rnext.id).toEqual(a.sym.id)
    expect(c.rnext.id).toEqual(b.sym.id)

    // verify rprev
    expect(a.rprev.id).toEqual(a.sym.id)
    expect(b.rprev.id).toEqual(b.sym.id)
    expect(c.rprev.id).toEqual(c.sym.id)
}

const verifyLoop = <T>(a: Edge<T>, b: Edge<T>) => {
    // onext relationships
    expect(a.onext.id).toEqual(b.sym.id)
    expect(b.onext.id).toEqual(a.sym.id)

    // oprev relationships
    expect(a.oprev.id).toEqual(b.sym.id)
    expect(b.oprev.id).toEqual(a.sym.id)

    // dnext relationships
    expect(a.dnext.id).toEqual(b.sym.id)
    expect(b.dnext.id).toEqual(a.sym.id)

    // dprev relationships
    expect(a.dprev.id).toEqual(b.sym.id)
    expect(b.dprev.id).toEqual(a.sym.id)

    // lnext relationships
    expect(a.lnext.id).toEqual(b.id)
    expect(b.lnext.id).toEqual(a.id)

    // lprev relationships
    expect(a.lprev.id).toEqual(b.id)
    expect(b.lprev.id).toEqual(a.id)

    // rnext relationships
    expect(a.rnext.id).toEqual(b.id)
    expect(b.rnext.id).toEqual(a.id)

    // rprev relationships
    expect(a.rprev.id).toEqual(b.id)
    expect(b.rprev.id).toEqual(a.id)

    // oorbit relationships
    expect(a.oorbit.map((e) => e.id)).toEqual([a.id, b.sym.id])
    expect(b.oorbit.map((e) => e.id)).toEqual([b.id, a.sym.id])

    // dorbit relationships
    expect(a.dorbit.map((e) => e.id)).toEqual([a.id, b.sym.id])
    expect(b.dorbit.map((e) => e.id)).toEqual([b.id, a.sym.id])

    // lorbit relationships
    expect(a.lorbit.map((e) => e.id)).toEqual([a.id, b.id])
    expect(b.lorbit.map((e) => e.id)).toEqual([b.id, a.id])

    // rorbit relationships
    expect(a.rorbit.map((e) => e.id)).toEqual([a.id, b.id])
    expect(b.rorbit.map((e) => e.id)).toEqual([b.id, a.id])
}

const verifyTriangle = <T>(a: Edge<T>, b: Edge<T>, c: Edge<T>) => {
    // onext relationships
    expect(a.onext.id).toEqual(c.sym.id)
    expect(b.onext.id).toEqual(a.sym.id)
    expect(c.onext.id).toEqual(b.sym.id)

    // oprev relationships
    expect(a.oprev.id).toEqual(c.sym.id)
    expect(b.oprev.id).toEqual(a.sym.id)
    expect(c.oprev.id).toEqual(b.sym.id)

    // dnext relationships
    expect(a.dnext.id).toEqual(b.sym.id)
    expect(b.dnext.id).toEqual(c.sym.id)
    expect(c.dnext.id).toEqual(a.sym.id)

    // dprev relationships
    expect(a.dprev.id).toEqual(b.sym.id)
    expect(b.dprev.id).toEqual(c.sym.id)
    expect(c.dprev.id).toEqual(a.sym.id)

    // lnext relationships
    expect(a.lnext.id).toEqual(b.id)
    expect(b.lnext.id).toEqual(c.id)
    expect(c.lnext.id).toEqual(a.id)

    // lprev relationships
    expect(a.lprev.id).toEqual(c.id)
    expect(b.lprev.id).toEqual(a.id)
    expect(c.lprev.id).toEqual(b.id)

    // rnext relationships
    expect(a.rnext.id).toEqual(c.id)
    expect(b.rnext.id).toEqual(a.id)
    expect(c.rnext.id).toEqual(b.id)

    // rprev relationships
    expect(a.rprev.id).toEqual(b.id)
    expect(b.rprev.id).toEqual(c.id)
    expect(c.rprev.id).toEqual(a.id)

    // oorbit relationships
    expect(a.oorbit.map((e) => e.id)).toEqual([a.id, c.sym.id])
    expect(b.oorbit.map((e) => e.id)).toEqual([b.id, a.sym.id])
    expect(c.oorbit.map((e) => e.id)).toEqual([c.id, b.sym.id])

    // dorbit relationships
    expect(a.dorbit.map((e) => e.id)).toEqual([a.id, b.sym.id])
    expect(b.dorbit.map((e) => e.id)).toEqual([b.id, c.sym.id])
    expect(c.dorbit.map((e) => e.id)).toEqual([c.id, a.sym.id])

    // lorbit relationships
    expect(a.lorbit.map((e) => e.id)).toEqual([a.id, b.id, c.id])
    expect(b.lorbit.map((e) => e.id)).toEqual([b.id, c.id, a.id])
    expect(c.lorbit.map((e) => e.id)).toEqual([c.id, a.id, b.id])

    // rorbit relationships
    expect(a.rorbit.map((e) => e.id)).toEqual([a.id, c.id, b.id])
    expect(b.rorbit.map((e) => e.id)).toEqual([b.id, a.id, c.id])
    expect(c.rorbit.map((e) => e.id)).toEqual([c.id, b.id, a.id])
}

const verifySquare = <T>(a: Edge<T>, b: Edge<T>, c: Edge<T>, d: Edge<T>) => {
    // onext relationships
    expect(a.onext.id).toEqual(d.sym.id)
    expect(b.onext.id).toEqual(a.sym.id)
    expect(c.onext.id).toEqual(b.sym.id)
    expect(d.onext.id).toEqual(c.sym.id)

    // oprev relationships
    expect(a.oprev.id).toEqual(d.sym.id)
    expect(b.oprev.id).toEqual(a.sym.id)
    expect(c.oprev.id).toEqual(b.sym.id)
    expect(d.oprev.id).toEqual(c.sym.id)

    // dnext relationships
    expect(a.dnext.id).toEqual(b.sym.id)
    expect(b.dnext.id).toEqual(c.sym.id)
    expect(c.dnext.id).toEqual(d.sym.id)
    expect(d.dnext.id).toEqual(a.sym.id)

    // dprev relationships
    expect(a.dprev.id).toEqual(b.sym.id)
    expect(b.dprev.id).toEqual(c.sym.id)
    expect(c.dprev.id).toEqual(d.sym.id)
    expect(d.dprev.id).toEqual(a.sym.id)

    // lnext relationships"
    expect(a.lnext.id).toEqual(b.id)
    expect(b.lnext.id).toEqual(c.id)
    expect(c.lnext.id).toEqual(d.id)
    expect(d.lnext.id).toEqual(a.id)

    // lprev relationships
    expect(a.lprev.id).toEqual(d.id)
    expect(b.lprev.id).toEqual(a.id)
    expect(c.lprev.id).toEqual(b.id)
    expect(d.lprev.id).toEqual(c.id)

    // rnext relationships
    expect(a.rnext.id).toEqual(d.id)
    expect(b.rnext.id).toEqual(a.id)
    expect(c.rnext.id).toEqual(b.id)
    expect(d.rnext.id).toEqual(c.id)

    // rprev relationships
    expect(a.rprev.id).toEqual(b.id)
    expect(b.rprev.id).toEqual(c.id)
    expect(c.rprev.id).toEqual(d.id)
    expect(d.rprev.id).toEqual(a.id)

    // oorbit relationships
    expect(a.oorbit.map((e) => e.id)).toEqual([a.id, d.sym.id])
    expect(b.oorbit.map((e) => e.id)).toEqual([b.id, a.sym.id])
    expect(c.oorbit.map((e) => e.id)).toEqual([c.id, b.sym.id])
    expect(d.oorbit.map((e) => e.id)).toEqual([d.id, c.sym.id])

    // dorbit relationships
    expect(a.dorbit.map((e) => e.id)).toEqual([a.id, b.sym.id])
    expect(b.dorbit.map((e) => e.id)).toEqual([b.id, c.sym.id])
    expect(c.dorbit.map((e) => e.id)).toEqual([c.id, d.sym.id])
    expect(d.dorbit.map((e) => e.id)).toEqual([d.id, a.sym.id])

    // lorbit relationships
    expect(a.lorbit.map((e) => e.id)).toEqual([a.id, b.id, c.id, d.id])
    expect(b.lorbit.map((e) => e.id)).toEqual([b.id, c.id, d.id, a.id])
    expect(c.lorbit.map((e) => e.id)).toEqual([c.id, d.id, a.id, b.id])
    expect(d.lorbit.map((e) => e.id)).toEqual([d.id, a.id, b.id, c.id])

    // rorbit relationships
    expect(a.rorbit.map((e) => e.id)).toEqual([a.id, d.id, c.id, b.id])
    expect(b.rorbit.map((e) => e.id)).toEqual([b.id, a.id, d.id, c.id])
    expect(c.rorbit.map((e) => e.id)).toEqual([c.id, b.id, a.id, d.id])
    expect(d.rorbit.map((e) => e.id)).toEqual([d.id, c.id, b.id, a.id])
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

    it("makes a corner", () => {
        const a = makeEdge(0, 1)
        const b = makeEdge(2, 3)
        const c = makeEdge(4, 5)
        splice(a, b)
        splice(b, c)

        verifyCorner(a, b, c)
    })
})

describe("addEdge", () => {
    it("makes a line", () => {
        const a = makeEdge(0, 1)
        const b = addEdge(a, 2)
        verifyLine(a, b)
    })
})

describe("connect", () => {
    it("makes a triangle", () => {
        const a = makeEdge(0, 1)
        const b = addEdge(a, 2)
        const c = connect(b, a)

        verifyTriangle(a, b, c)
    })
})

describe("polygon", () => {
    it("makes a 2-edge loop", () => {
        const a = polygon(2)
        const b = a.lnext

        verifyLoop(a, b)
    })

    it("makes a triangle", () => {
        const a = polygon(3)
        const b = a.lnext
        const c = b.lnext

        verifyTriangle(a, b, c)
    })

    it("makes a square", () => {
        const a = polygon(4)
        const b = a.lnext
        const c = b.lnext
        const d = c.lnext

        verifySquare(a, b, c, d)
    })
})

describe("deleteEdge", () => {
    it("makes two isolated edges from a loop", () => {
        const a = polygon(2)
        const b = a.lnext
        deleteEdge(b)

        verifyIsolatedEdge(a)
        verifyIsolatedEdge(b)
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

describe("swap", () => {
    it("rotates an edge within its quadrilateral", () => {
        setIdSeed(1)
        const a = polygon(4)
        const b = a.lnext
        const c = b.lnext
        const d = c.lnext
        const e = connect(a, d)

        // verify the quadrilateral
        expect(e.oorbit.map((e) => e.id)).toEqual([e.id, a.sym.id, b.id])
        expect(e.dorbit.map((e) => e.id)).toEqual([e.id, c.id, d.sym.id])
        expect(e.lorbit.map((e) => e.id)).toEqual([e.id, d.id, a.id])
        expect(e.rorbit.map((e) => e.id)).toEqual([e.id, b.sym.id, c.sym.id])

        swap(e)

        // verify the swap
        expect(e.oorbit.map((e) => e.id)).toEqual([e.id, b.sym.id, c.id])
        expect(e.dorbit.map((e) => e.id)).toEqual([e.id, d.id, a.sym.id])
        expect(e.lorbit.map((e) => e.id)).toEqual([e.id, a.id, b.id])
        expect(e.rorbit.map((e) => e.id)).toEqual([e.id, c.sym.id, d.sym.id])
    })
})

describe("doubleArea", () => {
    it("calculates double the area defined by 3 points", () => {
        const area = doubleCcwTriArea(makePoint2D(0, 0), makePoint2D(2, 0), makePoint2D(0, 1))

        expect(area).toEqual(2)
    })
})

describe("inCircle", () => {
    it("determines points in the circle", () => {
        const inIt = inCircle(makePoint2D(0, 0), makePoint2D(1, 0), makePoint2D(0, 1), makePoint2D(-0.1, -0.1))

        expect(inIt).toBeFalsy()
    })

    it("determines points in the circle", () => {
        const inIt = inCircle(makePoint2D(0, 0), makePoint2D(1, 0), makePoint2D(0, 1), makePoint2D(1.1, -0.1))

        expect(inIt).toBeFalsy()
    })

    it("determines points in the circle", () => {
        const inIt = inCircle(makePoint2D(0, 0), makePoint2D(1, 0), makePoint2D(0, 1), makePoint2D(1.1, 1.1))

        expect(inIt).toBeFalsy()
    })

    it("determines points in the circle", () => {
        const inIt = inCircle(makePoint2D(0, 0), makePoint2D(1, 0), makePoint2D(0, 1), makePoint2D(-0.1, 1.1))

        expect(inIt).toBeFalsy()
    })

    it("determines points in the circle", () => {
        const inIt = inCircle(makePoint2D(0, 0), makePoint2D(1, 0), makePoint2D(0, 1), makePoint2D(0.5, 0.5))

        expect(inIt).toBeTruthy()
    })
})
