precision mediump float;

varying float vRandom; // vRandom will be the same as aRandom for pixel on the vertex. For other pixels vRandrom value will be between the vertex's aRandom value

/**
  the fragment shader is executed more often than the vertex shader, the varying property will be interpolated between the vertices for each fragment. The varying property represents the data that is interpolated across the primitive (such as a triangle) and passed from the vertex shader to the fragment shader.

  During the interpolation process, the varying property's value at each vertex is calculated, and then the fragment shader receives the interpolated value based on the position of the fragment within the primitive. This allows for smooth transitions of the varying property across the surface of the primitive, even if the vertex shader is executed less frequently.
*/

void main() {
  gl_FragColor = vec4(0.5, vRandom, 1.0, 1.0);
}