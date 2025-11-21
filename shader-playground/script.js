// Shader Playground
// Live GLSL shader editor with WebGL

const shaderCode = document.getElementById('shaderCode');
const compileBtn = document.getElementById('compileBtn');
const presetSelect = document.getElementById('presetSelect');
const glCanvas = document.getElementById('glCanvas');
const errorDisplay = document.getElementById('errorDisplay');
const timeValue = document.getElementById('timeValue');
const resValue = document.getElementById('resValue');
const speedControl = document.getElementById('speedControl');
const mouseXControl = document.getElementById('mouseXControl');
const mouseYControl = document.getElementById('mouseYControl');

let gl, program, startTime, animationFrame;
let timeSpeed = 1.0;
let mousePos = { x: 0.5, y: 0.5 };

// Shader presets
const presets = {
    gradient: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec3 color = vec3(
    0.5 + 0.5 * sin(u_time + uv.x * 3.0),
    0.5 + 0.5 * sin(u_time + uv.y * 3.0 + 2.0),
    0.5 + 0.5 * sin(u_time + (uv.x + uv.y) * 3.0 + 4.0)
  );
  gl_FragColor = vec4(color, 1.0);
}`,

    plasma: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution * 2.0 - 1.0;
  float v = 0.0;
  v += sin((uv.x + u_time));
  v += sin((uv.y + u_time) / 2.0);
  v += sin((uv.x + uv.y + u_time) / 2.0);
  vec2 c = uv + vec2(sin(u_time / 3.0), cos(u_time / 2.0));
  v += sin(sqrt(c.x * c.x + c.y * c.y + 1.0) + u_time);
  v = v / 2.0;
  vec3 col = vec3(1.0, sin(3.14159 * v), cos(3.14159 * v));
  gl_FragColor = vec4(col * 0.5 + 0.5, 1.0);
}`,

    waves: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float wave = sin(uv.x * 10.0 + u_time) * 0.5 + 0.5;
  wave *= sin(uv.y * 10.0 + u_time * 0.5) * 0.5 + 0.5;
  vec3 color = mix(
    vec3(0.2, 0.4, 0.8),
    vec3(0.8, 0.2, 0.6),
    wave
  );
  gl_FragColor = vec4(color, 1.0);
}`,

    mandelbrot: `precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
  vec2 c = (gl_FragCoord.xy / u_resolution - 0.5) * 4.0;
  c = c * (1.0 + u_mouse.x) - vec2(0.5, 0.0);
  vec2 z = vec2(0.0);
  float iter = 0.0;
  for(int i = 0; i < 100; i++) {
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    if(length(z) > 2.0) break;
    iter++;
  }
  float color = iter / 100.0;
  gl_FragColor = vec4(vec3(color), 1.0);
}`,

    noise: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float n = noise(uv * 10.0 + u_time);
  gl_FragColor = vec4(vec3(n), 1.0);
}`
};

// Initialize WebGL
function initGL() {
    gl = glCanvas.getContext('webgl');
    if (!gl) {
        errorDisplay.textContent = 'WebGL not supported';
        errorDisplay.classList.add('show');
        return false;
    }

    resizeCanvas();
    return true;
}

// Resize canvas
function resizeCanvas() {
    const rect = glCanvas.getBoundingClientRect();
    glCanvas.width = rect.width;
    glCanvas.height = rect.height;
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    resValue.textContent = `${glCanvas.width}x${glCanvas.height}`;
}

// Compile shader
function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(error);
    }

    return shader;
}

// Create program
function createProgram(fragmentSource) {
    const vertexSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

    try {
        const vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
        const fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

        const newProgram = gl.createProgram();
        gl.attachShader(newProgram, vertexShader);
        gl.attachShader(newProgram, fragmentShader);
        gl.linkProgram(newProgram);

        if (!gl.getProgramParameter(newProgram, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(newProgram));
        }

        errorDisplay.classList.remove('show');
        return newProgram;
    } catch (error) {
        errorDisplay.textContent = error.message;
        errorDisplay.classList.add('show');
        return null;
    }
}

// Setup geometry
function setupGeometry(prog) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        1, 1
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
}

// Render loop
function render() {
    if (!program) return;

    gl.useProgram(program);

    const time = ((Date.now() - startTime) / 1000) * timeSpeed;
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');

    if (timeLocation) gl.uniform1f(timeLocation, time);
    if (resolutionLocation) gl.uniform2f(resolutionLocation, glCanvas.width, glCanvas.height);
    if (mouseLocation) gl.uniform2f(mouseLocation, mousePos.x, mousePos.y);

    timeValue.textContent = time.toFixed(2);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    animationFrame = requestAnimationFrame(render);
}

// Compile and run
function compileAndRun() {
    const source = shaderCode.value;
    const newProgram = createProgram(source);

    if (newProgram) {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        program = newProgram;
        setupGeometry(program);
        startTime = Date.now();
        render();
    }
}

// Load preset
presetSelect.addEventListener('change', (e) => {
    const preset = e.target.value;
    if (preset && presets[preset]) {
        shaderCode.value = presets[preset];
        compileAndRun();
    }
    e.target.value = '';
});

// Controls
compileBtn.addEventListener('click', compileAndRun);
speedControl.addEventListener('input', (e) => {
    timeSpeed = parseFloat(e.target.value);
});
mouseXControl.addEventListener('input', (e) => {
    mousePos.x = parseFloat(e.target.value);
});
mouseYControl.addEventListener('input', (e) => {
    mousePos.y = parseFloat(e.target.value);
});

// Mouse tracking
glCanvas.addEventListener('mousemove', (e) => {
    const rect = glCanvas.getBoundingClientRect();
    mousePos.x = e.clientX / rect.width;
    mousePos.y = 1.0 - (e.clientY / rect.height);
    mouseXControl.value = mousePos.x;
    mouseYControl.value = mousePos.y;
});

// Initialize
if (initGL()) {
    shaderCode.value = presets.gradient;
    compileAndRun();
}

window.addEventListener('resize', resizeCanvas);
