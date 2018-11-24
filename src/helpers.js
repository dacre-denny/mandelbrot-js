const PRECOMPUTATION_ITERATIONS = 10000

const precomputedCycle = []

const precomputeCycleIfNeeded = () => {

    if (precomputedCycle.length === 0) {

        for (var index = 0; index < PRECOMPUTATION_ITERATIONS; index++) {

            const theta = 2.0 * Math.PI * (index / PRECOMPUTATION_ITERATIONS)

            precomputedCycle.push(Math.sin(theta))
        }
    }
}

export const lerp = (a, b, time) => {

    return (b - a) * time + a
}

export const easeOutCubic = (time) => {

    time--;

    return (time * time * time + 1)
}

export const sin = (phase) => {

    precomputeCycleIfNeeded()

    const sineLookup = parseInt((phase * PRECOMPUTATION_ITERATIONS) / (2.0 * Math.PI)) % PRECOMPUTATION_ITERATIONS

    return precomputedCycle[sineLookup]
}

export const cos = (phase) => {

    precomputeCycleIfNeeded()

    const cosineLoopup = parseInt(((phase + (Math.PI * 0.5)) * PRECOMPUTATION_ITERATIONS) / (2.0 * Math.PI)) % PRECOMPUTATION_ITERATIONS

    return precomputedCycle[cosineLoopup]
}