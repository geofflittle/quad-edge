import { EdgeRecord, UpdateEdgeRecord } from "./edge-record"

export interface Edge<T> {
    readonly id: string
    odata?: T
    ddata?: T
    readonly rot: Edge<T>
    readonly sym: Edge<T>
    readonly invrot: Edge<T>
    readonly onext: Edge<T>
    readonly oprev: Edge<T>
    readonly oorbit: Iterable<Edge<T>>
    readonly dnext: Edge<T>
    readonly dprev: Edge<T>
    readonly dorbit: Iterable<Edge<T>>
    readonly lnext: Edge<T>
    readonly lprev: Edge<T>
    readonly lorbit: Iterable<Edge<T>>
    readonly rnext: Edge<T>
    readonly rprev: Edge<T>
    readonly rorbit: Iterable<Edge<T>>
    readonly olorbit: Iterable<Edge<T>>
    readonly drorbit: Iterable<Edge<T>>
    toJSON: () => object
    toString: () => string
}

const makeOrbitIterable = <T>(e: Edge<T>, fn: (e: Edge<T>) => Edge<T>[]): Iterable<Edge<T>> => {
    let cur
    const queue = [e]
    const seen = new Set<string>()
    return {
        [Symbol.iterator](): Iterator<Edge<T>> {
            return {
                next: (): IteratorResult<Edge<T>, any> => {
                    cur = queue.shift()
                    if (cur == undefined) {
                        return { value: undefined, done: true }
                    }
                    seen.add(cur.id)
                    queue.push(...fn(cur).filter((edge) => !seen.has(edge.id)))
                    return { value: cur, done: false }
                }
            }
        }
    }
}

export const makeToEdge = <T>(
    getEdgeRecord: (id: string) => EdgeRecord<T>,
    updateEdgeRecord: UpdateEdgeRecord<T>
): ((edgeRecord: EdgeRecord<T>) => Edge<T>) => {
    const toEdge = (edgeRecord: EdgeRecord<T>): Edge<T> => ({
        id: edgeRecord.id,
        get odata(): T | undefined {
            return edgeRecord.data
        },
        set odata(data: T | undefined) {
            Array.from(this.oorbit).map((edge) => updateEdgeRecord({ id: edge.id, data }))
        },
        get ddata(): T | undefined {
            return this.sym.odata
        },
        set ddata(data: T | undefined) {
            this.sym.odata = data
        },
        get rot() {
            return toEdge(getEdgeRecord(edgeRecord.rotId))
        },
        get sym() {
            return this.rot.rot
        },
        get invrot() {
            return this.rot.rot.rot
        },
        get onext() {
            return toEdge(getEdgeRecord(edgeRecord.onextId))
        },
        get oprev() {
            return this.rot.onext.rot
        },
        get oorbit() {
            return makeOrbitIterable<T>(this, (e: Edge<T>) => [e.onext])
        },
        get dnext() {
            return this.sym.onext.sym
        },
        get dprev() {
            return this.invrot.onext.invrot
        },
        get dorbit() {
            return makeOrbitIterable<T>(this, (e: Edge<T>) => [e.dnext])
        },
        get lnext() {
            return this.invrot.onext.rot
        },
        get lprev() {
            return this.onext.sym
        },
        get lorbit() {
            return makeOrbitIterable<T>(this, (e: Edge<T>) => [e.lnext])
        },
        get rnext() {
            return this.rot.onext.invrot
        },
        get rprev() {
            return this.sym.onext
        },
        get rorbit() {
            return makeOrbitIterable<T>(this, (e: Edge<T>) => [e.rnext])
        },
        get olorbit() {
            return makeOrbitIterable<T>(this, (e: Edge<T>) => [e.onext, e.lnext])
        },
        get drorbit() {
            return makeOrbitIterable<T>(this, (e: Edge<T>) => [e.dnext, e.rnext])
        },
        toJSON() {
            return {
                id: this.id,
                odata: this.odata,
                ddata: this.ddata,
                // rot: this.rot.id,
                sym: this.sym.id,
                // invrot: this.invrot.id,
                onext: this.onext.id,
                oprev: this.oprev.id,
                dnext: this.dnext.id,
                dprev: this.dprev.id,
                lnext: this.lnext.id,
                lprev: this.lprev.id,
                rnext: this.rnext.id,
                rprev: this.rprev.id
            }
        },
        toString() {
            return `${this.id} [from ${this.odata} to ${this.ddata}]`
        }
    })
    return toEdge
}
