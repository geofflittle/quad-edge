import { Edge, QuadEdge, connect, makeEdge, polygon, splice, subdivision } from "../src/quad-edge"

import { makePoint2D } from "../src/point-2d"

describe("edge from makeEdge", () => {
    const org = 0
    const dest = 1
    const e = makeEdge(org, dest)
    const quad = [e, e.rot, e.rot.rot, e.rot.rot.rot]
    it("should have provided org data", () => {
        expect(e.org).toEqual(org)
    })
    it("should have provided dest data", () => {
        expect(e.dest).toEqual(dest)
    })
    it("should have e_1 be e_0's rot", () => {
        expect(e.rot).toEqual(quad[1])
    })
    it("should have e_2 be e_0's sym", () => {
        expect(e.sym).toEqual(quad[2])
    })
    it("should have e_3 be e_0's invrot", () => {
        expect(e.invrot).toEqual(quad[3])
    })
    it("should have itself as onext", () => {
        expect(e.onext).toEqual(quad[0])
    })
    it("should have itself as oprev", () => {
        expect(e.oprev).toEqual(quad[0])
    })
    it("should have itself as dnext", () => {
        expect(e.dnext).toEqual(quad[0])
    })
    it("should have itself dprev", () => {
        expect(e.dprev).toEqual(quad[0])
    })
    it("should have sym as lnext", () => {
        expect(e.lnext).toEqual(quad[2])
    })
    it("should have sym as lprev", () => {
        expect(e.lprev).toEqual(quad[2])
    })
    it("should have sym as rnext", () => {
        expect(e.rnext).toEqual(quad[2])
    })
    it("should have sym as rprev", () => {
        expect(e.rprev).toEqual(quad[2])
    })
    it("should have itself as oorbit", () => {
        expect(e.oorbit.map((e) => e.id)).toEqual([quad[0].id])
    })
})

describe("triangle", () => {
    const p_a = 0
    const p_b = 1
    const p_c = 2
    const e_a = polygon([p_a, p_b, p_c])
    const e_b = e_a.lnext
    const e_c = e_b.lnext

    it("should have the correct onext relationships", () => {
        expect(e_a.onext.id).toEqual(e_c.sym.id)
        expect(e_b.onext.id).toEqual(e_a.sym.id)
        expect(e_c.onext.id).toEqual(e_b.sym.id)
    })

    it("should have the correct oprev relationships", () => {
        expect(e_a.oprev.id).toEqual(e_c.sym.id)
        expect(e_b.oprev.id).toEqual(e_a.sym.id)
        expect(e_c.oprev.id).toEqual(e_b.sym.id)
    })

    it("should have the correct dnext relationships", () => {
        expect(e_a.dnext.id).toEqual(e_b.sym.id)
        expect(e_b.dnext.id).toEqual(e_c.sym.id)
        expect(e_c.dnext.id).toEqual(e_a.sym.id)
    })

    it("should have the correct dprev relationships", () => {
        expect(e_a.dprev.id).toEqual(e_b.sym.id)
        expect(e_b.dprev.id).toEqual(e_c.sym.id)
        expect(e_c.dprev.id).toEqual(e_a.sym.id)
    })

    it("should have the correct lnext relationships", () => {
        expect(e_a.lnext.id).toEqual(e_b.id)
        expect(e_b.lnext.id).toEqual(e_c.id)
        expect(e_c.lnext.id).toEqual(e_a.id)
    })

    it("should have the correct lprev relationships", () => {
        expect(e_a.lprev.id).toEqual(e_c.id)
        expect(e_b.lprev.id).toEqual(e_a.id)
        expect(e_c.lprev.id).toEqual(e_b.id)
    })

    it("should have the correct rnext relationships", () => {
        expect(e_a.rnext.id).toEqual(e_c.id)
        expect(e_b.rnext.id).toEqual(e_a.id)
        expect(e_c.rnext.id).toEqual(e_b.id)
    })

    it("should have the correct rprev relationships", () => {
        expect(e_a.rprev.id).toEqual(e_b.id)
        expect(e_b.rprev.id).toEqual(e_c.id)
        expect(e_c.rprev.id).toEqual(e_a.id)
    })

    it("should have the correct oorbit relationships", () => {
        expect(e_a.oorbit.map((e) => e.id)).toEqual([e_a.id, e_c.sym.id])
        expect(e_b.oorbit.map((e) => e.id)).toEqual([e_b.id, e_a.sym.id])
        expect(e_c.oorbit.map((e) => e.id)).toEqual([e_c.id, e_b.sym.id])
    })

    it("should have the correct dorbit relationships", () => {
        expect(e_a.dorbit.map((e) => e.id)).toEqual([e_a.id, e_b.sym.id])
        expect(e_b.dorbit.map((e) => e.id)).toEqual([e_b.id, e_c.sym.id])
        expect(e_c.dorbit.map((e) => e.id)).toEqual([e_c.id, e_a.sym.id])
    })

    it("should have the correct lorbit relationships", () => {
        expect(e_a.lorbit.map((e) => e.id)).toEqual([e_a.id, e_b.id, e_c.id])
        expect(e_b.lorbit.map((e) => e.id)).toEqual([e_b.id, e_c.id, e_a.id])
        expect(e_c.lorbit.map((e) => e.id)).toEqual([e_c.id, e_a.id, e_b.id])
    })

    it("should have the correct rorbit relationships", () => {
        expect(e_a.rorbit.map((e) => e.id)).toEqual([e_a.id, e_c.id, e_b.id])
        expect(e_b.rorbit.map((e) => e.id)).toEqual([e_b.id, e_a.id, e_c.id])
        expect(e_c.rorbit.map((e) => e.id)).toEqual([e_c.id, e_b.id, e_a.id])
    })
})

describe("square", () => {
    const p_a = 0
    const p_b = 1
    const p_c = 2
    const p_d = 3
    const e_a = polygon([p_a, p_b, p_c, p_d])
    const e_b = e_a.lnext
    const e_c = e_b.lnext
    const e_d = e_c.lnext

    it("should have the correct onext relationships", () => {
        expect(e_a.onext.id).toEqual(e_d.sym.id)
        expect(e_b.onext.id).toEqual(e_a.sym.id)
        expect(e_c.onext.id).toEqual(e_b.sym.id)
        expect(e_d.onext.id).toEqual(e_c.sym.id)
    })

    it("should have the correct oprev relationships", () => {
        expect(e_a.oprev.id).toEqual(e_d.sym.id)
        expect(e_b.oprev.id).toEqual(e_a.sym.id)
        expect(e_c.oprev.id).toEqual(e_b.sym.id)
        expect(e_d.oprev.id).toEqual(e_c.sym.id)
    })

    it("should have the correct dnext relationships", () => {
        expect(e_a.dnext.id).toEqual(e_b.sym.id)
        expect(e_b.dnext.id).toEqual(e_c.sym.id)
        expect(e_c.dnext.id).toEqual(e_d.sym.id)
        expect(e_d.dnext.id).toEqual(e_a.sym.id)
    })

    it("should have the correct dprev relationships", () => {
        expect(e_a.dprev.id).toEqual(e_b.sym.id)
        expect(e_b.dprev.id).toEqual(e_c.sym.id)
        expect(e_c.dprev.id).toEqual(e_d.sym.id)
        expect(e_d.dprev.id).toEqual(e_a.sym.id)
    })

    it("should have the correct lnext relationships", () => {
        expect(e_a.lnext.id).toEqual(e_b.id)
        expect(e_b.lnext.id).toEqual(e_c.id)
        expect(e_c.lnext.id).toEqual(e_d.id)
        expect(e_d.lnext.id).toEqual(e_a.id)
    })

    it("should have the correct lprev relationships", () => {
        expect(e_a.lprev.id).toEqual(e_d.id)
        expect(e_b.lprev.id).toEqual(e_a.id)
        expect(e_c.lprev.id).toEqual(e_b.id)
        expect(e_d.lprev.id).toEqual(e_c.id)
    })

    it("should have the correct rnext relationships", () => {
        expect(e_a.rnext.id).toEqual(e_d.id)
        expect(e_b.rnext.id).toEqual(e_a.id)
        expect(e_c.rnext.id).toEqual(e_b.id)
        expect(e_d.rnext.id).toEqual(e_c.id)
    })

    it("should have the correct rprev relationships", () => {
        expect(e_a.rprev.id).toEqual(e_b.id)
        expect(e_b.rprev.id).toEqual(e_c.id)
        expect(e_c.rprev.id).toEqual(e_d.id)
        expect(e_d.rprev.id).toEqual(e_a.id)
    })

    it("should have the correct oorbit relationships", () => {
        expect(e_a.oorbit.map((e) => e.id)).toEqual([e_a.id, e_d.sym.id])
        expect(e_b.oorbit.map((e) => e.id)).toEqual([e_b.id, e_a.sym.id])
        expect(e_c.oorbit.map((e) => e.id)).toEqual([e_c.id, e_b.sym.id])
        expect(e_d.oorbit.map((e) => e.id)).toEqual([e_d.id, e_c.sym.id])
    })

    it("should have the correct dorbit relationships", () => {
        expect(e_a.dorbit.map((e) => e.id)).toEqual([e_a.id, e_b.sym.id])
        expect(e_b.dorbit.map((e) => e.id)).toEqual([e_b.id, e_c.sym.id])
        expect(e_c.dorbit.map((e) => e.id)).toEqual([e_c.id, e_d.sym.id])
        expect(e_d.dorbit.map((e) => e.id)).toEqual([e_d.id, e_a.sym.id])
    })

    it("should have the correct lorbit relationships", () => {
        expect(e_a.lorbit.map((e) => e.id)).toEqual([e_a.id, e_b.id, e_c.id, e_d.id])
        expect(e_b.lorbit.map((e) => e.id)).toEqual([e_b.id, e_c.id, e_d.id, e_a.id])
        expect(e_c.lorbit.map((e) => e.id)).toEqual([e_c.id, e_d.id, e_a.id, e_b.id])
        expect(e_d.lorbit.map((e) => e.id)).toEqual([e_d.id, e_a.id, e_b.id, e_c.id])
    })

    it("should have the correct rorbit relationships", () => {
        expect(e_a.rorbit.map((e) => e.id)).toEqual([e_a.id, e_d.id, e_c.id, e_b.id])
        expect(e_b.rorbit.map((e) => e.id)).toEqual([e_b.id, e_a.id, e_d.id, e_c.id])
        expect(e_c.rorbit.map((e) => e.id)).toEqual([e_c.id, e_b.id, e_a.id, e_d.id])
        expect(e_d.rorbit.map((e) => e.id)).toEqual([e_d.id, e_c.id, e_b.id, e_a.id])
    })
})
