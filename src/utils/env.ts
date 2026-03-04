/**
 * Environment Detection Utilities
 * Reliable detection for Tauri vs Web environments
 */

export type Platform = 'macos' | 'windows' | 'linux' | 'unknown';
export type Environment = 'tauri' | 'web';

/**
 * Check if running inside Tauri webview
 * Uses a reliable check that doesn't rely on private APIs
 */
export const isTauri = (): boolean => {
  // SSR check first
  if (typeof window === 'undefined') {
    return false;
  }

  // Check for Tauri window object (modern approach)
  if ('__TAURI__' in window) {
    return true;
  }

  // Fallback: check for deprecated __TAURI_INTERNALS__ (for older versions)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).__TAURI_INTERNALS__ !== undefined) {
    return true;
  }

  // Check for Tauri-specific user agent patterns
  // Note: This is optional and may not always be present
  if (typeof navigator !== 'undefined' && navigator.userAgent) {
    // Tauri desktop typically includes platform info
    if (navigator.userAgent.includes('Tauri')) {
      return true;
    }
  }

  return false;
};

/**
 * Check if running in browser (non-Tauri)
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && !isTauri();
};

/**
 * Detect the current platform
 */
export const getPlatform = (): Platform => {
  if (typeof navigator === 'undefined') {
    return 'unknown';
  }

  const platform = navigator.platform.toLowerCase();

  if (platform.includes('mac') || platform.includes('ipados')) {
    return 'macos';
  }
  if (platform.includes('win')) {
    return 'windows';
  }
  if (platform.includes('linux')) {
    return 'linux';
  }

  // Try userAgent fallback
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('mac')) {
    return 'macos';
  }

  return 'unknown';
};

/**
 * Get current environment type
 */
export const getEnvironment = (): Environment => {
  return isTauri() ? 'tauri' : 'web';
};

/**
 * Check if SSR (Server-Side Rendering)
 */
export const isSSR = (): boolean => {
  return typeof window === 'undefined';
};

/**
 * Conditional import helper for Tauri APIs
 * Safely imports Tauri modules only when in Tauri environment
 */
export const importTauriApi = async <T>(
  importFn: () => Promise<T>,
  fallback?: T
): Promise<T> => {
  if (isTauri()) {
    return importFn();
  }
  if (fallback !== undefined) {
    return fallback;
  }
  throw new Error('Tauri API requested but not running in Tauri environment');
};

/**
 * Platform-aware path separator
 */
export const pathSeparator = (): string => {
  const platform = getPlatform();
  return platform === 'windows' ? '\\' : '/';
};

/**
 * Join path segments in a platform-aware manner
 */
export const joinPath = (...segments: string[]): string => {
  return segments.filter(Boolean).join(pathSeparator());
};