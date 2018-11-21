import Mandelbrot from './mandelbrot'
import Domain from './domain'
import state from './state'
import WebGL from './webgl'

let context = null

const onCanvasMouseMove = (event) => {

    if (event.buttons > 0) {

        const dx = -event.movementX / document.body.clientWidth
        const dy = -event.movementY / document.body.clientHeight

        state.view = Domain.translate(state.view, dx, dy)
    }
}

const onCanvasMouseWheel = (event) => {

    const x = (event.clientX / document.body.clientWidth)
    const y = (event.clientY / document.body.clientHeight)

    const factor = (event.wheelDeltaY > 0) ? 0.95 : 1.15

    state.view = Domain.zoom(state.view, x, y, factor)
}

function ease(t) {
    t--;
    return (t * t * t + 1)
}

const onCanvasFlyTo = (toX, toY, zoom) => {

    if (state.flying) {
        clearTimeout(state.flying)
        state.flying = undefined
    }

    const fromDomain = Object.assign({}, state.view)
    const toDomain = Domain.zoom(state.view, toX, toY, zoom)

    let flyFrac = 0
    const flyStep = () => {

        if (flyFrac < 1.0) {

            const dt = 0.075
            const e = ease(flyFrac)

            state.view = Domain.interpolate(fromDomain, toDomain, e)
            flyFrac += dt

            state.flying = setTimeout(flyStep)
        }
        else {

            state.flying = undefined
        }
    }

    state.flying = setTimeout(flyStep)
}

const onRenderSoftwareFrame = () => {

    const width = context.canvas.width
    const height = context.canvas.height

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const imageData = context.getImageData(0, 0, width, height)

    Mandelbrot(imageData.data, width, height, state.time, state.iterations, state.view)

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

    state.view = Domain.identity()
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

        onCanvasFlyTo(x, y, 0.1)
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