let quadBuffer = null;
let mandelbrotProgram = null;

export const createContext = (canvas, iterations) => {
  var gl = canvas.getContext("webgl");

  quadBuffer = createQuadBuffer(gl);

  mandelbrotProgram = createMandelbrotProgram(gl, iterations);

  return gl;
};

const createQuadBuffer = (gl) => {
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0]),
    gl.STATIC_DRAW
  );

  return positionBuffer;
};

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);

  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

const createMandelbrotProgram = (gl, iterations) => {
  const vertexSrc = `
precision highp float;

attribute vec2 vertexPosition;

varying vec2 vUV; 

void main() {

    float x = vertexPosition.x;
    float y = vertexPosition.y;

    vUV = vec2(x, -y) * 0.5 + vec2(0.5, 0.5);
    gl_Position =  vec4(vertexPosition.xy, 0.0, 1.0);
}
`;
  const fragmentSrc = `
precision highp float;

uniform vec4 view;
uniform vec2 screen;
uniform float phase;
varying vec2 vUV;  

#define ITERATIONS ${iterations.toFixed(2)}

vec4 getColor(float t) {
    
    return vec4(
        (cos(t) + 1.0) * 0.5,
        (sin(t + 3.1415) + 1.0) * 0.5,
        (sin(t) + 1.0) * 0.5,
        1.0
    );
}

void main() {

    vec4 color = vec4(0.0,0.0,0.0,1.0); 

    float COMPx = 0.0;
    float COMPy = 0.0;
    float z = 0.0;

    float zoom = view.z;
    float width = zoom * view.w;
    float height = zoom;
    
    float left = view.x - width * 0.5;
    float top = view.y - height * 0.5;  

    float factorX = width / 1.0;
    float factorY = height / 1.0;

   for(float i = 0.0; i < 1.0; i += (1.0 / ITERATIONS)) {

        float x = (vUV.x * factorX) + left;
        float y = (vUV.y * factorY) + top;
        
        float COMPx_new = COMPx * COMPx - COMPy * COMPy + x;
        float COMPy_new = 2.0 * COMPx * COMPy + y;
        float zN = (COMPx_new + COMPy_new);

        if (abs(zN - z) > 5.0) {
            color = getColor(i * 10.0 + phase);
            break;
        }

        COMPx = COMPx_new;
        COMPy = COMPy_new;
        z = zN;
    }

    gl_FragColor = color;
}
`;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

  const shaderProgram = gl.createProgram();

  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    return;
  }

  return {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "vertexPosition")
    },
    uniformLocations: {
      view: gl.getUniformLocation(shaderProgram, "view"),
      screen: gl.getUniformLocation(shaderProgram, "screen"),
      phase: gl.getUniformLocation(shaderProgram, "phase")
    }
  };
};

const bindMandelbrotProgram = (gl, state, aspectRatio) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.vertexAttribPointer(
    mandelbrotProgram.attribLocations.vertexPosition,
    2,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.enableVertexAttribArray(mandelbrotProgram.attribLocations.vertexPosition);

  gl.useProgram(mandelbrotProgram.program);

  gl.uniform4fv(mandelbrotProgram.uniformLocations.view, [
    state.view.x,
    state.view.y,
    state.view.zoom,
    aspectRatio
  ]);

  gl.uniform2fv(mandelbrotProgram.uniformLocations.screen, [
    gl.canvas.width,
    gl.canvas.height
  ]);

  gl.uniform1f(mandelbrotProgram.uniformLocations.phase, state.time);
};

export const renderFrame = (gl, state, aspectRatio) => {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(1.0, 1.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  bindMandelbrotProgram(gl, state, aspectRatio);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
