import { hello } from './mandelbrot'
import './src/styles.scss'

const state = {
    cx: 0.5,
    cy: 0.5,
    tx: 0.5,
    ty: 0.5,
    z: 1.0,

    // cx: 284.0085287846482,
    // cy: 129.63752665245204,
    // time: 1541499294.347,
    // x: -0.15404922457300346,
    // y: -0.7887975283829556,
    // z: 0.00004174557917929365,

    time: Date.now()
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

var RES = 250.0
const ITERATIONS = 10

const renderMandlebrot = (context) => {

    const tx = state.tx * context.canvas.width
    const ty = state.ty * context.canvas.height

    const cx = state.cx * context.canvas.width
    const cy = state.cy * context.canvas.height

    var zoom = state.z;
    console.log(tx, ty, zoom)

    for (var ix = 0; ix < context.canvas.width; ix++) {

        for (var iy = 0; iy < context.canvas.height; iy++) {

            let sx = ((ix - cx) * zoom) + cx - (tx)
            let sy = ((iy - cy) * zoom) + cy - (ty)

            let x = ((sx))
            let y = ((sy))

            var COMPx = 0
            var COMPy = 0

            var z = 0
            var isSet = false
            var i = 0

            for (i = 0; i < 1; i += (1 / ITERATIONS)) {

                var COMPx_new = COMPx * COMPx - COMPy * COMPy + y
                var COMPy_new = 2.0 * COMPx * COMPy + x

                var zN = (COMPx_new + COMPy_new)

                if (Math.abs(zN - z) > 15) {
                    isSet = true
                    break
                }

                COMPx = COMPx_new
                COMPy = COMPy_new
                z = zN
            }

            context.fillStyle = isSet ? color(i) : 'rgba(0,0,0,1)'



            if (ix > cx - 2 && ix < cx + 2) {
                context.fillStyle = 'rgba(255,0,0,1)'
            }
            if (iy > cy - 2 && iy < cy + 2) {
                context.fillStyle = 'rgba(255,0,0,1)'
            }

            context.fillRect(ix, iy, 1, 1);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // document.addEventListener('resize', () => {

    // })

    const element = document.getElementById('mandelbrot');
    const ratio = document.body.clientWidth / document.body.clientHeight

    element.width = RES
    element.height = RES

    element.addEventListener('mousemove', event => {

        if (event.buttons > 0) {

            state.tx = event.clientX / event.currentTarget.width
            state.ty = event.clientY / event.currentTarget.height
        }
        state.cx = event.clientX / event.currentTarget.width
        state.cy = event.clientY / event.currentTarget.height
    })

    element.addEventListener('mousewheel', event => {


        if (event.wheelDeltaY < 0) {
            state.z *= (1.0 / 0.7)
        }
        else {

            state.z *= 0.7
        }
    })

    element.addEventListener('contextmenu', event => event.preventDefault())

    const renderFrame = () => {

        renderMandlebrot(element.getContext('2d'))

        state.time = Date.now() / 1000.0

        window.requestAnimationFrame(renderFrame)
    }

    window.requestAnimationFrame(renderFrame)
})