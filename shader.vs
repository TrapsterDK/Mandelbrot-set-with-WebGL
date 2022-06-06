"#version 300 es\n\
layout (location = 0) in vec2 pos;\
out vec2 position;\
void main()\
{\
    gl_Position = vec4(pos.xy, 0.0, 1.0);\
    position = vec2(pos.xy);\
}\0"