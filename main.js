import Canvas from './src/canvas'
import './src/styles.scss'

document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.querySelector('canvas');

    Canvas.onWindowResize(canvas)

    window.addEventListener('resize', () => {
        Canvas.onWindowResize(canvas)
    })

    canvas.addEventListener('mousemove', event => {
        Canvas.onCanvasMouseMove(canvas, event)
    })

    canvas.addEventListener('mousewheel', event => {
        Canvas.onCanvasMouseWheel(canvas, event)
    })

    canvas.addEventListener('contextmenu', event => event.preventDefault())

    const onRequestAnimationFrame = () => {

        Canvas.onRenderFrame(canvas)

        window.requestAnimationFrame(onRequestAnimationFrame)
    }

    onRequestAnimationFrame()
})