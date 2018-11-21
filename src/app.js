import Mandelbrot from './mandelbrot'
import Domain from './domain'
import state from './state'
import WebGL from './webgl'

let context = null

const onCanvasMouseMove = (event) => {

    if (event.buttons > 0) {

        const dx = -event.movementX / document.body.clientWidth
        const dy = -event.movementY / document.body.clientHeight



        const domain = Domain.translate(getDomain(), dx, dy)

        state.center.x += dx * state.zoom
        state.center.y += dy * state.zoom
    }
}

const onCanvasMouseWheel = (event) => {

    const x = (event.clientX / document.body.clientWidth) - 0.5
    const y = (event.clientY / document.body.clientHeight) - 0.5

    const factor = (event.wheelDeltaY > 0) ? 0.95 : 1.15

    const mapWidth = state.zoom * state.aspectRatio
    const mapHeight = state.zoom

    const newZoom = state.zoom * factor

    const newMapWidth = newZoom * state.aspectRatio
    const newMapHeight = newZoom

    state.center.x = state.center.x - (x * (newMapWidth - mapWidth))
    state.center.y = state.center.y - (y * (newMapHeight - mapHeight))
    state.zoom = newZoom
}

const getDomain = () => {
    return {
        left: state.center.x - (state.zoom * state.aspectRatio * 0.5),
        right: state.center.x + (state.zoom * state.aspectRatio * 0.5),
        top: state.center.y - (state.zoom * 0.5),
        bottom: state.center.y + (state.zoom * 0.5)
    }
}

const onCanvasFlyTo = (toX, toY, zoom) => {

    if (!state.flying) {

        const fromDomain = Object.assign({}, state.domain)
        const toDomain = Domain.zoom(state.domain, toX, toY, zoom)

        state.flying = true

        let flyFrac = 0
        const flyStep = () => {

            if (flyFrac < 1.0) {

                state.domain = Domain.interpolate(fromDomain, toDomain, flyFrac)
                flyFrac += 0.025

                setTimeout(flyStep)
            }
            else {
                state.flying = false
            }
        }

        flyStep()
    }
}

const onRenderSoftwareFrame = () => {

    const width = context.canvas.width
    const height = context.canvas.height

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const imageData = context.getImageData(0, 0, width, height)

    const domain = getDomain()

    Mandelbrot(imageData.data, width, height, state.time, state.iterations, domain)

    context.putImageData(imageData, 0, 0)
}

const onRenderFrame = () => {

    if (state.webgl) {
        WebGL.render(context, state)
    }
    else {
        onRenderSoftwareFrame()
    }

    if (state.animate) {
        state.time = (Date.now() / 1000.0) % 1000
    }
}

const onReset = () => {

    state.domain = {
        left: -1,
        right: 1,
        top: -1,
        bottom: 1
    }
}

const onWindowResize = () => {

    state.aspectRatio = document.body.clientWidth / document.body.clientHeight
}

const onChangeResoultion = (event) => {

    state.resolution = parseInt(event.currentTarget.value)
}

const onChangeIterations = (event) => {

    state.iterations = parseInt(event.currentTarget.value)
}

const onAnimateToggle = (event) => {

    state.animate = !state.animate

    const classList = event.currentTarget.classList

    if (state.animate) {
        classList.add('toggled')
    }
    else {
        classList.remove('toggled')
    }
}

const onToggleMode = (event) => {

    state.webgl = !state.webgl

    const classList = event.currentTarget.classList
    if (state.webgl) {
        classList.add('toggled')
        document.getElementById('iterations').setAttribute('disabled', 'disabled')
    }
    else {
        classList.remove('toggled')
        document.getElementById('iterations').removeAttribute('disabled')
    }

    createCanvas()
}

const createCanvas = () => {

    for (const node of document.body.querySelectorAll('canvas')) { node.remove() }

    context = null

    const canvas = document.createElement('canvas')

    canvas.width = state.resolution
    canvas.height = state.resolution

    document.body.appendChild(canvas)

    if (state.webgl) {

        context = canvas.getContext('webgl')
        WebGL.init(context)
    }
    else {
        context = canvas.getContext('2d')
    }

    canvas.addEventListener('mousemove', onCanvasMouseMove)

    canvas.addEventListener('mousewheel', onCanvasMouseWheel)

    canvas.addEventListener('dblclick', event => {

        const x = event.clientX / document.body.clientWidth
        const y = event.clientY / document.body.clientHeight

        onCanvasFlyTo(x, y, 0.17)
    })

    canvas.addEventListener('contextmenu', event => event.preventDefault())

    onWindowResize()
}

const onInit = () => {

    createCanvas()

}

export default {
    onInit,
    onRenderFrame,
    onCanvasMouseMove,
    onCanvasMouseWheel,
    onCanvasFlyTo,
    onReset,
    onAnimateToggle,
    onToggleMode,
    onChangeResoultion,
    onChangeIterations,
    onWindowResize
}