export const lerp = (a, b, t) => ((b - a) * t + a)

export const easeOutCubic = (t) => {

    t--;
    return (t * t * t + 1)
}
