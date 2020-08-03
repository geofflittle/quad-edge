import {
    verifyIsolated,
    verifyLine,
    verifyLoop,
    verifyPyramidTop,
    verifySpliced,
    verifySquare,
    verifyTriangle
} from "./quad-edge-test-verifies"

import { Edge } from "../src/edge"
import { makeEdgeBag } from "../src/quad-edge-2"

describe("createEdge", () => {
    it("creates an isolated edge", () => {
        const bag = makeEdgeBag()

        const e = bag.createEdge()

        verifyIsolated(e)
    })
})

describe("splice", () => {
    it("merges two origin orbits", () => {
        const bag = makeEdgeBag()
        const a = bag.createEdge()
        const b = bag.createEdge()

        bag.splice(a, b)

        verifySpliced(a, b)
    })

    it("isolates two merged origin orbits", () => {
        const bag = makeEdgeBag()
        const a = bag.createEdge()
        const b = bag.createEdge()
        bag.splice(a, b)
        bag.splice(a, b)

        verifyIsolated(a)
        verifyIsolated(b)
    })

    it("can make a pyramid top", () => {
        const bag = makeEdgeBag()
        const a = bag.createEdge()
        const b = bag.createEdge()
        const c = bag.createEdge()
        bag.splice(a, b)
        bag.splice(b, c)

        verifyPyramidTop(a, b, c)
    })
})

describe("deleteEdge", () => {
    it("deletes an edge", () => {
        const bag = makeEdgeBag()
        const e = bag.createEdge()

        bag.deleteEdge(e)

        expect(bag.edges).toEqual([])
    })

    it("splices an edge from an origin orbit and deletes it", () => {
        const bag = makeEdgeBag()
        const a = bag.createEdge()
        const b = bag.createEdge()
        bag.splice(a, b)

        bag.deleteEdge(b)

        verifyIsolated(a)
    })
})

describe("edges", () => {
    it("is empty when there are no edges", () => {
        const bag = makeEdgeBag()

        expect(bag.edges).toEqual([])
    })

    it("has an edge when one is present", () => {
        const bag = makeEdgeBag()
        const a = bag.createEdge()

        expect(bag.edges.map((edge) => edge.id)).toEqual([a.id, a.rot.id, a.sym.id, a.invrot.id])
    })

    it("has no edges when the only one is removed", () => {
        const bag = makeEdgeBag()
        const a = bag.createEdge()
        bag.deleteEdge(a)

        expect(bag.edges).toEqual([])
    })

    it("has an edge when an edge is removed from a splice", () => {
        const bag = makeEdgeBag()
        const a = bag.createEdge()
        const b = bag.createEdge()
        bag.splice(a, b)

        bag.deleteEdge(b)

        expect(bag.edges.map((edge) => edge.id)).toEqual([a.id, a.rot.id, a.sym.id, a.invrot.id])
    })
})

describe("concat", () => {
    it("concats two edges", () => {
        const bag = makeEdgeBag()
        const a = bag.createEdge()
        const b = bag.createEdge()
        bag.concat(a, b)

        verifyLine(a, b)
    })
})

describe("addEdge", () => {
    it("adds an edge to the given edge", () => {
        const bag = makeEdgeBag()
        const a = bag.createEdge()

        const b = bag.addEdge(a)

        verifyLine(a, b)
    })
})

describe("connect", () => {
    it("connects two edges", () => {
        const bag = makeEdgeBag()
        const a = bag.createEdge()
        const b = bag.addEdge(a)

        const c = bag.connect(b, a)

        verifyTriangle(a, b, c)
    })
})

describe("addPolygon", () => {
    it("can make a loop", () => {
        const bag = makeEdgeBag()
        const e = bag.addPolygon(2)

        verifyLoop(e, e.lnext)
    })

    it("can make a triangle", () => {
        const bag = makeEdgeBag()
        const e = bag.addPolygon(3)

        verifyTriangle(e, e.lnext, e.lnext.lnext)
    })

    it("can make a square", () => {
        const bag = makeEdgeBag()
        const e = bag.addPolygon(4)

        verifySquare(e, e.lnext, e.lnext.lnext, e.lnext.lnext.lnext)
    })
})

describe("swap", () => {
    it("rotates an edge within its quadrilateral", () => {
        const bag = makeEdgeBag()
        const a = bag.addPolygon(4)
        const b = a.lnext
        const c = b.lnext
        const d = c.lnext
        const e = bag.connect(a, d)

        // verify the quadrilateral
        expect(Array.from(e.oorbit).map((e) => e.id)).toEqual([e.id, a.sym.id, b.id])
        expect(Array.from(e.dorbit).map((e) => e.id)).toEqual([e.id, c.id, d.sym.id])
        expect(Array.from(e.lorbit).map((e) => e.id)).toEqual([e.id, d.id, a.id])
        expect(Array.from(e.rorbit).map((e) => e.id)).toEqual([e.id, b.sym.id, c.sym.id])

        bag.swap(e)

        // verify the swap
        expect(Array.from(e.oorbit).map((e) => e.id)).toEqual([e.id, b.sym.id, c.id])
        expect(Array.from(e.dorbit).map((e) => e.id)).toEqual([e.id, d.id, a.sym.id])
        expect(Array.from(e.lorbit).map((e) => e.id)).toEqual([e.id, a.id, b.id])
        expect(Array.from(e.rorbit).map((e) => e.id)).toEqual([e.id, c.sym.id, d.sym.id])
    })
})

describe("set odata", () => {
    it("sets the odatas for spliced edges", () => {
        const bag = makeEdgeBag()
        const a = bag.createEdge()
        const b = bag.createEdge()
        const c = bag.createEdge()
        a.odata = 0
        b.odata = 1
        c.odata = 2

        bag.splice(a, b)
        bag.splice(b, c)

        expect(a.odata).toEqual(0)
        expect(b.odata).toEqual(0)
        expect(c.odata).toEqual(0)
    })

    it("doesn't set the odata for previously spliced edges", () => {
        const bag = makeEdgeBag()
        const a = bag.createEdge()
        const b = bag.createEdge()
        const c = bag.createEdge()

        // Create a pyramid top
        bag.splice(a, b)
        bag.splice(b, c)
        // Set all the odatas
        a.odata = 0
        // Splice-out edge b
        bag.splice(a, b)
        // Set edge b's odata
        b.odata = 1

        expect(a.odata).toEqual(0)
        expect(b.odata).toEqual(1)
        expect(c.odata).toEqual(0)
    })
})
