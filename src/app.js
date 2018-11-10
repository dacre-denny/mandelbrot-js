import Mandelbrot from './mandelbrot'
import Domain from './domain'
import state from './state'

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

const onRenderFrame = (canvas) => {

    const aspect = document.body.clientWidth / document.body.clientHeight

    canvas.width = state.resolution * aspect
    canvas.height = state.resolution

    const context = canvas.getContext('2d')
    const width = context.canvas.width
    const height = context.canvas.height

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const imageData = context.getImageData(0, 0, width, height)

    Mandelbrot(imageData.data, width, height, state.time, state.iterations, state.domain)

    context.putImageData(imageData, 0, 0)

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

const onToggleMode = () => {

}

const onChangeResoultion = (event) => {

    state.resolution = parseInt(event.currentTarget.value)
}

const onChangeIterations = (event) => {

    state.iterations = parseInt(event.currentTarget.value)
}

export default {
    onRenderFrame,
    onCanvasMouseMove,
    onCanvasMouseWheel,
    onCanvasFlyTo,
    onReset,
    onToggleMode,
    onChangeResoultion,
    onChangeIterations
}