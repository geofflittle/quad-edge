import { EdgeBag, makeEdgeBag } from "../src/quad-edge"
import { Point2D, makePoint2D } from "../src/two-d"
import { getCircle, inCircle } from "../src/math"
import { insertSite, isBoundaryEdge, isBoundaryPoint, locate } from "../src/quad-edge-2d"
import { line, strokeCircle, text } from "./canvas-utils"

import { Edge } from "../src/edge"
import { makePoly } from "../src/polynomial"

interface Mouse {
    loc?: Point2D
    state: "UP" | Point2D
}

interface Sketch {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    lines: [number, number, number, number][]
    mouse: Mouse
    edgeBag: EdgeBag<Point2D>
}

const colors = ["green", "blue", "red"]

const isDrawable = (e: Edge<Point2D>): boolean => !isBoundaryPoint(e.odata) && !isBoundaryPoint(e.ddata)

const makeFrameReqCallback = (sketch: Sketch): FrameRequestCallback => {
    const frameReqCallback = (time: number) => {
        sketch.context.fillStyle = "white"
        sketch.context.fillRect(0, 0, sketch.canvas.width, sketch.canvas.height)

        const edges = sketch.edgeBag.edges.filter((edge) => edge.odata != undefined)

        edges.forEach((e) => {
            // console.log(e.toJSON())
            // if (!isDrawable(e)) {
            //     return
            // }
            line(sketch.context, e.odata, e.ddata, 2, "black")
        })

        const seen: Set<string> = new Set()
        const faces: Edge<Point2D>[][] = []
        for (let e of edges) {
            if (seen.has(e.id) || isBoundaryEdge(e)) {
                continue
            }
            const lorbit = Array.from(e.lorbit)
            if (!lorbit.every((fe) => isDrawable(fe))) {
                continue
            }
            faces.push(lorbit)
            lorbit.forEach((fe) => seen.add(fe.id))
        }

        for (let i = 0; i < faces.length; i++) {
            const face = faces[i]
            const a = face[0]
            const b = a.lnext
            const c = b.lnext
            const [center, r] = getCircle(a.odata, b.odata, c.odata)

            // if (sketch.mouse.loc != undefined && inCircle(a.odata, b.odata, c.odata, sketch.mouse.loc)) {
            //     strokeCircle(sketch.context, center, r, 3, "green")
            // } else {
            // strokeCircle(sketch.context, center, r, 1, colors[i % colors.length])
            // }
        }

        // window.requestAnimationFrame(frameReqCallback)
    }
    return frameReqCallback
}

window.onload = () => {
    const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
    const context = canvas.getContext("2d")

    const sketch: Sketch = {
        canvas,
        context,
        mouse: {
            loc: undefined,
            state: "UP"
        },
        lines: [],
        edgeBag: makeEdgeBag<Point2D>()
    }

    canvas.addEventListener(
        "mousemove",
        (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            const x = event.x - rect.left
            const y = event.y - rect.top
            sketch.mouse.loc = makePoint2D(x, y)
        },
        false
    )

    canvas.addEventListener(
        "mousedown",
        (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            const x = event.x - rect.left
            const y = event.y - rect.top
            sketch.mouse.state = makePoint2D(x, y)
        },
        false
    )

    canvas.addEventListener(
        "mouseup",
        (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            const x = event.x - rect.left
            const y = event.y - rect.top
            sketch.mouse.state = "UP"
        },
        false
    )

    sketch.edgeBag = makeEdgeBag<Point2D>()

    const a = sketch.edgeBag.addPolygon(4)
    const b = a.lnext
    const c = b.lnext
    const d = c.lnext
    a.odata = makePoint2D(-Infinity, -Infinity)
    b.odata = makePoint2D(-Infinity, Infinity)
    c.odata = makePoint2D(Infinity, Infinity)
    d.odata = makePoint2D(Infinity, -Infinity)

    const rad = 50
    const cs = Math.floor(rad / Math.sqrt(2))
    console.log(cs)

    const grid: Point2D[][] = new Array(Math.ceil(sketch.canvas.height / cs))
        .fill(0)
        .map(() => new Array(Math.ceil(sketch.canvas.width / cs)).fill(undefined))
    const active: Point2D[] = []

    const x_0 = makePoint2D(
        Math.floor(Math.random() * sketch.canvas.width),
        Math.floor(Math.random() * sketch.canvas.height)
    )
    const col = Math.floor(x_0.x / cs)
    const row = Math.floor(x_0.y / cs)
    grid[col][row] = x_0
    active.push(x_0)

    console.log(grid)

    const k = 30
    let cur
    while ((cur = active.shift()) != undefined) {
        for (let i = 0; i < k; i++) {
            const angle = Math.random() * 2 * Math.PI
            const mag = Math.floor(Math.random() * rad) + rad
            const x_delta = Math.cos(angle) * mag
            const y_delta = Math.sin(angle) * mag
            const next = makePoint2D(Math.floor(cur.x + x_delta), Math.floor(cur.y + y_delta))
            if (next.x <= 0 || next.x >= sketch.canvas.width || next.y <= 0 || next.y >= sketch.canvas.height) {
                continue
            }
            const next_col = Math.floor(next.x / cs)
            const next_row = Math.floor(next.y / cs)
            if (!shouldBeActive(grid, next_col, next_row, next, rad)) {
                continue
            }
            // console.log({
            //     cur,
            //     next,
            //     next_col,
            //     next_row
            // })
            grid[next_col][next_row] = next
            active.push(next)
        }
    }

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            let site
            if ((site = grid[i][j]) == undefined) {
                continue
            }
            insertSite(sketch.edgeBag, grid[i][j])
        }
    }

    // for (let i = 0; i < 100; i++) {
    //     insertSite(sketch.edgeBag, )
    // }

    // const a = makePoint2D(700, 200)
    // const b = makePoint2D(100, 100)
    // const c = makePoint2D(200, 700)
    // const d = makePoint2D(600, 400)
    // const sites = [a, b, c, d]
    // sites.forEach((site) => {
    //     insertSite(sketch.edgeBag, site)
    // })

    window.requestAnimationFrame(makeFrameReqCallback(sketch))
}

const dist = (a: Point2D, b: Point2D) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

const shouldBeActive = (grid: Point2D[][], col: number, row: number, p: Point2D, radius: number) => {
    for (let i = Math.max(0, col - 1); i <= Math.min(grid.length - 1, col + 1); i++) {
        for (let j = Math.max(row - 1); j <= Math.min(grid[i].length - 1, row + 1); j++) {
            if (grid[i][j] && dist(grid[i][j], p) < radius) {
                return false
            }
        }
    }
    return true
}
