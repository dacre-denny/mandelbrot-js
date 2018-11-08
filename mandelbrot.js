const getTexel = (buffer, offset, phase, color) => {

    const r = color ? parseInt((Math.cos(phase) + 1) * .5 * 255) : 0
    const g = color ? parseInt((Math.sin(phase + Math.PI) + 1) * .5 * 255) : 0
    const b = color ? parseInt((Math.sin(phase) + 1) * .5 * 255) : 0

    buffer[offset + 0] = r
    buffer[offset + 1] = g
    buffer[offset + 2] = b
    buffer[offset + 3] = 255
}

const ITERATIONS = 50

export default (buffer, width, height, phase, domain) => {

    const l = domain.left
    const r = domain.right

    const t = domain.top
    const b = domain.bottom

    for (var k = 0; k < width; k++) {
        for (var j = 0; j < height; j++) {
            var ix = (r - l) * (k / width) + l
            var iy = (b - t) * (j / height) + t

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

            var off = (j * width + k) * 4;

            getTexel(buffer, off, i * 10 + phase, isSet)
        }
    }

    return buffer
}

