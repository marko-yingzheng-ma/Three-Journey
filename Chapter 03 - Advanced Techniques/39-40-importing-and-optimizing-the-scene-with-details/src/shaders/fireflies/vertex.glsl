  uniform float uPointSize;
  uniform float uTime;

  attribute float aScale;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(modelPosition.x + uTime - aScale) * 0.2 * aScale;
    modelPosition.z += cos(modelPosition.x + uTime - aScale) * 0.2 * aScale;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = uPointSize * aScale;
    gl_PointSize *= ( 1.0 / - viewPosition.z ); 
  }