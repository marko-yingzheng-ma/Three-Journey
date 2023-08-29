uniform mat4 projectionMatrix; 
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

// user passed-in arguments/value from material (similar to function params)
uniform vec2 uFrequency; 
uniform float uTime;

// attributes passed-in from geometry.
attribute vec3 position;
attribute float aRandom;
attribute vec2 uv;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

const float PI = 3.1415926535897932384626433832795;

// this shader (program) will be run for each vertex!!
void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // modelPosition.z = sin(modelPosition.x * uFrequency * aRandom) * 0.1;
  // modelPosition.z += sin(uTime * aRandom) * 0.01;
  
  float elevation = sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
  elevation += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;
  modelPosition.z = elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vRandom = aRandom;
  vUv = uv;
  vElevation = elevation;
}