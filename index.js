/*const fragment_shader_source = `#version 300 es
precision highp float;

uniform float zoom;
uniform vec2 center;
uniform vec2 window;
uniform vec2 axis_scaler;
uniform int max_iterations;

in vec2 position;
out vec4 FragColor;

int custom_mod(int c, int m){
    return c-(c/m*m);
}

void main()
{
    float x0 = center.x+(position.x*window.x)*zoom*axis_scaler.x;
    float y0 = center.y+(position.y*window.y)*zoom*axis_scaler.y;
    float x = 0.0;
    float y = 0.0;
    float x2 = 0.0;
    float y2 = 0.0;
    int i = 0;

    while (x2 + y2 <= 4.0 && i < max_iterations){
        y = 2.0 * x * y + y0;
        x = x2 - y2 + x0;
        x2 = x * x;
        y2 = y * y;
        i++;
    }

    FragColor = vec4(float(custom_mod(i, 4)) * 64.0/255.0, float(custom_mod(i, 8)) * 32.0/255.0, float(custom_mod(i, 16)) * 16.0/255.0, 1.0);
}`*/

const fragment_shader_source = `#version 300 es
precision highp float;
out vec4 FragColor;
void main()
{
    FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`

const vertex_shader_source = `#version 300 es
layout (location = 0) in vec2 pos;
out vec2 position;
void main()
{
    gl_Position = vec4(pos.xy, 0.0, 1.0);
    position = vec2(pos.xy);
}`


const vertices = new Float32Array([
//    x      y      z   
     1.0,  1.0, -0.0,
     1.0, -1.0, -0.0,
    -1.0, -1.0, -0.0,
    -1.0,  1.0, -0.0
]);

const indices = new Float32Array([
    0, 1, 2,   // first triangle
    0, 2, 3    // second triangle
]);

window.onload = function() {
    const canvas = document.querySelector("canvas");
    
    const gl = canvas.getContext("webgl2")
    if(gl === null) throw new Error('Could not create a webgl context');

    const program = gl.createProgram();

    // create a new vertex shader and a fragment shader
    const vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    const fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);

    // specify the source code for the shaders using those strings
    gl.shaderSource(vertex_shader, vertex_shader_source);
    gl.shaderSource(fragment_shader, fragment_shader_source);
    
    // compile the shaders
    gl.compileShader(vertex_shader);
    if (!gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS))
		throw new Error("Error while compiling vertex shader: " + gl.getShaderInfoLog(vertex_shader));

    gl.compileShader(fragment_shader);
    if (!gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS))
		throw new Error("Error while compiling fragment shader: " + gl.getShaderInfoLog(fragment_shader));
    
    // attach the two shaders to the program
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    
    gl.deleteShader(vertex_shader);
    gl.deleteShader(fragment_shader);

    gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
	}

    let VBO = gl.createBuffer()
    let EBO = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); 

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO)
    gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW); 

    //glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), 0);
    //glEnableVertexAttribArray(0);


    gl.useProgram(program);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0)
}