import { hello } from './mandelbrot'

var t = 0

const color = idx => {

    const frac = 2.0 * Math.PI * (idx / 255.0)

    return `rgba(${
        parseInt((Math.cos(frac + t) + 1) * .5 * 255)
        },${
        parseInt((Math.sin(frac + t + Math.PI) + 1) * .5 * 255)
        },${
        parseInt((Math.sin(frac + t) + 1) * .5 * 255)
        }, 1)`
}

var RES = 500.0
var SCALE = 1
const ITERATIONS = 100

const renderFrame = (context) => {

    for (var ix = 0; ix < RES; ix++) {

        for (var iy = 0; iy < RES; iy++) {

            var zoom = 1 + state.z;
            var cx = ((iy / RES) * zoom) - (0.5 * zoom + state.y);
            var cy = ((ix / RES) * zoom) - (0.5 * zoom + state.x);

            var COMPx = 0
            var COMPy = 0

            var z = 0
            var isSet = false
            var i = 0

            for (i = 0; i < 255; i += (255 / ITERATIONS)) {

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

            context.fillStyle = isSet ? `rgba(255,255,255,1)` : 'rgba(0,0,0,1)' //color(i)
            context.fillRect(ix, iy, 1, 1);

        }

    }
}

const element = document.getElementById('mandelbrot');

element.addEventListener('mousemove', event => {

    const fx = event.clientX / RES //event.target.width
    const fy = event.clientY / RES //event.target.height

    state.x = fx
    state.y = fy
})

const state = {
    x: 0,
    y: 0,
    z: 0
}

element.addEventListener('mousewheel', event => {

    state.z += (event.wheelDelta / 1000)
    console.log(event)
})

const step = ts => {

    var ctx = element.getContext('2d');
    renderFrame(ctx)

    SCALE = SCALE * 0.9

    t += 0.1

    setTimeout(() => {
        window.requestAnimationFrame(step)

    }, 5)
}

window.requestAnimationFrame(step)