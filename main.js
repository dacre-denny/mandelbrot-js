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
var x_pos = 0
var y_pos = 0
const ITERATIONS = 255

var gFrame = {
    l: -2,
    t: -2,
    w: 4,
    h: 4
}

const renderFrame = (context, frame) => {

    // for(var ix = 0; ix < RES; ix++) { 

    //     for(var iy = 0; iy < RES; iy++) {

    //         var cx = ((iy / RES) - 0.5) * 4;
    //         var cy = ((ix / RES) - 0.5) * 4;
    for (var ix = 0; ix < RES; ix++) {

        for (var iy = 0; iy < RES; iy++) {

            var cx = ((iy / RES) * frame.h) + frame.t;
            var cy = ((ix / RES) * frame.w) + frame.l;

            // cx = ((iy / RES) - 0.5) * 4;
            // cy = ((ix / RES) - 0.5) * 4;
            //console.log(cx)
            // cx *= scale;
            // cy *= scale;
            // cy -= tx;


            var COMPx = 0
            var COMPy = 0

            var z = 0
            var isSet = false
            var i = 0

            for (i = 0; i < 255; i += (255 / ITERATIONS)) {

                var COMPx_new = COMPx * COMPx - COMPy * COMPy + cy
                var COMPy_new = 2.0 * COMPx * COMPy + cx

                var zN = (COMPx_new + COMPy_new)

                if (zN > 2) {
                    isSet = true
                    break
                }

                COMPx = COMPx_new
                COMPy = COMPy_new
                z = zN
            }


            var r = 0
            var g = 0
            var b = isSet ? Math.min(i, 255) : 0

            //ctx.fillStyle = 'rgba(' + r + ',' + b + ',' + g + ',1)' //isSet ? color(i) : 'rgba(0,0,0,0)'
            context.fillStyle = isSet ? color(i) : 'rgba(0,0,0,1)'
            context.fillRect(ix, iy, 1, 1);

        }

    }
    console.log('done')
}

var x = 0

const element = document.getElementById('mandelbrot');

element.onclick = event => {

    const fx = event.clientX / RES //event.target.width
    const fy = event.clientY / RES //event.target.height

    gFrame.l = -fx
    gFrame.t = -fy
    gFrame.w = gFrame.w * 0.85
    gFrame.h = gFrame.h * 0.85

    console.log(fx, fy)
}

const step = ts => {

    var ctx = element.getContext('2d');
    renderFrame(ctx, gFrame)

    SCALE = SCALE * 0.9

    t += 0.01

    setTimeout(() => {
        window.requestAnimationFrame(step)

    }, 5)
}

window.requestAnimationFrame(step)

console.log(color(255 * 0 * .25))
console.log(Math.sin(0))