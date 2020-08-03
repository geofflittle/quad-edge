import {
    CreateEdgeRecordProps,
    DeleteEdgeRecord,
    EdgeRecord,
    UpdateEdgeRecord,
    makeCreateEdgeRecord,
    makeDeleteEdgeRecord,
    makeUpdateEdgeRecord
} from "./edge-record"
import { Edge, makeToEdge } from "./edge"

export type CreateEdge<T> = () => Edge<T>
export type Splice<T> = (a: Edge<T>, b: Edge<T>) => void
export type DeleteEdge<T> = (e: Edge<T>) => Edge<T>
export type Concat<T> = (a: Edge<T>, b: Edge<T>) => void
export type AddEdge<T> = (e: Edge<T>) => Edge<T>
export type Connect<T> = (a: Edge<T>, b: Edge<T>) => Edge<T>
export type AddPolygon<T> = (n: number) => Edge<T>
export type Swap<T> = (e: Edge<T>) => void

export interface EdgeBag<T> {
    readonly edges: Edge<T>[]
    createEdge: CreateEdge<T>
    splice: Splice<T>
    deleteEdge: DeleteEdge<T>
    concat: Concat<T>
    addEdge: AddEdge<T>
    connect: Connect<T>
    addPolygon: AddPolygon<T>
    swap: Swap<T>
}

const makeCreateEdge = <T>(
    createEdgeRecord: (props: CreateEdgeRecordProps) => EdgeRecord<T>,
    toEdge: (edgeRecord: EdgeRecord<T>) => Edge<T>,
    idProvider: () => string
): (() => Edge<T>) => {
    return () => {
        const e_0_id = idProvider()
        const e_1_id = idProvider()
        const e_2_id = idProvider()
        const e_3_id = idProvider()
        const e_0 = createEdgeRecord({ id: e_0_id, rotId: e_1_id, onextId: e_0_id })
        createEdgeRecord({ id: e_1_id, rotId: e_2_id, onextId: e_3_id })
        createEdgeRecord({ id: e_2_id, rotId: e_3_id, onextId: e_2_id })
        createEdgeRecord({ id: e_3_id, rotId: e_0_id, onextId: e_1_id })
        return toEdge(e_0)
    }
}

const makeSplice = <T>(updateEdgeRecord: UpdateEdgeRecord<T>): Splice<T> => (a: Edge<T>, b: Edge<T>) => {
    const alpha = a.onext.rot
    const beta = b.onext.rot
    const t1 = b.onext
    const t2 = a.onext
    const t3 = beta.onext
    const t4 = alpha.onext
    updateEdgeRecord({ id: a.id, onextId: t1.id })
    updateEdgeRecord({ id: b.id, onextId: t2.id })
    updateEdgeRecord({ id: alpha.id, onextId: t3.id })
    updateEdgeRecord({ id: beta.id, onextId: t4.id })
    b.odata = a.odata
    beta.odata = alpha.odata
}

const makeDeleteEdge = <T>(deleteEdgeRecord: DeleteEdgeRecord<T>, splice: Splice<T>): ((e: Edge<T>) => Edge<T>) => (
    e: Edge<T>
) => {
    if (e.rot.onext.id != e.invrot.id || e.onext.id != e.id) {
        // We need to isolate the edge before we remove it
        splice(e, e.oprev)
        splice(e.sym, e.sym.oprev)
    }
    const rot = e.rot
    const sym = e.sym
    const invrot = e.invrot
    deleteEdgeRecord({ id: e.id })
    deleteEdgeRecord({ id: rot.id })
    deleteEdgeRecord({ id: sym.id })
    deleteEdgeRecord({ id: invrot.id })
    return e
}

const makeConcat = <T>(splice: Splice<T>): Concat<T> => (a: Edge<T>, b: Edge<T>) => {
    splice(a.sym, b)
}

const makeAddEdge = <T>(createEdge: CreateEdge<T>, splice: Splice<T>): AddEdge<T> => (a: Edge<T>) => {
    const b = createEdge()
    splice(a.sym, b)
    return b
}

// Probably don't use this
const makeConnect = <T>(createEdge: CreateEdge<T>, splice: Splice<T>): Connect<T> => (a: Edge<T>, b: Edge<T>) => {
    const c = createEdge()
    splice(a.lnext, c)
    splice(b, c.sym)
    return c
}

const makeAddPolygon = <T>(createEdge: CreateEdge<T>, addEdge: AddEdge<T>, connect: Connect<T>): AddPolygon<T> => (
    n: number
) => {
    if (n < 2) {
        throw new Error()
    }
    const first = createEdge()
    const penultimate = [...new Array(n - 2).keys()].reduce(addEdge, first)
    connect(penultimate, first)
    return first
}

const makeSwap = <T>(splice: Splice<T>): Swap<T> => (e: Edge<T>) => {
    const a = e.oprev
    const b = e.sym.oprev
    splice(e, a)
    splice(e.sym, b)
    splice(e, a.lnext)
    splice(e.sym, b.lnext)
}

const toAlpha = (n: number): string =>
    (n > 26 ? toAlpha(Math.floor((n - 1) / 26)) : "") + ((n % 26 || 26) + 9).toString(36)

export const makeEdgeBag = <T>(): EdgeBag<T> => {
    let idx = 1
    const edgeRecords: Record<string, EdgeRecord<T>> = {}
    const addEdgeRecord = makeCreateEdgeRecord(edgeRecords)
    const getEdgeRecord = (id: string) => edgeRecords[id]
    const updateEdgeRecord = makeUpdateEdgeRecord(edgeRecords)
    const deleteEdgeRecord = makeDeleteEdgeRecord(edgeRecords)
    const toEdge = makeToEdge(getEdgeRecord, updateEdgeRecord)
    const createEdge = makeCreateEdge(addEdgeRecord, toEdge, () => toAlpha(idx++))
    const splice = makeSplice(updateEdgeRecord)
    const deleteEdge = makeDeleteEdge(deleteEdgeRecord, splice)
    const concat = makeConcat(splice)
    const addEdge = makeAddEdge(createEdge, splice)
    const connect = makeConnect(createEdge, splice)
    const addPolygon = makeAddPolygon(createEdge, addEdge, connect)
    const swap = makeSwap(splice)
    return {
        get edges() {
            return Object.values(edgeRecords).map(toEdge)
        },
        createEdge,
        splice,
        deleteEdge,
        concat,
        addEdge,
        connect,
        addPolygon,
        swap
    }
}
