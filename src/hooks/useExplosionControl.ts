import { useState, useCallback } from 'react';
import { useSpring } from 'framer-motion';

export function useExplosionControl() {
  // Mode state: 0 = Linear, 1 = Random
  const [mode, setMode] = useState(0);

  // Spring for smooth progress transition
  // Stiffness/Damping tuned for "Snappy but Smooth" apple-feel
  const progress = useSpring(0, { stiffness: 60, damping: 20, mass: 1 });

  const triggerExplosion = useCallback((type: 'linear' | 'random' = 'random') => {
    setMode(type === 'random' ? 1 : 0);
    // Explode out
    progress.set(1);

    // Auto return after a duration (can be removed if manual control desired)
    // For demo purposes, we auto-return to form.
    const duration = type === 'random' ? 2500 : 1500;

    setTimeout(() => {
      progress.set(0);
    }, duration);
  }, [progress]);

  // Bind scroll to explosion (for scroll-driven deconstruction)
  // Input: scroll progress (0 to 1)
  const bindScroll = useCallback((scrollProgress: number) => {
    // Threshold to start exploding
    const threshold = 0.1;
    if (scrollProgress > threshold) {
      // Linear explosion based on scroll
      setMode(0); // Scroll usually triggers Linear/Glitch mode

      // Remap 0.1->1.0 to 0.0->1.0
      const remapped = (scrollProgress - threshold) / (1.0 - threshold);
      progress.set(Math.min(remapped, 1.0));
    } else {
      progress.set(0);
    }
  }, [progress]);

  return { mode, progress, triggerExplosion, bindScroll };
}