"use client";

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

// Global reference for scroll synchronization
export const scrollProgressRef = { current: 0 };

interface SmoothScrollWrapperProps {
  children: React.ReactNode;
}

export function SmoothScrollWrapper({ children }: SmoothScrollWrapperProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      lerp: 0.1,
      duration: 1.5,
      smoothWheel: true,
    });

    // Sync scroll progress
    const updateScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current = lenisInstance.scroll / (scrollHeight || 1);
    };

    lenisInstance.on('scroll', updateScroll);

    // Store in window for access
    (window as any).__LENIS__ = lenisInstance;

    // Animation frame
    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    setLenis(lenisInstance);

    return () => {
      lenisInstance.off('scroll', updateScroll);
      lenisInstance.destroy();
      (window as any).__LENIS__ = null;
    };
  }, []);

  return <>{children}</>;
}

// Hook to access lenis instance
export function useLenis() {
  return (window as any).__LENIS__ as Lenis | null;
}