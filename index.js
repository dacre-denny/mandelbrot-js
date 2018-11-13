import App from './src/app'
import './src/styles.scss'

document.addEventListener('DOMContentLoaded', () => {

    App.onInit()

    document.getElementById('reset').addEventListener('click', App.onReset)
    document.getElementById('animate').addEventListener('click', App.onAnimateToggle)
    document.getElementById('mode').addEventListener('click', App.onToggleMode)
    document.getElementById('resolution').addEventListener('change', App.onChangeResoultion)
    document.getElementById('iterations').addEventListener('change', App.onChangeIterations)
    window.addEventListener('resize', App.onWindowResize)

    const onRequestAnimationFrame = () => {

        App.onRenderFrame()
        requestAnimationFrame(onRequestAnimationFrame)
    }

    onRequestAnimationFrame()
})