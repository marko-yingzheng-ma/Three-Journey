precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying float vRandom; // vRandom will be the same as aRandom for pixel on the vertex. For other pixels vRandrom value will be between the vertex's aRandom value

/**
  the fragment shader is executed more often than the vertex shader, the varying property will be interpolated between the vertices for each fragment. The varying property represents the data that is interpolated across the primitive (such as a triangle) and passed from the vertex shader to the fragment shader.

  During the interpolation process, the varying property's value at each vertex is calculated, and then the fragment shader receives the interpolated value based on the position of the fragment within the primitive. This allows for smooth transitions of the varying property across the surface of the primitive, even if the vertex shader is executed less frequently.
*/
varying vec2 vUv;
varying float vElevation;

void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  // gl_FragColor = vec4(vRandom, 0.2, uColor.x, 1.0);
  textureColor.rgb *= vElevation * 2.0 + 0.8;
  gl_FragColor = textureColor;
}