import Mandelbrot from './mandelbrot'
import Domain from './domain'
import state from './state'

const RESOLUTION = 200.0

const onWindowResize = (canvas) => {

    canvas.width = RESOLUTION
    canvas.height = RESOLUTION
}

const onCanvasMouseMove = (canvas, event) => {

    if (event.buttons > 0) {

        const dx = -event.movementX / document.body.clientWidth
        const dy = -event.movementY / document.body.clientHeight

        state.domain = Domain.translate(state.domain, dx, dy)
    }
}

const onCanvasMouseWheel = (canvas, event) => {

    const x = event.clientX / document.body.clientWidth
    const y = event.clientY / document.body.clientHeight

    const scale = (event.wheelDeltaY > 0) ? 0.7 : 1.5
    state.domain = Domain.zoom(state.domain, x, y, scale)
}

const onRenderFrame = (canvas) => {

    const context = canvas.getContext('2d')
    const width = context.canvas.width
    const height = context.canvas.height
    const imageData = context.getImageData(0, 0, width, height)

    Mandelbrot(imageData.data, width, height, state.time, state.domain)

    context.clearRect(0, 0, width, height);
    context.putImageData(imageData, 0, 0)

    state.time = Date.now() / 1000.0
}

export default {
    onRenderFrame,
    onCanvasMouseMove,
    onCanvasMouseWheel,
    onWindowResize
}