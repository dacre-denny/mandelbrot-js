import { hello } from './mandelbrot'

var ctx = document.getElementById('mandelbrot').getContext('2d');


const color = idx => {
    //return 'rgba(1,1,0,1)'
    
    const frac = 2.0 * Math.PI * (idx / 255.0)
//console.log((Math.sin(frac) + 1) * 255)
    return `rgba(${
       parseInt((Math.cos(frac) + 1) * .5 * 255)
    },${
       parseInt((Math.sin(frac + Math.PI) + 1) * .5 * 255)
    },${
        parseInt((Math.sin(frac) + 1) * .5 * 255)
    }, 1)`
    
    //"rgba("+r+","+g+","+b+",1.0)"
}

var RES = 650.0

for(var x = 0; x < RES; x++) { //-2; x < 2; x += 0.1) {

    for(var y = 0; y < RES; y++) { //-1; y < 1; y += 0.1) {

        var cx = ((y / RES) - 0.5) * 4;
        var cy = ((x / RES) - 0.5) * 4;

        var COMPx = 0
        var COMPy = 0

        var z = 0
        var isSet = false
        var i = 0

        for(i = 0; i < 255; i+=3) {

            var COMPx_new = COMPx*COMPx - COMPy * COMPy + cy
            var COMPy_new = 2.0 * COMPx * COMPy + cx


            var zN = (COMPx_new + COMPy_new)

            if(zN > 2) {
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
        ctx.fillStyle = isSet ? color(i) : 'rgba(0,0,0,1)'
        ctx.fillRect(x, y, 1, 1 );

}

console.log('done')
}
/*
for(var i = 0; i < 255; i++) {

ctx.fillStyle = color(i); // sets the color to fill in the rectangle with
ctx.fillRect(i, 10, 1, 500);   // draws the rectangle at position 10, 10 with a width of 55 and a height of 50
}
*/

console.log(color(255 * 0 * .25))
console.log(Math.sin(0))