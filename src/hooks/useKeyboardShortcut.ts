"use client";

import { useEffect, useCallback, useRef } from 'react';

type ShortcutHandler = () => void;

interface UseKeyboardShortcutOptions {
  key: string;
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  callback: ShortcutHandler;
  enabled?: boolean;
}

/**
 * Hook to register keyboard shortcuts that work in Tauri and browser environments.
 * In Tauri, prevents default browser behavior for better native feel.
 */
export function useKeyboardShortcut({
  key,
  modifiers = [],
  callback,
  enabled = true,
}: UseKeyboardShortcutOptions) {
  const handler = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Check if key matches
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();
      if (!keyMatch) return;

      // Check modifiers
      const ctrlMatch = modifiers.includes('ctrl') ? event.ctrlKey : !event.ctrlKey;
      const altMatch = modifiers.includes('alt') ? event.altKey : !event.altKey;
      const shiftMatch = modifiers.includes('shift') ? event.shiftKey : !event.shiftKey;
      const metaMatch = modifiers.includes('meta') ? event.metaKey : !event.metaKey;

      if (ctrlMatch && altMatch && shiftMatch && metaMatch) {
        // In Tauri app, prevent default browser behavior
        if (typeof window !== 'undefined' && '__TAURI__' in window) {
          event.preventDefault();
          event.stopPropagation();
        }
        callback();
      }
    },
    [key, modifiers, callback, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [handler, enabled]);
}

/**
 * Hook specifically for Cmd+S / Ctrl+S save shortcut
 */
export function useSaveShortcut(callback: ShortcutHandler, enabled = true) {
  // Detect platform for appropriate modifier
  const isMac = typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const modifiers: ('ctrl' | 'alt' | 'shift' | 'meta')[] = isMac ? ['meta'] : ['ctrl'];

  useKeyboardShortcut({
    key: 's',
    modifiers,
    callback,
    enabled,
  });
}

/**
 * Hook for Cmd/Ctrl + Shift + S (Save as)
 */
export function useSaveAsShortcut(callback: ShortcutHandler, enabled = true) {
  const isMac = typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const modifiers: ('ctrl' | 'alt' | 'shift' | 'meta')[] = isMac ? ['meta', 'shift'] : ['ctrl', 'shift'];

  useKeyboardShortcut({
    key: 's',
    modifiers,
    callback,
    enabled,
  });
}

/**
 * Hook for Escape key (close modal/dialog)
 */
export function useEscapeShortcut(callback: ShortcutHandler, enabled = true) {
  useKeyboardShortcut({
    key: 'Escape',
    callback,
    enabled,
  });
}