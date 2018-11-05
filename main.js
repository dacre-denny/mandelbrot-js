import { hello } from './mandelbrot'
import './src/styles.scss'

const state = {
    x: 0,
    y: 0,
    z: 0,
    time: Date.now()
}

const color = idx => {

    const frac = 2.0 * Math.PI * (idx / 255.0)

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
const INNER_IT = 255

const renderMandlebrot = (context) => {

    for (var ix = 0; ix < RES; ix++) {

        for (var iy = 0; iy < RES; iy++) {

            var zoom = 1 + state.z;
            var cx = ((iy / RES) - 0.5 + state.y);// * zoom;
            var cy = ((ix / RES) - 0.5 + state.x);// * zoom;

            var COMPx = 0
            var COMPy = 0

            var z = 0
            var isSet = false
            var i = 0

            for (i = 0; i < INNER_IT; i += (INNER_IT / ITERATIONS)) {

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
            context.fillRect(ix, iy, 1, 1);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const element = document.getElementById('mandelbrot');

    element.width = RES
    element.height = RES

    element.addEventListener('mousemove', event => {

        const fx = (event.clientX / document.body.clientWidth)
        const fy = (event.clientY / document.body.clientHeight)

        state.x = -fx;
        state.y = -fy;

        console.log(state)
    })

    element.addEventListener('mousewheel', event => {

        state.z += (event.wheelDelta / 1000)
        console.log(event)
    })

    const renderFrame = () => {

        renderMandlebrot(element.getContext('2d'))

        state.time = Date.now() / 1000.0

        window.requestAnimationFrame(renderFrame)
    }

    window.requestAnimationFrame(renderFrame)
})