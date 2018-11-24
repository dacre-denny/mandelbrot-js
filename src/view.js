import * as Helpers from './helpers'

export const zoom = (view, fracX, fracY, factor) => {

    fracX -= 0.5
    fracY -= 0.5

    const mapWidth = zoomWidth(view)
    const mapHeight = zoomHeight(view)

    const newZoom = view.zoom * factor

    const newMapWidth = newZoom * aspectRatio()
    const newMapHeight = newZoom

    const x = view.x - (fracX * (newMapWidth - mapWidth))
    const y = view.y - (fracY * (newMapHeight - mapHeight))
    const zoom = newZoom

    return {
        x,
        y,
        zoom
    }
}

export const translate = (view, fracX, fracY) => {

    const dw = zoomWidth(view)
    const dh = zoomHeight(view)

    const x = view.x + fracX * dw
    const y = view.y + fracY * dh

    return {
        x,
        y,
        zoom: view.zoom
    }
}

export const interpolate = (fromDomain, toDomain, frac) => {

    const x = Helpers.lerp(fromDomain.x, toDomain.x, frac)
    const y = Helpers.lerp(fromDomain.y, toDomain.y, frac)
    const zoom = Helpers.lerp(fromDomain.zoom, toDomain.zoom, frac)

    return {
        x,
        y,
        zoom
    }
}

export const aspectRatio = () => {

    return document.body.clientWidth / document.body.clientHeight
}

export const zoomWidth = (view) => {

    return view.zoom * aspectRatio()
}

export const zoomHeight = (view) => {

    return view.zoom
}

export const identity = () => {
    return {
        x: -0.5,
        y: 0,
        zoom: 3
    }
}