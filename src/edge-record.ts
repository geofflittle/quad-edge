export interface EdgeRecord<T> {
    readonly id: string
    readonly canonicalId: string
    readonly rotId: string
    onextId: string
    data?: T
}

export interface CreateEdgeRecordProps {
    id: string
    canonicalId: string
    rotId: string
    onextId: string
}

export type CreateEdgeRecord<T> = (props: CreateEdgeRecordProps) => EdgeRecord<T>

export const makeCreateEdgeRecord = <T>(edges: Record<string, EdgeRecord<T>>): CreateEdgeRecord<T> => ({
    id,
    canonicalId,
    rotId,
    onextId
}: CreateEdgeRecordProps) => {
    const edgeRecord = { id, canonicalId, rotId, onextId }
    return (edges[id] = edgeRecord)
}

export interface UpdateEdgeRecordProps<T> {
    id: string
    onextId?: string
    data?: T
}

export type UpdateEdgeRecord<T> = (props: UpdateEdgeRecordProps<T>) => void

export const makeUpdateEdgeRecord = <T>(edges: Record<string, EdgeRecord<T>>): UpdateEdgeRecord<T> => ({
    id,
    onextId,
    data
}) => {
    if (onextId !== undefined) {
        edges[id].onextId = onextId
    }
    if (data !== undefined) {
        edges[id].data = data
    }
}

export interface DeleteEdgeRecordProps<T> {
    id: string
}

export type DeleteEdgeRecord<T> = (props: DeleteEdgeRecordProps<T>) => void

export const makeDeleteEdgeRecord = <T>(edges: Record<string, EdgeRecord<T>>): DeleteEdgeRecord<T> => ({ id }) =>
    delete edges[id]
