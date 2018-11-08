const getTexel = (buffer, offset, phase) => {

    const r = parseInt((Math.cos(phase) + 1) * .5 * 255)
    const g = parseInt((Math.sin(phase + Math.PI) + 1) * .5 * 255)
    const b = parseInt((Math.sin(phase) + 1) * .5 * 255)

    buffer[offset + 0] = r
    buffer[offset + 1] = g
    buffer[offset + 2] = b
    buffer[offset + 3] = 255
}

const ITERATIONS = 250

export default (buffer, width, height, phase, domain) => {

    const domainWidth = domain.right - domain.left
    const domainHeight = domain.bottom - domain.top

    // avoids "domainHeight * (j / height)" per iteration
    const factorX = domainWidth / width
    const factorY = domainHeight / height

    for (var k = 0; k < width; k++) {
        for (var j = 0; j < height; j++) {

            const ix = (k * factorX) + domain.left
            const iy = (j * factorY) + domain.top

            var COMPx = 0
            var COMPy = 0

            var z = 0
            var isSet = false
            var i = 0

            for (i = 0; i < 1; i += (1 / ITERATIONS)) {

                var COMPx_new = COMPx * COMPx - COMPy * COMPy + ix
                var COMPy_new = 2.0 * COMPx * COMPy + iy

                var zN = (COMPx_new + COMPy_new)

                if (Math.abs(zN - z) > 5) {
                    var off = (j * width + k) * 4;
                    getTexel(buffer, off, i * 10 + phase)
                    break
                }

                COMPx = COMPx_new
                COMPy = COMPy_new
                z = zN
            }

            var off = (j * width + k) * 4;

            getTexel(buffer, off, i * 10 + phase, isSet)
        }
    }

    return buffer
}

