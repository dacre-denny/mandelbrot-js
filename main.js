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

const color = idx => {

    const frac = 2.0 * Math.PI * (idx)

    return `rgba(${
        parseInt((Math.cos(frac + state.time) + 1) * .5 * 255)
        },${
        parseInt((Math.sin(frac + state.time + Math.PI) + 1) * .5 * 255)
        },${
        parseInt((Math.sin(frac + state.time) + 1) * .5 * 255)
        }, 1)`
}

const getTexel = (buffer, offset, phase, color) => {

    const r = color ? parseInt((Math.cos(phase) + 1) * .5 * 255) : 0
    const g = color ? parseInt((Math.sin(phase + Math.PI) + 1) * .5 * 255) : 0
    const b = color ? parseInt((Math.sin(phase) + 1) * .5 * 255) : 0

    buffer[offset + 0] = r
    buffer[offset + 1] = g
    buffer[offset + 2] = b
    buffer[offset + 3] = 255
}



var RES = 200.0
const ITERATIONS = 50

const renderMandlebrot = (context) => {

    const range_w = context.canvas.width
    const range_h = context.canvas.height

    context.clearRect(0, 0, range_w, range_h);
    const id = context.getImageData(0, 0, range_w, range_h)
    const buffer = id.data

    mandelbrot(buffer, range_w, range_h, state.time, state.domain)

    context.putImageData(id, 0, 0)
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

    const renderFrame = () => {

        renderMandlebrot(element.getContext('2d'))

        state.time = Date.now() / 1000.0

        window.requestAnimationFrame(renderFrame)
    }

    window.requestAnimationFrame(renderFrame)
})