const vertexShaderSource = `#version 300 es
in vec4 a_position;
out vec2 position;

void main()
{
    gl_Position = a_position;
    position = a_position.xy;
}`

const fragmentShaderSource = `#version 300 es
precision highp float;

uniform float zoom;
uniform vec2 center;
uniform int max_iterations;

in vec2 position;
out vec4 out_color;

int custom_mod(int c, int m){
    return c-(c/m*m);
}

void main()
{
    float x0 = center.x+position.x*zoom;
    float y0 = center.y+position.y*zoom;
    float x = 0.0;
    float y = 0.0;
    float x2 = 0.0;
    float y2 = 0.0;
    int i = 0;

    while (x2 + y2 <= 4.0 && i < max_iterations){
        y = (x + x) * y + y0;
        x = x2 - y2 + x0;
        x2 = x * x;
        y2 = y * y;
        i++;
    }

    out_color = vec4(float(custom_mod(i, 4)) * 64.0/255.0, float(custom_mod(i, 8)) * 32.0/255.0, float(custom_mod(i, 16)) * 16.0/255.0, 1.0);
}`

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
  
    console.log(gl.getShaderInfoLog(shader));  // eslint-disable-line
    gl.deleteShader(shader);
    return undefined;
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
    gl.deleteProgram(program);
    return undefined;
}

window.onload = function() {
    const canvas = document.querySelector("canvas");
    
    const gl = canvas.getContext("webgl2")
    if(gl === null) throw new Error('Could not create a webgl context');

    // create GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Link the two shaders into a program
    var program = createProgram(gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // Create a buffer and put three 2d clip space points in it
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var positions = [
        -1, 1, 1, 1, 1, -1, // Triangle 1
        -1, 1, 1, -1, -1, -1 // Triangle 2 
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Create a vertex array object (attribute state)
    var vao = gl.createVertexArray();

    // and make it the one we're currently working with
    gl.bindVertexArray(vao);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    //webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const zoom_handle = gl.getUniformLocation(program, "zoom")
    const center_handle = gl.getUniformLocation(program, "center")
    const window_handle = gl.getUniformLocation(program, "window")
    const max_iterations_handle = gl.getUniformLocation(program, "max_iterations")

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    gl.uniform1f(zoom_handle, 2)
    gl.uniform2f(center_handle, 0, 0)
    gl.uniform2f(window_handle, gl.canvas.width, gl.canvas.height)
    gl.uniform1i(max_iterations_handle, 1000)

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    // draw
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
}