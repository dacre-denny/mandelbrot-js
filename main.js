import { hello } from './mandelbrot'

var ctx = document.getElementById('mandelbrot').getContext('2d');

ctx.fillStyle = 'rgb(200,0,0)'; // sets the color to fill in the rectangle with
ctx.fillRect(10, 10, 500, 500);   // draws the rectangle at position 10, 10 with a width of 55 and a height of 50

for(var x = 0; x < 200; x++) { //-2; x < 2; x += 0.1) {

    for(var y = 0; y < 200; y++) { //-1; y < 1; y += 0.1) {

        var cx = ((x / 200.0) * 4) - 2;
        var cy = ((y / 200.0) * 2) - 1;

        var c = (cx * cx) + (cy * cy)

        var r = 0
        var g = 0
        var b = 255

        ctx.fillStyle = "rgba("+r+","+g+","+b+",1.0)";
        ctx.fillRect(x, y, 1, 1 );

}

console.log('done')
}