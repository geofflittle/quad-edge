import { EdgeBag, makeEdgeBag } from "../src/quad-edge-2"
import { Point2D, makePoint2D } from "../src/two-d"
import { ccw, getCircle, inCircle } from "../src/math"
import { fillCircle, line, strokeCircle, text } from "./canvas-utils"
import { locate, rightOf } from "../src/quad-edge-2d"

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

        const faces: Set<Set<Edge<Point2D>>> = new Set(
            edges.map((edge) => new Set(edge.lorbit)).filter((face) => face.size == 3)
        )
        faces.forEach((face) => {
            // console.log(face)
            const vals = Array.from(face.values())
            const a = vals[0]
            const b = a.lnext
            const c = b.lnext
            const [center, r] = getCircle(a.odata, b.odata, c.odata)
            strokeCircle(sketch.context, center, r, 1, "black")
        })
        // const a = sketch.triangleEdgeRef
        // const b = a.lnext
        // const c = b.lnext
        // const triangle = [a, b, c]
        // const [center, r] = getCircle(a.odata, b.odata, c.odata)

        if (sketch.mouse.loc != undefined) {
            const font = "bold 10px Courier New"
            text(sketch.context, "black", font, `(${sketch.mouse.loc.x},${sketch.mouse.loc.y})`, makePoint2D(10, 20))
            // triangle.forEach((edge, idx) => {
            //     text(
            //         sketch.context,
            //         "black",
            //         font,
            //         `RightOf(${edge.id})=${rightOf(sketch.mouse.loc, edge)}`,
            //         makePoint2D(10, 20 * idx + 40)
            //     )
            // })

            // const edge = locate(sketch.mouse.loc, a)
            // if (inCircle(a.odata, b.odata, c.odata, sketch.mouse.loc)) {
            //     strokeCircle(sketch.context, center, r, 3, "green")
            // } else {
            //     strokeCircle(sketch.context, center, r, 3, "red")
            // }
        } else {
            // strokeCircle(sketch.context, center, r, 3, "black")
        }

        edges.forEach((edge) => {
            line(sketch.context, edge.odata, edge.ddata, 3, "black", edge.id)
        })

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

    const d = sketch.edgeBag.createEdge()
    d.odata = makePoint2D(0, 0)
    d.ddata = makePoint2D(200, 200)
    sketch.edgeBag.splice(left, d)
    sketch.edgeBag.splice(c, a)

    // const a = sketch.edgeBag.addPolygon(3)
    // const b = a.lnext
    // const c = b.lnext
    // a.odata = makePoint2D(200, 200)
    // b.odata = makePoint2D(600, 600)
    // c.odata = makePoint2D(600, 100)

    // sketch.edgeBag.connect(top, a)
    // sketch.edgeBag.connect(top, c)
    // sketch.edgeBag.connect(left, a)
    // sketch.edgeBag.connect(left, b)
    // sketch.edgeBag.connect(bottom, b)
    // sketch.edgeBag.connect(right, b)
    // sketch.edgeBag.connect(right, c)
    ;[top, left, bottom, right, a, b, c, d, d.sym].forEach((edge) => console.log(edge.toJSON()))

    window.requestAnimationFrame(makeFrameReqCallback(sketch))
}
