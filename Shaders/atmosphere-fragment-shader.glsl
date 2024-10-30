uniform vec3 lightDirection;

varying vec3 pixelPosition;
varying vec3 vNormal;

void main() {
    vec3 atmosphereColor = vec3(0., 0.2, 1.); // Blue

    float dotProduct = -dot(vNormal, lightDirection);
    float maxDotProduct = max(dotProduct, 0.0);

    vec3 viewDirection = normalize(cameraPosition - pixelPosition);
    float edgeDotProduct = 1. - dot(vNormal, viewDirection);

    float fuzziness = smoothstep(0., 0.2, 1. - abs(edgeDotProduct));

    gl_FragColor = vec4(atmosphereColor, maxDotProduct * edgeDotProduct * fuzziness);
}
