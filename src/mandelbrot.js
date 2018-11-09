const colorTexel = (buffer, offset, phase) => {

    const r = parseInt((Math.cos(phase) + 1) * .5 * 255)
    const g = parseInt((Math.sin(phase + Math.PI) + 1) * .5 * 255)
    const b = parseInt((Math.sin(phase) + 1) * .5 * 255)

    buffer[offset + 0] = r
    buffer[offset + 1] = g
    buffer[offset + 2] = b
    buffer[offset + 3] = 255
}

const ITERATIONS = 150

export default (buffer, width, height, phase, domain) => {

    const domainWidth = domain.right - domain.left
    const domainHeight = domain.bottom - domain.top

    // avoids "domainHeight * (j / height)" per iteration
    const factorX = domainWidth / width
    const factorY = domainHeight / height

    for (var k = 0; k < width; k++) {
        for (var j = 0; j < height; j++) {

            const x = (k * factorX) + domain.left
            const y = (j * factorY) + domain.top
            var z = 0

            var COMPx = 0
            var COMPy = 0

            for (var i = 0; i < 1; i += (1 / ITERATIONS)) {

                const COMPx_new = COMPx * COMPx - COMPy * COMPy + x
                const COMPy_new = 2.0 * COMPx * COMPy + y
                const zN = (COMPx_new + COMPy_new)

                if (Math.abs(zN - z) > 5) {
                    const off = (j * width + k) * 4;
                    colorTexel(buffer, off, i * 10 + phase)
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

