import App from './src/app'
import './src/styles.scss'

document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.querySelector('canvas');

    App.onWindowResize(canvas)

    window.addEventListener('resize', () => {
        App.onWindowResize(canvas)
    })

    canvas.addEventListener('mousemove', event => {
        App.onCanvasMouseMove(canvas, event)
    })

    canvas.addEventListener('mousewheel', event => {
        App.onCanvasMouseWheel(canvas, event)
    })

    canvas.addEventListener('dblclick', event => {

        const x = event.clientX / document.body.clientWidth
        const y = event.clientY / document.body.clientHeight

        App.onCanvasFlyTo(x, y, 0.17)
    })

    canvas.addEventListener('contextmenu', event => event.preventDefault())

    document.getElementById('reset').addEventListener('click', App.onReset)
    document.getElementById('reset').addEventListener('click', App.onReset)
    document.getElementById('mode').addEventListener('click', App.onToggleMode)

    const onRequestAnimationFrame = () => {

        setTimeout(() => {
            App.onRenderFrame(canvas)
            requestAnimationFrame(onRequestAnimationFrame)
        }, 10)
    }

    onRequestAnimationFrame()
})