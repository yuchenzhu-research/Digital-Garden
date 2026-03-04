uniform sampler2D uTexture;
uniform float uColorIntensity;

varying vec2 vUv;
varying float vProgress;
varying float vAlpha;

void main() {
  // Sample texture
  vec4 texColor = texture2D(uTexture, vUv);

  // Circle shape logic for points
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  
  // Soft circle edge
  float alpha = 1.0 - smoothstep(0.45, 0.5, dist);

  // Discard pixels outside the circle
  if (alpha < 0.01) discard;

  // Boost colors for "Neon" vibe when exploding
  vec3 finalColor = texColor.rgb * uColorIntensity;
  
  // Add white core when very active (simulate energy)
  finalColor += vec3(vProgress * 0.2);

  // Final Alpha: Texture Alpha * Circle Shape * Distance Fade
  gl_FragColor = vec4(finalColor, texColor.a * alpha * vAlpha);
}