"#version 300 es\n\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
   precision highp float;\n\
#else\n\
   precision mediump float;\n\
#endif\n\
uniform float zoom;\n\
uniform vec2 center;\n\
uniform vec2 window;\n\
uniform vec2 axis_scaler;\n\
uniform int max_iterations;\n\
\n\
in vec2 position;\n\
out vec4 FragColor;\n\
\n\
int custom_mod(int c, int m){\n\
    return c-(c/m*m);\n\
}\n\
\n\
void main()\n\
{\n\
    float x0 = center.x+(position.x*window.x)*zoom*axis_scaler.x;\n\
    float y0 = center.y+(position.y*window.y)*zoom*axis_scaler.y;\n\
    float x = 0.0;\n\
    float y = 0.0;\n\
    float x2 = 0.0;\n\
    float y2 = 0.0;\n\
    int i = 0;\n\
\n\
    while (x2 + y2 <= 4.0 && i < max_iterations){\n\
        y = 2.0 * x * y + y0;\n\
        x = x2 - y2 + x0;\n\
        x2 = x * x;\n\
        y2 = y * y;\n\
        i++;\n\
    }\n\
\n\
    //if(int(position.x*window.x) == 0 || int(position.y*window.y) == 0){\n\
    //    FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\
    //}else{\n\
        FragColor = vec4(float(custom_mod(i, 4)) * 64.0/255.0, float(custom_mod(i, 8)) * 32.0/255.0, float(custom_mod(i, 16)) * 16.0/255.0, 1.0);\n\
    //}\n\
}\0"