import { replicate, zip, zipWith } from "fp-ts/Array"

export type Polynomial = number[]

export const makePoly = (x: number) => {
    switch (x) {
        case -Infinity:
            return [0, -1]
        case Infinity:
            return [0, 1]
        default:
            return [x]
    }
}

export const add = (a: Polynomial, b: Polynomial): Polynomial => {
    const _a = a.concat(replicate(Math.max(a.length, b.length) - a.length, 0))
    const _b = b.concat(replicate(Math.max(a.length, b.length) - b.length, 0))
    return zipWith(_a, _b, (p, q) => p + q)
}

export const sub = (a: Polynomial, b: Polynomial): Polynomial => {
    const _a = a.concat(replicate(Math.max(a.length, b.length) - a.length, 0))
    const _b = b.concat(replicate(Math.max(a.length, b.length) - b.length, 0))
    return zipWith(_a, _b, (p, q) => p - q)
}

export const mult = (a: Polynomial, b: Polynomial): Polynomial => {
    const product = replicate(a.length + b.length - 1, 0)
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            product[i + j] += a[i] * b[j]
        }
    }
    return product
}

export const comp = (a: Polynomial, b: Polynomial): -1 | 0 | 1 => {
    const res = sub(a, b)
    for (let i = res.length - 1; i >= 0; i--) {
        if (res[i] > 0) {
            return 1
        } else if (res[i] < 0) {
            return -1
        }
    }
    return 0
}
