const zoom = (domain, fracX, fracY, scale) => {

    const originX = (domain.right - domain.left) * fracX + domain.left
    const originY = (domain.bottom - domain.top) * fracY + domain.top

    const left = (domain.left - originX) * scale + originX
    const right = (domain.right - originX) * scale + originX
    const top = (domain.top - originY) * scale + originY
    const bottom = (domain.bottom - originY) * scale + originY

    return {
        left,
        right,
        top,
        bottom
    }
}

const translate = (domain, fracX, fracY) => {

    const dw = (domain.right - domain.left)
    const dh = (domain.bottom - domain.top)

    const left = domain.left + fracX * dw
    const right = domain.right + fracX * dw
    const top = domain.top + fracY * dh
    const bottom = domain.bottom + fracY * dh

    return {
        left,
        right,
        top,
        bottom
    }
}

export default {
    zoom,
    translate
}