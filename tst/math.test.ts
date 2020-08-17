import { leftOf, rightOf } from "../src/quad-edge-2d"

import { ccw } from "../src/math"
import { makePoint2D } from "../src/two-d"

// FIXME
describe.skip("ccw", () => {
    it("is true for (0,0), (0,1), and (1,0)", () => {
        expect(ccw(makePoint2D(0, 0), makePoint2D(0, 1), makePoint2D(1, 0))).toBeTruthy()
    })

    it("is false for (0,0), (0,1), and (1,0)", () => {
        expect(ccw(makePoint2D(0, 0), makePoint2D(1, 0), makePoint2D(0, 1))).toBeFalsy()
    })

    it("is true for (-I,-I), (0,1), and (1,0)", () => {
        expect(ccw(makePoint2D(-Infinity, -Infinity), makePoint2D(1, 0), makePoint2D(0, 1))).toBeFalsy()
    })

    it("is true for (-I,-I), (-I,I), and (1,0)", () => {
        expect(ccw(makePoint2D(-Infinity, -Infinity), makePoint2D(1, 0), makePoint2D(0, 1))).toBeFalsy()
    })

    it("is true for (-I,-I), (-I,I), and (I,-I)", () => {
        expect(ccw(makePoint2D(-Infinity, -Infinity), makePoint2D(1, 0), makePoint2D(0, 1))).toBeFalsy()
    })

    it("is true for (1,0), (-I,-I), and (I,I)", () => {
        expect(ccw(makePoint2D(1, 0), makePoint2D(-Infinity, -Infinity), makePoint2D(Infinity, Infinity))).toBeTruthy()
    })
})

describe("leftOf", () => {
    it("is true for ", () => {
        expect(
            leftOf(makePoint2D(2, 0), makePoint2D(-Infinity, -Infinity), makePoint2D(Infinity, Infinity))
        ).toBeTruthy()
    })
})

describe("rightOf", () => {
    it("is true for ", () => {
        expect(
            rightOf(makePoint2D(1, 1), makePoint2D(-Infinity, Infinity), makePoint2D(-Infinity, -Infinity))
        ).toBeTruthy()
    })
    it("is false for ", () => {
        expect(
            rightOf(makePoint2D(1, 1), makePoint2D(-Infinity, -Infinity), makePoint2D(-Infinity, Infinity))
        ).toBeFalsy()
    })
})
