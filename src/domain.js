const zoom = (domain, fracX, fracY, zoomPercent) => {

    const domainX = (domain.right - domain.left) * x + domain.left
    const domainY = (domain.bottom - domain.top) * y + domain.top

    const left = (domain.left - domainX) * scale + domainX
    const right = (domain.right - domainX) * scale + domainX
    const top = (domain.top - domainY) * scale + domainY
    const bottom = (domain.bottom - domainY) * scale + domainY

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