import Mandelbrot from './mandelbrot'
import View from './view'
import state from './state'
import WebGL from './webgl'
import * as UI from './ui'

let context = null

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

const loadCanvas = (isWebGL) => {

    for (const node of document.body.querySelectorAll('canvas')) {

        node.remove()
    }

    const canvas = document.createElement('canvas')
    canvas.addEventListener('mousemove', onCanvasMouseMove)
    canvas.addEventListener('mousewheel', onCanvasMouseWheel)
    canvas.addEventListener('dblclick', onCanvasDoubleClick)
    canvas.addEventListener('contextmenu', event => event.preventDefault())

    document.body.appendChild(canvas)

    if (isWebGL) {

        context = canvas.getContext('webgl')
        WebGL.init(context, state.iterations)
    }
    else {

        context = canvas.getContext('2d')
    }
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

    const canvas = document.querySelector('canvas')

    const width = parseInt(document.body.clientWidth * state.resolution)
    const height = parseInt(document.body.clientHeight * state.resolution)

    if (canvas.width !== width) {
        canvas.width = width
    }

    if (canvas.height !== height) {
        canvas.height = height
    }

    if (state.webgl) {
        WebGL.render(context, state, View.aspectRatio())
    }
    else {
        onRenderSoftwareFrame(context)
    }

    if (state.animate) {
        state.time = (Date.now() / 1000.0) % 1000
    }
}

const onReset = () => {

    animateToView(View.identity())
}

const onChangeResoultion = (event) => {

    state.resolution = parseFloat(event.currentTarget.value)
}

const onChangeIterations = (event) => {

    state.iterations = parseInt(event.currentTarget.value)

    if (state.webgl) {
        WebGL.init(context, state.iterations)
    }
}

const onAnimateToggle = () => {

    state.animate = !state.animate
}

const onToggleMode = () => {

    state.webgl = !state.webgl

    loadCanvas(state.webgl)
}

const onInit = () => {

    UI.createButton('reset', onReset)

    UI.createToggle('animate', state.animate, onAnimateToggle)
    UI.createToggle('mode', state.webgl, onToggleMode)

    UI.createSlider('resolution', state.resolution, onChangeResoultion)
    UI.createSlider('iterations', state.iterations, onChangeIterations)

    loadCanvas(state.webgl)

    const onRequestAnimationFrame = () => {

        onRenderFrame()
        requestAnimationFrame(onRequestAnimationFrame)
    }

    onRequestAnimationFrame()
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
    onChangeIterations
}