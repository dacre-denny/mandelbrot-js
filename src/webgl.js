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
    uniform vec2 uModelViewMatrix;

    varying vec4 vColor; 


    void main() {

        vColor = vec4(aVertexPosition.xy, 0.0, 1.0);
        gl_Position =  vec4(aVertexPosition.xy, 0.0, 1.0);
    }
`);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, `
    precision highp float;
    
    varying vec4 vColor; 

    void main() {
        gl_FragColor = vColor;
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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //gl.clearDepth(1.0);
    //gl.disable(gl.DEPTH_TEST);

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
