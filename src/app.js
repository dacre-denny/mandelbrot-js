import Mandelbrot from './mandelbrot'
import Domain from './domain'
import state from './state'

let context = null

const onCanvasMouseMove = (event) => {

    if (event.buttons > 0) {

        const dx = -event.movementX / document.body.clientWidth
        const dy = -event.movementY / document.body.clientHeight

        state.domain = Domain.translate(state.domain, dx, dy)
    }
}

const onCanvasMouseWheel = (event) => {

    const x = event.clientX / document.body.clientWidth
    const y = event.clientY / document.body.clientHeight

    const scale = (event.wheelDeltaY > 0) ? 0.7 : 1.5
    state.domain = Domain.zoom(state.domain, x, y, scale)
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

const getContext = (canvas, type) => {

    return canvas.getContext(type)
}

const onRenderSoftwareFrame = () => {

    const width = context.canvas.width
    const height = context.canvas.height

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const imageData = context.getImageData(0, 0, width, height)

    Mandelbrot(imageData.data, width, height, state.time, state.iterations, state.domain)

    context.putImageData(imageData, 0, 0)
}

const onRenderWebGLFrame = () => {

    context.clearColor(1.0, 0.0, 0.0, 1.0);
    context.clear(context.COLOR_BUFFER_BIT);
}

const onRenderFrame = () => {

    const aspect = document.body.clientWidth / document.body.clientHeight

    if (!context) {
        context = getContext(canvas, state.webgl ? 'webgl' : '2d')
        if (!context) {
            return
        }
    }

    context.canvas.width = state.resolution * aspect
    context.canvas.height = state.resolution

    if (state.webgl) {
        onRenderWebGLFrame()
    }
    else {
        onRenderSoftwareFrame()
    }

    state.time = Date.now() / 1000.0
}

const onReset = () => {

    state.domain = {
        left: -1,
        right: 1,
        top: -1,
        bottom: 1
    }
}

const onChangeResoultion = (event) => {

    state.resolution = parseInt(event.currentTarget.value)
}

const onChangeIterations = (event) => {

    state.iterations = parseInt(event.currentTarget.value)
}

const onToggleMode = () => {

    state.webgl = !state.webgl

    for (const node of document.body.querySelectorAll('canvas')) { node.remove() }

    const canvas = document.createElement('canvas')

    document.body.appendChild(canvas)

    context = canvas.getContext(state.webgl ? 'webgl' : '2d')
}

const createCanvas = () => {

    for (const node of document.body.querySelectorAll('canvas')) { node.remove() }

    context = null

    const canvas = document.createElement('canvas')

    document.body.appendChild(canvas)

    context = canvas.getContext(state.webgl ? 'webgl' : '2d')

    canvas.addEventListener('mousemove', onCanvasMouseMove)

    canvas.addEventListener('mousewheel', onCanvasMouseWheel)

    canvas.addEventListener('dblclick', event => {

        const x = event.clientX / document.body.clientWidth
        const y = event.clientY / document.body.clientHeight

        App.onCanvasFlyTo(x, y, 0.17)
    })

    canvas.addEventListener('contextmenu', event => event.preventDefault())
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
    onToggleMode,
    onChangeResoultion,
    onChangeIterations
}