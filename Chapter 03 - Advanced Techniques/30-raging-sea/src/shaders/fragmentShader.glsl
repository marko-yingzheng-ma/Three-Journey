uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorMultipler;
uniform float uColorOffSet;

varying vec2 vUv;
varying float vElevation;

void main() {
  float mixStrength = (vElevation + uColorOffSet) * uColorMultipler;
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
  gl_FragColor = vec4(color, 1.0);
}