import { hello } from './mandelbrot'
import './src/styles.scss'

const state = {
    x: 0,
    y: 0,
    z: 0.01,
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

var RES = 100.0
const ITERATIONS = 100

const renderMandlebrot = (context) => {

    const hw = context.canvas.width / 2
    const hh = context.canvas.height / 2

    for (var ix = 0; ix < context.canvas.width; ix++) {

        for (var iy = 0; iy < context.canvas.height; iy++) {

            var zoom = state.z;

            const x = ((ix - hw)) * zoom
            const y = ((iy - hh)) * zoom

            var cx = (x)
            var cy = (y)

            var COMPx = 0
            var COMPy = 0

            var z = 0
            var isSet = false
            var i = 0

            for (i = 0; i < 1; i += (1 / ITERATIONS)) {

                var COMPx_new = COMPx * COMPx - COMPy * COMPy + cy
                var COMPy_new = 2.0 * COMPx * COMPy + cx

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



            if (x > -0.015 && x < 0.015) {
                context.fillStyle = 'rgba(255,0,0,1)'
            }
            if (y > -0.015 && y < 0.015) {
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

    element.width = RES * ratio
    element.height = RES

    element.addEventListener('mousemove', event => {

        if (event.buttons > 0) {

            const dx = (event.movementX / document.body.clientWidth)
            const dy = (event.movementY / document.body.clientHeight)

            state.x -= dx
            state.y -= dy
        }
    })

    element.addEventListener('mousewheel', event => {

        if (event.wheelDeltaY > 0) {

            state.z *= (1.0 / 0.9)
        }
        else {

            state.z *= 0.9
        }

        console.log(state.z)
    })

    const renderFrame = () => {

        renderMandlebrot(element.getContext('2d'))

        state.time = Date.now() / 1000.0

        window.requestAnimationFrame(renderFrame)
    }

    window.requestAnimationFrame(renderFrame)
})