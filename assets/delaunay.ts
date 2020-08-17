import { EdgeBag, makeEdgeBag } from "../src/quad-edge"
import { Point2D, makePoint2D } from "../src/two-d"
import { getCircle, inCircle } from "../src/math"
import { insertSite, isBoundaryEdge, isBoundaryPoint, locate } from "../src/quad-edge-2d"
import { line, strokeCircle, text } from "./canvas-utils"

import { Edge } from "../src/edge"

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

const colors = ["green", "blue", "orange", "yellow"]

const isDrawable = (e: Edge<Point2D>): boolean => !isBoundaryPoint(e.odata) && !isBoundaryPoint(e.ddata)

const makeFrameReqCallback = (sketch: Sketch): FrameRequestCallback => {
    const frameReqCallback = (time: number) => {
        sketch.context.fillStyle = "white"
        sketch.context.fillRect(0, 0, sketch.canvas.width, sketch.canvas.height)

        const edges = sketch.edgeBag.edges.filter((edge) => edge.odata != undefined)

        edges.forEach((e) => {
            // console.log(e.toJSON())
            if (!isDrawable(e)) {
                return
            }
            line(sketch.context, e.odata, e.ddata, 1, "red")
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

    const left = sketch.edgeBag.addPolygon(3)
    const cross = left.lnext
    const top = cross.lnext
    left.odata = makePoint2D(-Infinity, -Infinity)
    cross.odata = makePoint2D(0, Infinity)
    top.odata = makePoint2D(Infinity, 0)

    for (let i = 0; i < 10; i++) {
        insertSite(sketch.edgeBag, makePoint2D(Math.floor(Math.random() * 800), Math.floor(Math.random() * 800)))
    }

    // const a = makePoint2D(720, 740)
    // const b = makePoint2D(330, 410)
    // const c = makePoint2D(110, 410)
    // const d = makePoint2D(400, 190)
    // const sites = [a, b, c, d]
    // sites.forEach((site) => {
    //     insertSite(sketch.edgeBag, site)
    // })

    window.requestAnimationFrame(makeFrameReqCallback(sketch))
}
