"use client";

import { useSyncExternalStore } from 'react';
import { isMobileDevice } from '@/utils/env';

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return () => { };
  }

  window.addEventListener('resize', callback);
  window.addEventListener('orientationchange', callback);

  return () => {
    window.removeEventListener('resize', callback);
    window.removeEventListener('orientationchange', callback);
  };
};

const getSnapshot = () => isMobileDevice();

const getServerSnapshot = () => false;

export const useMobileDevice = (): boolean => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
