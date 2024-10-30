
varying vec2 vUv;
varying vec3 pixelPosition;
varying vec3 vNormal;
varying vec3 VertexPosition;


void main() {
    vNormal = mat3(modelMatrix) * normal; // This is fine as long as you are doing uniform scaling.
    pixelPosition = mat3(modelMatrix) * position;
    vUv = uv;
    vec4 FinalVertexPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    VertexPosition = vec3(FinalVertexPosition);
    gl_Position = FinalVertexPosition;
}
