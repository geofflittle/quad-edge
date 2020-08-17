import { add, mult, sub } from "../src/polynomial"

describe("polynomial add", () => {
    it("adds empty", () => {
        expect(add([], [])).toEqual([])
    })
    it("adds empty and non-empty, 0", () => {
        expect(add([], [0])).toEqual([0])
    })
    it("adds empty and non-empty, 1", () => {
        expect(add([], [1])).toEqual([1])
    })
    it("adds arbitrary", () => {
        expect(add([1, 2, 4], [5, 0, 10, 6])).toEqual([6, 2, 14, 6])
    })
})

describe("polynomial subtract", () => {
    it("subtracts empty", () => {
        expect(sub([], [])).toEqual([])
    })
    it("subtracts empty and non-empty, 0", () => {
        expect(sub([], [0])).toEqual([0])
    })
    it("subtracts empty and non-empty, 1", () => {
        expect(sub([], [1])).toEqual([-1])
    })
    it("subtracts arbitrary", () => {
        expect(sub([1, 2, 4], [5, 0, 10, 6])).toEqual([-4, 2, -6, -6])
    })
    it("subtracts arbitrary", () => {
        expect(sub([], [])).toEqual([])
    })
})

describe("polynomial multiply", () => {
    it("multiplies arbitrary", () => {
        expect(mult([1, 2, 4], [5, 0, 10, 6])).toEqual([5, 10, 30, 26, 52, 24])
    })
})
