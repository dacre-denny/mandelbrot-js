import Mandelbrot from './mandelbrot'
import state from './state'
import * as View from './view'
import * as WebGL from './webgl'
import * as UI from './ui'
import * as Helpers from './helpers'
import * as Canvas from './canvas'

let context = null

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
        const frac = Helpers.easeOutCubic(nextTime)

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

    try {
        if (isWebGL) {

            context = WebGL.init(canvas, state.iterations)
        }
        else {

            context = canvas.getContext('2d')
        }

    }
    catch (err) {
        console.error(err)

        state.webgl = false
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
        Canvas.onRenderSoftwareFrame(context, state)
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
        loadCanvas(state.webgl)
    }
}

const onChangeDivergence = (event) => {

    state.divergence = parseInt(event.currentTarget.value)

    if (state.webgl) {
        loadCanvas(state.webgl)
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
    UI.createSlider('divergence', state.divergence, onChangeDivergence)

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