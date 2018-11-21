import Mandelbrot from './mandelbrot'
import Domain from './domain'
import state from './state'
import WebGL from './webgl'

let context = null

const easeOutCubic = (t) => {
    t--;
    return (t * t * t + 1)
}

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

    const factor = (event.wheelDeltaY > 0) ? 0.75 : 1.25

    animateToView(Domain.zoom(state.view, x, y, factor))
}

const animateToView = (viewEnd) => {

    if (state.flying) {
        clearTimeout(state.flying)
        state.flying = undefined
    }

    const SPEED = 0.1
    const viewStart = Object.assign({}, state.view)

    const iteration = (time) => {

        const nextTime = Math.min(1.0, time + SPEED)

        state.view = Domain.interpolate(viewStart, viewEnd, easeOutCubic(nextTime))
        state.flying = (time < 1.0) ? setTimeout(iteration, 10, nextTime) : undefined
    }

    state.flying = setTimeout(iteration, 0, 0)
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

    animateToView(Domain.identity())
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

        animateToView(Domain.zoom(state.view, x, y, 0.1))
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
    animateToView,
    onReset,
    onAnimateToggle,
    onToggleMode,
    onChangeResoultion,
    onChangeIterations,
    onWindowResize
}