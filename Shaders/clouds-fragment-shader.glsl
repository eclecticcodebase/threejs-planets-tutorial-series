uniform sampler2D earthCloudCover;
uniform vec3 lightDirection;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vec4 DiffuseColor = texture2D(earthCloudCover, vUv);

    float DotProduct = -dot(vNormal, lightDirection);
    float MaxDotProduct = max(DotProduct, 0.0);
    vec4 diffuse = MaxDotProduct * DiffuseColor;

    gl_FragColor = diffuse;
}
