uniform sampler2D worldMap;
uniform sampler2D earthSpecularMap;
uniform sampler2D earthNormalMap;
uniform sampler2D earthCloudCover;
uniform sampler2D earthNightLights;
uniform vec3 lightDirection;

varying vec3 pixelPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 VertexPosition;

vec3 perturbNormal2Arb(vec3 surf_norm) {
    vec3 q0 = vec3(dFdx(VertexPosition.x), dFdx(VertexPosition.y), dFdx(VertexPosition.z));
    vec3 q1 = vec3(dFdy(VertexPosition.x), dFdy(VertexPosition.y), dFdy(VertexPosition.z));
    vec2 st0 = dFdx(vUv.st);
    vec2 st1 = dFdy(vUv.st);
    float scale = sign(st1.t * st0.s - st0.t * st1.s);
    vec3 S = normalize((q0 * st1.t - q1 * st0.t) * scale);
    vec3 T = normalize((-q0 * st1.s + q1 * st0.s) * scale);
    vec3 N = normalize(surf_norm);
    mat3 tsn = mat3(S, T, N);
    vec3 mapN = texture2D(earthNormalMap, vUv).xyz * 2.0 - 1.0;
    vec2 normalScale = vec2(1., 1.);
    mapN.xy *= normalScale;
    mapN.xy *= (float(gl_FrontFacing) * 2.0 - 1.0);
    return normalize(tsn * mapN);
}

void main() {
    //diffuse
    vec3 DiffuseColor = vec3(texture2D(worldMap, vUv));
    vec3 normal = perturbNormal2Arb(vNormal);
    float DotProduct = -dot(normal, lightDirection);
    float MaxDotProduct = max(DotProduct, 0.0);
    vec3 diffuse = MaxDotProduct * DiffuseColor;

    //Cloud cover
    vec4 CloudColor = texture2D(earthCloudCover, vUv);

    //Specular
    float shininess = 20.;
    float specularStrength = (texture2D(earthSpecularMap, vUv).r * 2.) - CloudColor.a; // Clouds subtracted to create shadow;
    vec3 viewDir = normalize(cameraPosition - pixelPosition);
    vec3 reflectDir = reflect(-lightDirection, normal);
    float spec = pow(max(-dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specularColor = vec3(1.0, 0.8, 0.3);
    vec3 specular = spec * specularColor * specularStrength;
    vec3 result = (diffuse + specular);//* objectColor;

    //Night lights
    vec3 earthNightLights = vec3(texture2D(earthNightLights, vUv));
    float DayNightThreshold = smoothstep(-0.05, 0.05, -dot(vNormal, lightDirection));
    result = mix(earthNightLights, result, DayNightThreshold);

    gl_FragColor = vec4(result, 1.0);
}
