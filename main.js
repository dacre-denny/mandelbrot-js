import mandelbrot from './mandelbrot'
import './src/styles.scss'

const state = {
    tx: 0.5,
    ty: 0.5,
    z: 1.0,

    domain: {
        left: -1,
        right: 1,
        top: -1,
        bottom: 1
    },

    // cx: 284.0085287846482,
    // cy: 129.63752665245204,
    // time: 1541499294.347,
    // x: -0.15404922457300346,
    // y: -0.7887975283829556,
    // z: 0.00004174557917929365,

    time: Date.now()
}

const zoomToFrac = (domain, x, y, scale) => {

    const domainX = (domain.right - domain.left) * x + domain.left
    const domainY = (domain.bottom - domain.top) * y + domain.top

    const left = (domain.left - domainX) * scale + domainX
    const right = (domain.right - domainX) * scale + domainX
    const top = (domain.top - domainY) * scale + domainY
    const bottom = (domain.bottom - domainY) * scale + domainY

    return {
        left,
        right,
        top,
        bottom
    }
}

var RES = 200.0


const renderFrame = () => {

    const element = document.getElementById('mandelbrot');
    const context = element.getContext('2d')
    const width = context.canvas.width
    const height = context.canvas.height
    const imageData = context.getImageData(0, 0, width, height)

    mandelbrot(imageData.data, width, height, state.time, state.domain)

    context.putImageData(imageData, 0, 0)

    state.time = Date.now() / 1000.0

    window.requestAnimationFrame(renderFrame)
}

document.addEventListener('DOMContentLoaded', () => {

    const element = document.getElementById('mandelbrot');
    window.addEventListener('resize', () => {

        const ratio = document.body.clientWidth / document.body.clientHeight
        element.width = RES
        element.height = RES / ratio

    })


    const ratio = document.body.clientWidth / document.body.clientHeight
    element.width = RES * ratio
    element.height = RES

    element.addEventListener('mousemove', event => {

        if (event.buttons > 0) {


            const domain = state.domain
            const dw = (domain.right - domain.left)
            const dh = (domain.bottom - domain.top)

            const dx = -dw * event.movementX / document.body.clientWidth
            const dy = -dh * event.movementY / document.body.clientHeight

            state.domain.left += dx
            state.domain.right += dx
            state.domain.top += dy
            state.domain.bottom += dy
        }
    })

    element.addEventListener('mousewheel', event => {

        const x = event.clientX / document.body.clientWidth
        const y = event.clientY / document.body.clientHeight

        const scale = (event.wheelDeltaY > 0) ? 0.7 : 1.5
        state.domain = zoomToFrac(state.domain, x, y, scale)

    })

    element.addEventListener('contextmenu', event => event.preventDefault())

    window.requestAnimationFrame(renderFrame)
})