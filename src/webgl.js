let buffer = null
let program = null

const init = (gl) => {

    buffer = initBuffer(gl)

    program = initShader(gl)
}

const initBuffer = (gl) => {

    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        -1.0, 1.0,
        1.0, 1.0,
        -1, -1.0,
        1.0, -1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW);

    return positionBuffer
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

const initShader = (gl) => {

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, `
    precision highp float;

    attribute vec2 aVertexPosition;

    varying vec2 vUV; 


    void main() {

        vUV = (aVertexPosition + vec2(1.0,1.0)) * 0.5;
        gl_Position =  vec4(aVertexPosition.xy, 0.0, 1.0);
    }
`);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, `
    precision highp float;
    
    varying vec2 vUV;  

    vec4 getColor(float phase) {
        
        return vec4(
            (cos(phase) + 1.0) * 0.5,
            (sin(phase + 3.1415) + 1.0) * 0.5,
            (sin(phase) + 1.0) * 0.5,
            1.0
        );
    }

    void main() {

        vec4 color = vec4(0.0,0.0,0.0,1.0); 

        float COMPx = 0.0;
        float COMPy = 0.0;
        float z = 0.0;

        float x = vUV.x;
        float y = vUV.y;

        for(float i = 0.0; i < 1.0; i += (1.0 / 100.0)) {
            
            float COMPx_new = COMPx * COMPx - COMPy * COMPy + x;
            float COMPy_new = 2.0 * COMPx * COMPy + y;
            float zN = (COMPx_new + COMPy_new);

            if (abs(zN - z) > 5.0) {
                color = getColor(i * 10.0 + 0.0);
            }

            COMPx = COMPx_new;
            COMPy = COMPy_new;
            z = zN;
        }

        gl_FragColor = color;
    }
`);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        return null;
    }

    return {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        }
    };
}

const render = (gl) => {

    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(
            program.attribLocations.vertexPosition,
            2,
            gl.FLOAT,
            false,
            0,
            0);
        gl.enableVertexAttribArray(
            program.attribLocations.vertexPosition);
    }

    gl.useProgram(program.program);

    // gl.uniform2fv(
    //     program.uniformLocations.modelViewMatrix,
    //     [1, 0]);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export default {
    initBuffer,
    initShader,
    init,
    render
}
