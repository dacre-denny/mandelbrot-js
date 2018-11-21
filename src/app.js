import Mandelbrot from './mandelbrot'
import View from './view'
import state from './state'
import WebGL from './webgl'

let ctx = null

const easeOutCubic = (t) => {
    t--;
    return (t * t * t + 1)
}

const cursorFracX = (event) => {

    return event.clientX / document.body.clientWidth
}

const cursorFracY = (event) => {

    return event.clientY / document.body.clientHeight
}

const animateToView = (viewEnd) => {

    const SPEED = 0.1
    const viewStart = Object.assign({}, state.view)

    if (state.flying) {

        clearTimeout(state.flying)
        state.flying = undefined
    }

    const iteration = (time) => {

        const nextTime = Math.min(1.0, time + SPEED)
        const frac = easeOutCubic(nextTime)

        state.view = View.interpolate(viewStart, viewEnd, frac)
        state.flying = time < 1.0 ? setTimeout(iteration, 10, nextTime) : undefined
    }

    state.flying = setTimeout(iteration, 0, 0)
}

const onCanvasMouseMove = (event) => {

    if (event.buttons > 0) {

        const dx = -event.movementX / document.body.clientWidth
        const dy = -event.movementY / document.body.clientHeight

        state.view = View.translate(state.view, dx, dy)
    }
}

const onCanvasMouseWheel = (event) => {

    const x = cursorFracX(event)
    const y = cursorFracY(event)
    const scale = event.wheelDeltaY > 0 ? 0.75 : 1.25

    animateToView(View.zoom(state.view, x, y, scale))
}

const onCanvasDoubleClick = (event) => {

    const x = cursorFracX(event)
    const y = cursorFracY(event)
    const scale = 0.1

    animateToView(View.zoom(state.view, x, y, scale))
}

const onRenderSoftwareFrame = (context) => {

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
        WebGL.render(ctx, state)
    }
    else {
        onRenderSoftwareFrame(ctx)
    }

    if (state.animate) {
        state.time = (Date.now() / 1000.0) % 1000
    }
}

const onReset = () => {

    animateToView(View.identity())
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

    ctx = null

    const canvas = document.createElement('canvas')

    canvas.width = state.resolution
    canvas.height = state.resolution

    document.body.appendChild(canvas)

    if (state.webgl) {

        ctx = canvas.getContext('webgl')
        WebGL.init(ctx)
    }
    else {
        ctx = canvas.getContext('2d')
    }

    canvas.addEventListener('mousemove', onCanvasMouseMove)

    canvas.addEventListener('mousewheel', onCanvasMouseWheel)

    canvas.addEventListener('dblclick', onCanvasDoubleClick)

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
    onCanvasDoubleClick,
    animateToView,
    onReset,
    onAnimateToggle,
    onToggleMode,
    onChangeResoultion,
    onChangeIterations,
    onWindowResize
}