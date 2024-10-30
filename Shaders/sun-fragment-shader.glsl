
void main() {
    // Get current pixel coordinates
    vec2 uv = vec2(gl_PointCoord.x, gl_PointCoord.y);
    // Calculate distance from center and double it
    float distanceFromCenter = length(uv - vec2(0.5)) * 2.0;
    // Sun color should be dull as it will be multiplied
    const vec3 sunColor = vec3(0.41, 0.33, 0.25);
    // Calculate base color based on distance from center
    vec4 baseColor = vec4(0.1 / distanceFromCenter);
    // Multiply color by original sun color and increase intensity
    baseColor.rgb *= sunColor * 6.0;
    // Calculate alpha value based on distance from center
    float alphaFactor = (1.0 - distanceFromCenter) * 0.45;
    // Ensure alpha channel is less than or equal to 1
    baseColor.a = min(1.0, baseColor.a * alphaFactor);
    // Set pixel color to baseColor
    gl_FragColor = baseColor;
}
