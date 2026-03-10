"use client";

import { useEffect } from 'react';
import Lenis from 'lenis';

// Global reference for scroll synchronization
export const scrollProgressRef = { current: 0 };

interface SmoothScrollWrapperProps {
  children: React.ReactNode;
}

export function SmoothScrollWrapper({ children }: SmoothScrollWrapperProps) {
  useEffect(() => {
    const lenisInstance = new Lenis({
      lerp: 0.1,
      duration: 1.5,
      smoothWheel: true,
    });
    let animationFrameId = 0;

    // Sync scroll progress
    const updateScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current = lenisInstance.scroll / (scrollHeight || 1);
    };

    lenisInstance.on('scroll', updateScroll);

    // Store in window for access
    window.__LENIS__ = lenisInstance;

    // Animation frame
    const raf = (time: number) => {
      lenisInstance.raf(time);
      animationFrameId = window.requestAnimationFrame(raf);
    };
    animationFrameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      lenisInstance.off('scroll', updateScroll);
      lenisInstance.destroy();
      window.__LENIS__ = null;
    };
  }, []);

  return <>{children}</>;
}

// Hook to access lenis instance
export function useLenis() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.__LENIS__ ?? null;
}
