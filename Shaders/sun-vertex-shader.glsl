
void main() {
    gl_PointSize = 500000.;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
