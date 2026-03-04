import * as THREE from 'three';

interface CreateParticleGeometryOptions {
  width?: number;
  height?: number;
  size?: number; // particle spacing
}

export function createParticleGeometry({
  width = 512,
  height = 512,
  size = 1.0,
}: CreateParticleGeometryOptions = {}) {
  const count = width * height;

  // 1. Base positions (grid arrangement)
  const positions = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);
  const indices = new Float32Array(count);

  const halfWidth = width * size / 2;
  const halfHeight = height * size / 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;

      // Position: centered arrangement
      positions[index * 3] = x * size - halfWidth;
      positions[index * 3 + 1] = -y * size + halfHeight; // Y upward
      positions[index * 3 + 2] = 0;

      // UV: corresponding texture coordinates (0-1)
      uvs[index * 2] = x / (width - 1);
      uvs[index * 2 + 1] = 1.0 - y / (height - 1); // Y flipped

      // Original grid index (for Linear Mode calculation)
      indices[index] = index;
    }
  }

  // 2. Shuffled order array (for Random Mode randomness)
  const shuffledIndices = new Float32Array(count);
  const shuffleOrder = Array.from({ length: count }, (_, i) => i);

  // Fisher-Yates shuffle
  for (let i = shuffleOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffleOrder[i], shuffleOrder[j]] = [shuffleOrder[j], shuffleOrder[i]];
  }

  for (let i = 0; i < count; i++) {
    shuffledIndices[i] = shuffleOrder[i];
  }

  // 3. Create BufferGeometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setAttribute('index', new THREE.BufferAttribute(indices, 1));
  geometry.setAttribute('shuffledIndex', new THREE.BufferAttribute(shuffledIndices, 1));

  // 4. Calculate spherical coordinates for random dispersion
  const randomDirections = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    randomDirections[i * 3] = Math.sin(phi) * Math.cos(theta);     // x
    randomDirections[i * 3 + 1] = Math.sin(phi) * Math.sin(theta); // y
    randomDirections[i * 3 + 2] = Math.cos(phi);                   // z
  }
  geometry.setAttribute('randomDirection', new THREE.BufferAttribute(randomDirections, 3));

  return geometry;
}