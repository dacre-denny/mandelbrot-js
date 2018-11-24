import * as Domain from './view'
import * as Helpers from './helpers'

const shadeTexel = (buffer, index, phase) => {

    buffer[index + 0] = (Helpers.cos(phase) + 1) * 125
    buffer[index + 1] = (Helpers.sin(phase + Math.PI) + 1) * 125
    buffer[index + 2] = (Helpers.sin(phase) + 1) * 125
    buffer[index + 3] = 255
}

export const generateMandelbrot = (buffer, width, height, state) => {

    const view = state.view
    const phase = state.time
    const iterations = state.iterations
    const divergence = state.divergence

    const domainWidth = Domain.zoomWidth(view)
    const domainHeight = Domain.zoomHeight(view)

    const domainLeft = view.x - domainWidth * 0.5
    const domainTop = view.y - domainHeight * 0.5

    const factorX = domainWidth / width
    const factorY = domainHeight / height

    for (var k = 0; k < width; k++) {
        for (var j = 0; j < height; j++) {

            const x = (k * factorX) + domainLeft
            const y = (j * factorY) + domainTop
            var z = 0

            var COMPx = 0
            var COMPy = 0

            for (var i = 0; i < 1; i += (1 / iterations)) {

                const COMPx_new = COMPx * COMPx - COMPy * COMPy + x
                const COMPy_new = 2.0 * COMPx * COMPy + y
                const zN = (COMPx_new + COMPy_new)

                if (Math.abs(zN - z) > divergence) {
                    const off = (j * width + k) * 4;
                    shadeTexel(buffer, off, i * 10 + phase)
                    break
                }

                COMPx = COMPx_new
                COMPy = COMPy_new
                z = zN
            }
        }
    }

    return buffer
}

export const createContext = (canvas) => {
    
    return canvas.getContext('2d')
}

export const renderFrame = (context, state) => {

    const width = context.canvas.width
    const height = context.canvas.height

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const imageData = context.getImageData(0, 0, width, height)

    generateMandelbrot(imageData.data, width, height, state)

    context.putImageData(imageData, 0, 0)
}