import { EdgeBag, makeEdgeBag } from "../src/quad-edge"
import { Point2D, makePoint2D } from "../src/two-d"
import { getCircle, inCircle } from "../src/math"
import { line, strokeCircle, text } from "./canvas-utils"

import { Edge } from "../src/edge"
import { locate } from "../src/quad-edge-2d"

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

        const faces: Set<Set<Edge<Point2D>>> = new Set(
            edges.map((edge) => new Set(edge.lorbit)).filter((face) => face.size == 3)
        )
        faces.forEach((face) => {
            const vals = Array.from(face.values())
            const a = vals[0]
            const b = a.lnext
            const c = b.lnext
            const [center, r] = getCircle(a.odata, b.odata, c.odata)

            if (sketch.mouse.loc != undefined && inCircle(a.odata, b.odata, c.odata, sketch.mouse.loc)) {
                strokeCircle(sketch.context, center, r, 3, "green")
            } else {
                strokeCircle(sketch.context, center, r, 1, "black")
            }
        })

        edges.forEach((edge) => {
            line(sketch.context, edge.odata, edge.ddata, 3, "black", edge.id)
        })

        let loc
        if (sketch.mouse.loc != undefined && (loc = locate(sketch.mouse.loc, edges[0]))) {
            line(sketch.context, loc.odata, loc.ddata, 4, "blue", loc.id)
        }

        if (sketch.mouse.loc != undefined) {
            const font = "bold 10px Courier New"
            sketch.context.fillStyle = "white"
            sketch.context.fillRect(20, 20, 70, 15)
            sketch.context.strokeStyle = "black"
            sketch.context.lineWidth = 1
            sketch.context.strokeRect(20, 20, 70, 15)
            text(sketch.context, "black", font, `(${sketch.mouse.loc.x},${sketch.mouse.loc.y})`, makePoint2D(20, 30))
        }

        window.requestAnimationFrame(frameReqCallback)
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
    const top = sketch.edgeBag.addPolygon(4)
    const left = top.lnext
    const bottom = left.lnext
    const right = bottom.lnext
    top.odata = makePoint2D(sketch.canvas.width, 0)
    left.odata = makePoint2D(0, 0)
    bottom.odata = makePoint2D(0, sketch.canvas.height)
    right.odata = makePoint2D(sketch.canvas.width, sketch.canvas.height)

    const a = sketch.edgeBag.addPolygon(3)
    const b = a.lnext
    const c = b.lnext
    a.odata = makePoint2D(200, 300)
    b.odata = makePoint2D(300, 600)
    c.odata = makePoint2D(600, 400)

    const d = sketch.edgeBag.connect(left, c.sym)
    const e = sketch.edgeBag.connect(bottom, d.sym)
    const f = sketch.edgeBag.connect(bottom, a.sym)
    const g = sketch.edgeBag.connect(right, f.sym)
    const h = sketch.edgeBag.connect(right, b.sym)
    const i = sketch.edgeBag.connect(top, h.sym)
    const j = sketch.edgeBag.connect(top, c.sym)

    window.requestAnimationFrame(makeFrameReqCallback(sketch))
}
