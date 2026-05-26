export const vertexShader = `
uniform float uTime;
uniform float uProgress;
uniform float uMode; // 0.0 = Linear, 1.0 = Random
uniform vec2 uResolution;
uniform float uPointSize;
uniform float uPixelRatio;
uniform float uLinearStrength;
uniform float uNoiseStrength;
uniform vec2 uMouse;
uniform float uMouseInfluence;

attribute vec3 aRandom; // Random direction/offset

varying vec2 vUv;
varying float vProgress;
varying float vAlpha;
varying float vDepth;

// ==========================================
// Simplex Noise 3D (Standard Implementation)
// ==========================================
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// Curl Noise (based on Simplex Noise)
vec3 curlNoise(vec3 p) {
  float eps = 0.001;
  float n1 = snoise(vec3(p.x, p.y + eps, p.z));
  float n2 = snoise(vec3(p.x, p.y - eps, p.z));
  float n3 = snoise(vec3(p.x, p.y, p.z + eps));
  float n4 = snoise(vec3(p.x, p.y, p.z - eps));
  float n5 = snoise(vec3(p.x + eps, p.y, p.z));
  float n6 = snoise(vec3(p.x - eps, p.y, p.z));

  float x = n2 - n1;
  float y = n4 - n3;
  float z = n5 - n6;

  return normalize(vec3(y, z, x));
}

void main() {
  vUv = uv;
  vProgress = uProgress;

  vec3 newPos = position;

  // ============================
  // Idle Breathing (when assembled, progress ≈ 0)
  // ============================
  float breathe = sin(uTime * 0.8 + position.x * 0.5 + position.y * 0.7) * 0.02;
  float drift = cos(uTime * 0.5 + position.y * 0.3) * 0.015;
  float idleInfluence = 1.0 - smoothstep(0.0, 0.15, uProgress);
  newPos.x += drift * idleInfluence;
  newPos.y += breathe * idleInfluence;
  newPos.z += sin(uTime * 0.6 + position.x * 0.4) * 0.01 * idleInfluence;

  // ============================
  // Mode A: Random (Curl Noise + Spiral)
  // ============================
  vec3 noisePos = position * 0.005 + uTime * 0.1;
  vec3 curl = curlNoise(noisePos);
  
  vec3 randomDir = normalize(aRandom) * uProgress * uNoiseStrength * 10.0;
  vec3 curlDir = curl * uProgress * uNoiseStrength * 5.0;

  // Spiral rotation during explosion
  float angle = uProgress * 3.14159 * 0.5 + length(position.xy) * 0.3;
  float spiralX = cos(angle) * randomDir.x - sin(angle) * randomDir.y;
  float spiralY = sin(angle) * randomDir.x + cos(angle) * randomDir.y;
  
  vec3 randomModePos = position + vec3(spiralX, spiralY, randomDir.z) + curlDir;


  // ============================
  // Mode B: Linear (Glitch)
  // ============================
  vec3 linearDir = vec3(0.0, 1.0, 2.0); 
  
  float glitchWave = sin(uv.y * 20.0 + uTime * 5.0) * cos(uv.y * 10.0 + uTime * 2.0);
  float glitchStrength = smoothstep(0.4, 0.6, abs(glitchWave)) * uLinearStrength * uProgress;
  
  vec3 linearModePos = position + (linearDir * uProgress * uLinearStrength);
  linearModePos.x += glitchStrength * 2.0;
  linearModePos.z += glitchStrength * 5.0;


  // ============================
  // Blending Modes
  // ============================
  newPos = mix(mix(newPos, linearModePos, uProgress), randomModePos, uMode * uProgress);


  // ============================
  // Mouse Interaction
  // ============================
  vec2 screenPos = newPos.xy / 2.0;
  float d = distance(screenPos, uMouse * vec2(10.0, 10.0));
  float mouseForce = (1.0 - smoothstep(0.0, 1.5, d)) * uMouseInfluence;
  
  newPos.z += mouseForce * 2.0;
  newPos.x += (newPos.x - uMouse.x * 10.0) * mouseForce * 0.5;


  vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Size Attenuation with depth-based scaling
  float depthScale = 1.0 / max(-mvPosition.z, 0.1);
  gl_PointSize = uPointSize * uPixelRatio * depthScale;
  
  // Larger particles when idle, slightly smaller when exploding (more detail)
  gl_PointSize *= mix(1.2, 0.8, uProgress);
  
  // Distance fade
  vAlpha = 1.0 - smoothstep(15.0, 45.0, -mvPosition.z);
  vDepth = clamp(-mvPosition.z / 30.0, 0.0, 1.0);
}
`;

export const fragmentShader = `
uniform sampler2D uTexture;
uniform float uColorIntensity;

varying vec2 vUv;
varying float vProgress;
varying float vAlpha;
varying float vDepth;

void main() {
  // Sample texture
  vec4 texColor = texture2D(uTexture, vUv);

  // Circle shape with soft glow halo
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  
  // Inner core: sharp circle
  float core = 1.0 - smoothstep(0.35, 0.42, dist);
  // Outer glow: soft halo
  float glow = 1.0 - smoothstep(0.0, 0.5, dist);
  glow = pow(glow, 3.0) * 0.4;
  
  float alpha = core + glow;

  // Discard pixels outside both core and glow
  if (alpha < 0.01) discard;

  // Warm gold tint for the aged archival feel
  vec3 goldTint = vec3(0.86, 0.72, 0.4); // Matches --primary oklch(0.78 0.12 79)
  
  // Base color from texture, boosted
  vec3 baseColor = texColor.rgb * uColorIntensity;
  
  // Mix in gold warmth, stronger during explosion
  float goldMix = 0.08 + vProgress * 0.15;
  vec3 finalColor = mix(baseColor, baseColor * goldTint * 1.5, goldMix);
  
  // White-hot core energy when exploding
  finalColor += vec3(vProgress * 0.25) * core;
  
  // Depth-of-field: blur distant particles by reducing contrast
  float dofFade = 1.0 - vDepth * 0.3;
  finalColor *= dofFade;

  // Glow contributes a warm tinted light
  vec3 glowColor = goldTint * glow * 0.6 * (0.5 + vProgress * 0.5);
  finalColor += glowColor;

  // Final Alpha: combine all factors
  float finalAlpha = texColor.a * alpha * vAlpha * dofFade;
  
  gl_FragColor = vec4(finalColor, finalAlpha);
}
`;
