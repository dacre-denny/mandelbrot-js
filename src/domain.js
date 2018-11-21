const zoom = (view, fracX, fracY, factor) => {

    fracX -= 0.5
    fracY -= 0.5

    const mapWidth = zoomWidth(view)
    const mapHeight = zoomHeight(view)

    const newZoom = view.zoom * factor

    const newMapWidth = newZoom * view.aspectRatio
    const newMapHeight = newZoom

    const x = view.x - (fracX * (newMapWidth - mapWidth))
    const y = view.y - (fracY * (newMapHeight - mapHeight))
    const zoom = newZoom

    return {
        x,
        y,
        zoom,
        aspectRatio: view.aspectRatio
    }
}

const translate = (view, fracX, fracY) => {

    const dw = zoomWidth(view)
    const dh = zoomHeight(view)

    const x = view.x + fracX * dw
    const y = view.y + fracY * dh

    return {
        x,
        y,
        zoom: view.zoom,
        aspectRatio: view.aspectRatio
    }
}

const lerp = (a, b, t) => ((b - a) * t + a)

const interpolate = (fromDomain, toDomain, frac) => {

    const x = lerp(fromDomain.x, toDomain.x, frac)
    const y = lerp(fromDomain.y, toDomain.y, frac)
    const zoom = lerp(fromDomain.zoom, toDomain.zoom, frac)
    const aspectRatio = lerp(fromDomain.aspectRatio, toDomain.aspectRatio, frac)

    return {
        x,
        y,
        zoom,
        aspectRatio
    }
}

const zoomWidth = (view) => {

    return view.zoom * view.aspectRatio
}

const zoomHeight = (view) => {

    return view.zoom
}

const identity = () => {
    return {
        x: 0,
        y: 0,
        aspectRatio: 1,
        zoom: 1
    }
}

export default {
    identity,
    zoom,
    translate,
    interpolate,
    zoomWidth,
    zoomHeight,
}