import { hello } from './mandelbrot'
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

const lerp = (a, b, t) => {

    return (b - a) * t + a
}

const zoomToFrac = (domain, x, y, scale) => {

    const w = domain.right - domain.left
    const h = domain.bottom - domain.top

    const ow = (w * x) * 0.5
    const oh = (h * y) * 0.5

    const tx = lerp(domain.left, domain.right, x)
    const ty = lerp(domain.top, domain.bottom, y)


    const left = lerp(domain.left, tx, scale)
    const right = lerp(domain.right, tx, scale)
    const top = lerp(domain.top, ty, scale)
    const bottom = lerp(domain.bottom, ty, scale)

    console.log('from', domain.left, 'to', left)

    return {
        left,
        right,
        top,
        bottom
    }
    //return domain
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

    /// 
    const l = state.domain.left
    const r = state.domain.right

    const t = state.domain.top
    const b = state.domain.bottom

    // console.log(`
    // left: ${l}
    // rght: ${r}
    // top: ${t}
    // bot: ${b}
    // `)

    var zoom = state.z;
    for (var k = 0; k < context.canvas.width; k++) {
        //for (var ix = sx; ix < ex; ix++) {


        for (var j = 0; j < context.canvas.height; j++) {
            //for (var iy = sy; iy < ey; iy++) {


            var ix = (r - l) * (k / context.canvas.width) + l
            var iy = (b - t) * (j / context.canvas.height) + t

            let x = ix
            let y = iy

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


            context.fillRect(k, j, 1, 1);
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

        state.debugx = event.clientX / event.currentTarget.width
        state.debugy = event.clientY / event.currentTarget.height
    })

    element.addEventListener('mousewheel', event => {

        const x = event.clientX / event.currentTarget.width
        const y = event.clientY / event.currentTarget.height

        if (event.wheelDeltaY > 0) {
            state.domain = zoomToFrac(state.domain, x, y, 0.25)
        }
        else {
            state.domain = zoomToFrac(state.domain, x, y, 1.25)

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