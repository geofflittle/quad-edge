import { EdgeBag, makeEdgeBag } from "../src/quad-edge"
import { Point2D, makePoint2D } from "../src/two-d"
import { getCircle, inCircle } from "../src/math"
import { insertSite, locate } from "../src/quad-edge-2d"
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

const makeFrameReqCallback = (sketch: Sketch): FrameRequestCallback => {
    const frameReqCallback = (time: number) => {
        sketch.context.fillStyle = "white"
        sketch.context.fillRect(0, 0, sketch.canvas.width, sketch.canvas.height)

        const edges = sketch.edgeBag.edges.filter((edge) => edge.odata != undefined)

        edges.forEach((edge) => {
            console.log(edge.toJSON())
            line(sketch.context, edge.odata, edge.ddata, 3, "black", edge.id)
        })

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

    insertSite(sketch.edgeBag, makePoint2D(100, 100))
    // insertSite(sketch.edgeBag, makePoint2D(100, 600))
    // insertSite(sketch.edgeBag, makePoint2D(600, 300))
    // insertSite(sketch.edgeBag, makePoint2D(600, 500))

    window.requestAnimationFrame(makeFrameReqCallback(sketch))
}
