"use client";

import React, { useRef, useMemo, useEffect, forwardRef, RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';
import { createParticleGeometry } from '@/lib/geometry';
import { vertexShader, fragmentShader } from './shaders';

interface PhotoParticlesProps {
  texture: THREE.Texture | null;
  width?: number; // logical width in 3D units
  height?: number;
  progress: MotionValue<number>; // MotionValue for animation
  mode?: number; // 0 = Linear, 1 = Random
  pointSize?: number;
}

const PhotoParticles = forwardRef<THREE.Points, PhotoParticlesProps>(({
  texture,
  width = 10,
  progress,
  mode = 0,
  pointSize = 2.0,
}, ref) => {
  // Use THREE.ShaderMaterial type for ref
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  // Create Geometry once
  const geometry = useMemo(() => {
    return createParticleGeometry({ width: 256, height: 256, size: width / 256 });
  }, [width]);

  // Uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uMode: { value: 0 },
    uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
    uPointSize: { value: pointSize },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uTexture: { value: null },
    uColorIntensity: { value: 2.0 },
    uLinearStrength: { value: 10.0 },
    uNoiseStrength: { value: 2.0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uMouseInfluence: { value: 0.15 },
  }), [viewport, pointSize]);

  // Sync Mode & Texture (reactive prop updates are fine here)
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uMode.value = mode;

      if (texture) {
        materialRef.current.uniforms.uTexture.value = texture;
      }
    }
  }, [mode, texture]);

  // Frame Loop
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

      // Update progress from MotionValue
      materialRef.current.uniforms.uProgress.value = progress.get();

      // Smooth mouse follow
      materialRef.current.uniforms.uMouse.value.lerp(state.pointer, 0.1);
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
      />
    </points>
  );
});

PhotoParticles.displayName = 'PhotoParticles';

export default PhotoParticles;