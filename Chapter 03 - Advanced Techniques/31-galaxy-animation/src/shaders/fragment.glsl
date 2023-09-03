varying vec3 vColor;

void main() {
  // float strength = 1.0 - step(0.5, distance(vec2(0.5, 0.5), gl_PointCoord));

  // diffuse point - linear fading towards edge
  // float strength = distance(gl_PointCoord, vec2(0.5));
  // strength *= 2.0;
  // strength = 1.0 - strength;

  // Light point pattern - fast fading towards edge
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength;
  strength = pow(strength, 5.0);

  // final color
  vec3 color = mix(vec3(0.0), vColor, strength);
  gl_FragColor = vec4(color, 1.0); 
}