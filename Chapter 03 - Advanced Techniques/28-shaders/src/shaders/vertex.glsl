uniform mat4 projectionMatrix; 
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

// user passed-in value from material.
uniform float uFrequency; 

// attributes passed-in from geometry.
attribute vec3 position;
attribute float aRandom;

varying float vRandom;

const float PI = 3.1415926535897932384626433832795;

// this shader (program) will be run for each vertex!!
void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z = sin(modelPosition.x * uFrequency * aRandom) * 0.1;

  vec4 viewPosition = viewMatrix * modelPosition;

  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vRandom = aRandom;
}