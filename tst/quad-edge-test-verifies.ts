import { Edge } from "../src/edge"

export const verifyIsolated = <T>(e_0: Edge<T>) => {
    const e_1 = e_0.rot
    const e_2 = e_1.rot
    const e_3 = e_2.rot

    // e_0's rot is e_1
    expect(e_0.rot.id).toEqual(e_1.id)

    // e_0's sym is e_2
    expect(e_0.sym.id).toEqual(e_2.id)

    // e_0's invrot is e_3
    expect(e_0.invrot.id).toEqual(e_3.id)

    // e_0's onext is e_0
    expect(e_0.onext.id).toEqual(e_0.id)

    // e_0's oprev is e_0
    expect(e_0.oprev.id).toEqual(e_0.id)

    // e_0's dnext is e_0
    expect(e_0.dnext.id).toEqual(e_0.id)

    // e_0's dprev is e_0
    expect(e_0.dprev.id).toEqual(e_0.id)

    // e_0's lnext is e_0's sym
    expect(e_0.lnext.id).toEqual(e_0.sym.id)

    // e_0's lprev is e_0's sym
    expect(e_0.lprev.id).toEqual(e_0.sym.id)

    // e_0's rnext is e_0's sym
    expect(e_0.rnext.id).toEqual(e_0.sym.id)

    // e_0's rprev is e_0's sym
    expect(e_0.rprev.id).toEqual(e_0.sym.id)

    // TODO: Add orbits
}

export const verifySpliced = <T>(a: Edge<T>, b: Edge<T>) => {
    // They are each other's onexts
    expect(a.onext.id).toEqual(b.id)
    expect(b.onext.id).toEqual(a.id)

    // They are each other's oprevs
    expect(a.oprev.id).toEqual(b.id)
    expect(b.oprev.id).toEqual(a.id)

    // Their dnexts are themselves
    expect(a.dnext.id).toEqual(a.id)
    expect(b.dnext.id).toEqual(b.id)

    // Their dprevs are themselves
    expect(a.dprev.id).toEqual(a.id)
    expect(b.dprev.id).toEqual(b.id)

    // Their lnexts are their syms
    expect(a.lnext.id).toEqual(a.sym.id)
    expect(b.lnext.id).toEqual(b.sym.id)

    // Their lprevs are each other's syms
    expect(a.lprev.id).toEqual(b.sym.id)
    expect(b.lprev.id).toEqual(a.sym.id)

    // Their rnexts are each other's syms
    expect(a.rnext.id).toEqual(b.sym.id)
    expect(b.rnext.id).toEqual(a.sym.id)

    // Their rprevs are their syms
    expect(a.rprev.id).toEqual(a.sym.id)
    expect(b.rprev.id).toEqual(b.sym.id)
}

export const verifyPyramidTop = <T>(a: Edge<T>, b: Edge<T>, c: Edge<T>) => {
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

export const verifyLine = <T>(a: Edge<T>, b: Edge<T>) => {
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

export const verifyTriangle = <T>(a: Edge<T>, b: Edge<T>, c: Edge<T>) => {
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
    expect(Array.from(a.oorbit).map((e) => e.id)).toEqual([a.id, c.sym.id])
    expect(Array.from(b.oorbit).map((e) => e.id)).toEqual([b.id, a.sym.id])
    expect(Array.from(c.oorbit).map((e) => e.id)).toEqual([c.id, b.sym.id])

    // dorbit relationships
    expect(Array.from(a.dorbit).map((e) => e.id)).toEqual([a.id, b.sym.id])
    expect(Array.from(b.dorbit).map((e) => e.id)).toEqual([b.id, c.sym.id])
    expect(Array.from(c.dorbit).map((e) => e.id)).toEqual([c.id, a.sym.id])

    // lorbit relationships
    expect(Array.from(a.lorbit).map((e) => e.id)).toEqual([a.id, b.id, c.id])
    expect(Array.from(b.lorbit).map((e) => e.id)).toEqual([b.id, c.id, a.id])
    expect(Array.from(c.lorbit).map((e) => e.id)).toEqual([c.id, a.id, b.id])

    // rorbit relationships
    expect(Array.from(a.rorbit).map((e) => e.id)).toEqual([a.id, c.id, b.id])
    expect(Array.from(b.rorbit).map((e) => e.id)).toEqual([b.id, a.id, c.id])
    expect(Array.from(c.rorbit).map((e) => e.id)).toEqual([c.id, b.id, a.id])
}

export const verifyLoop = <T>(a: Edge<T>, b: Edge<T>) => {
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
    expect(Array.from(a.oorbit).map((e) => e.id)).toEqual([a.id, b.sym.id])
    expect(Array.from(b.oorbit).map((e) => e.id)).toEqual([b.id, a.sym.id])

    // dorbit relationships
    expect(Array.from(a.dorbit).map((e) => e.id)).toEqual([a.id, b.sym.id])
    expect(Array.from(b.dorbit).map((e) => e.id)).toEqual([b.id, a.sym.id])

    // lorbit relationships
    expect(Array.from(a.lorbit).map((e) => e.id)).toEqual([a.id, b.id])
    expect(Array.from(b.lorbit).map((e) => e.id)).toEqual([b.id, a.id])

    // rorbit relationships
    expect(Array.from(a.rorbit).map((e) => e.id)).toEqual([a.id, b.id])
    expect(Array.from(b.rorbit).map((e) => e.id)).toEqual([b.id, a.id])
}

export const verifySquare = <T>(a: Edge<T>, b: Edge<T>, c: Edge<T>, d: Edge<T>) => {
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
    expect(Array.from(a.oorbit).map((e) => e.id)).toEqual([a.id, d.sym.id])
    expect(Array.from(b.oorbit).map((e) => e.id)).toEqual([b.id, a.sym.id])
    expect(Array.from(c.oorbit).map((e) => e.id)).toEqual([c.id, b.sym.id])
    expect(Array.from(d.oorbit).map((e) => e.id)).toEqual([d.id, c.sym.id])

    // dorbit relationships
    expect(Array.from(a.dorbit).map((e) => e.id)).toEqual([a.id, b.sym.id])
    expect(Array.from(b.dorbit).map((e) => e.id)).toEqual([b.id, c.sym.id])
    expect(Array.from(c.dorbit).map((e) => e.id)).toEqual([c.id, d.sym.id])
    expect(Array.from(d.dorbit).map((e) => e.id)).toEqual([d.id, a.sym.id])

    // lorbit relationships
    expect(Array.from(a.lorbit).map((e) => e.id)).toEqual([a.id, b.id, c.id, d.id])
    expect(Array.from(b.lorbit).map((e) => e.id)).toEqual([b.id, c.id, d.id, a.id])
    expect(Array.from(c.lorbit).map((e) => e.id)).toEqual([c.id, d.id, a.id, b.id])
    expect(Array.from(d.lorbit).map((e) => e.id)).toEqual([d.id, a.id, b.id, c.id])

    // rorbit relationships
    expect(Array.from(a.rorbit).map((e) => e.id)).toEqual([a.id, d.id, c.id, b.id])
    expect(Array.from(b.rorbit).map((e) => e.id)).toEqual([b.id, a.id, d.id, c.id])
    expect(Array.from(c.rorbit).map((e) => e.id)).toEqual([c.id, b.id, a.id, d.id])
    expect(Array.from(d.rorbit).map((e) => e.id)).toEqual([d.id, c.id, b.id, a.id])
}
