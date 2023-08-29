
#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main()
{

  // pattern 3
  // float strength = vUv.x;

  // pattern 4
  // float strength = vUv.y;

  // pattern 5
  // float strength = 1.0 - vUv.y;

  // pattern 6
  // float strength = vUv.y * 10.0;

  // pattern 7
  // float strength = mod(vUv.y * 10.0, 1.0);

  // pattern 8
  // // float strength = sign(sin(24.0 * PI * vUv.y)); // better to use step function combined with pattern 7
  // float strength = mod(vUv.y * 10.0, 1.0);
  // strength = step(0.5, strength);

  // pattern 9
  // float strength = mod(vUv.y * 10.0, 1.0);
  // strength = step(0.8, strength);

  // pattern 10
  // float strength = mod(vUv.x * 10.0, 1.0);
  // strength = step(0.8, strength);

  // pattern 11 - 格子
  // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
  // strength += step(0.8, mod(vUv.y * 10.0, 1.0)); // we are appending y to strength in order to make sure that we check y as well if xStrength is 0. This approach replace the logic of if/else

  // pattern 12 
  // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
  // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

  // pattern 13
  // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
  // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

  // pattern 14
  // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
  // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));

  // float barY = step(0.4, mod(vUv.y * 10.0, 1.0));
  // barY *= step(0.8, mod(vUv.x * 10.0, 1.0));

  // float strength = barX + barY;

  // pattern 15
  // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
  // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));

  // float barY = step(0.4, mod(vUv.y * 10.0, 1.0));
  // barY *= step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));

  // float strength = barX + barY;

  // pattern 16
  // float strength = abs(cos(PI * vUv.x) * 0.4); // the same as abs(vUv.x - 0.5);

  // pattern 17
  // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

  // pattern 18 - tunnel effect
  // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

  // pattern 19
  // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

  // pattern 20
  // float strength = step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

  // pattern 21
  // float strength = floor(vUv.x * 10.0) / 10.0;

  // patterrn 22 - gradient effect 
  // float strength = floor(vUv.x * 10.0) / 10.0;
  // strength *= floor(vUv.y * 10.0) / 10.0;

  // pattern 23 - old TV noise effect 
  // float strength = random(vUv);

  // pattern 24 - Mosaic effect
  // vec2 gridUx = vec2(
  //   floor(vUv.x * 10.0) / 10.0,
  //   floor(vUv.y * 10.0) / 10.0
  // );

  // float strength = random(gridUx);

  // pattern 25
  // vec2 gridUx = vec2(
  //   floor(vUv.x * 10.0) / 10.0,
  //   floor(vUv.y * 10.0 + vUv.x * 5.0) / 10.0
  // );

  // float strength = random(gridUx);

  // pattern 26
  // float strength = length(vUv);

  // pattern 27
  // float strength = distance(vUv, vec2(0.6, 0.6));

  // pattern 28
  // float strength = 1.0 - distance(vUv, vec2(0.6, 0.6));

  // pattern 29 - light point effect
  // float strength = 0.015 / distance(vUv, vec2(0.5, 0.5)); 

  // pattern 30
  // vec2 lightUv = vec2(
  //   vUv.x * 0.2 + 0.4,
  //   vUv.y * 0.5 + 0.25
  // );

  // float strength = 0.015 / distance(lightUv, vec2(0.5, 0.5));

  // pattern 31 - Star !!
  // vec2 lightUvX = vec2(
  //   vUv.x * 0.2 + 0.4,
  //   vUv.y
  // );
  // float lightX = 0.015 / distance(lightUvX, vec2(0.5, 0.5));

  // vec2 lightUvY = vec2(
  //   vUv.x,
  //   vUv.y * 0.2 + 0.4
  // );

  // float lightY = 0.015 / distance(lightUvY, vec2(0.5, 0.5));

  // float strength = lightX * lightY;

  // pattern 32
  // vec2 roratedUv = rotate(vUv, PI * 0.25, vec2(0.5));
  // vec2 lightUvX = vec2(
  //   roratedUv.x * 0.2 + 0.4,
  //   roratedUv.y
  // );
  // float lightX = 0.015 / distance(lightUvX, vec2(0.5, 0.5));

  // vec2 lightUvY = vec2(
  //   roratedUv.x,
  //   roratedUv.y * 0.2 + 0.4
  // );

  // float lightY = 0.015 / distance(lightUvY, vec2(0.5, 0.5));

  // float strength = lightX * lightY;

  // pattern 33
  // float strength = step(0.3, distance(vUv, vec2(0.5)));

  // pattern 34
  // float strength = abs(distance(vUv, vec2(0.5)) - 0.3);

  // pattern 35
  // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

  // pattern 36
  // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

  // pattern 37 - ghost
  // vec2 wavedUv = vec2(
  //   vUv.x,
  //   vUv.y + sin(vUv.x * 30.0) * 0.1
  // );

  // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

  // pattern 38
  //  vec2 wavedUv = vec2(
  //   vUv.x + sin(vUv.y * 30.0) * 0.1,
  //   vUv.y + sin(vUv.x * 30.0) * 0.1
  // );

  // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

  // pattern 39
  //  vec2 wavedUv = vec2(
  //   vUv.x + sin(vUv.y * 100.0) * 0.1,
  //   vUv.y + sin(vUv.x * 100.0) * 0.1
  // );

  // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

  // pattern 40
  // float angle = atan(vUv.y, vUv.x);
  // float strength = angle;

  // pattern 41
  // float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
  // float strength = angle;

  // pattern 42
  // float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
  // angle /= PI * 2.0;
  // angle += 0.5;
  // float strength = angle;

  // pattern 43
  // float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
  // angle /= PI * 2.0;
  // angle += 0.5;
  // angle *= 20.0;
  // angle = mod(angle, 1.0);
  // float strength = angle;

  // pattern 44
  // float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
  // angle /= PI * 2.0;
  // angle += 0.5;
  // float strength = sin(angle * 100.0);

  // pattern 45
  // float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
  // angle /= PI * 2.0;
  // angle += 0.5;
  // float sinusoid = sin(angle * 100.0);

  // float radius = 0.25 + sinusoid * 0.02;
  // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));
  
  // pattern 46 - perlin nose
  // float strength = cnoise(vUv * 10.0);

  // pattern 47
  // float strength = step(0.0, cnoise(vUv * 10.0));

  // pattern 48
  // float strength = 1.0 - abs(cnoise(vUv * 10.0));

  // pattern 49
  // float strength = sin(cnoise(vUv * 10.0) * 20.0);

  // pattern 50
  float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

  // Colored version
  vec3 blackColor = vec3(0.0);
  vec3 uvColor = vec3(vUv, 1.0);
  vec3 mixedColor = mix(blackColor, uvColor, strength);

  gl_FragColor = vec4(mixedColor, 1.0);
}