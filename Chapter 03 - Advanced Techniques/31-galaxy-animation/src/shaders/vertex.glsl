#define PI 3.1415926535897932384626433832795

uniform float uPointSize;
uniform float uTime;

varying vec3 vColor;

attribute float aScale;
attribute vec3 random;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float distanceToCenter = length(modelPosition.xz);
  float angle = atan(modelPosition.x, modelPosition.z);
  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
  angle += angleOffset;

  modelPosition.x = cos(angle) * distanceToCenter + random.x;
  modelPosition.y = random.y;
  modelPosition.z = sin(angle) * distanceToCenter + random.z;
  

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  gl_PointSize = uPointSize * aScale;
  gl_PointSize *= ( 1.0 / - viewPosition.z );

  vColor = color;
}