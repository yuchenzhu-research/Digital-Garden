"use client";

import { useEffect, useState, useCallback, useRef } from 'react';

interface UseAutosaveOptions {
  storageKey: string;
  delay?: number; // Debounce delay in ms
  onSave?: (data: string) => void;
  onRestore?: (data: string) => void;
}

export function useAutosave(
  initialValue: string,
  options: UseAutosaveOptions
) {
  const { storageKey, delay = 1000, onSave, onRestore } = options;
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Compose full storage key
  const fullKey = `bibliotheca_${storageKey}`;

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(fullKey);
      if (saved) {
        setValue(saved);
        onRestore?.(saved);
      }
    } catch (error) {
      console.warn('Failed to load autosave:', error);
    }
  }, [fullKey, onRestore]);

  // Autosave function with debounce
  const save = useCallback(
    (newValue: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        try {
          setIsSaving(true);
          localStorage.setItem(fullKey, newValue);
          setLastSaved(new Date());
          onSave?.(newValue);
        } catch (error) {
          console.warn('Failed to autosave:', error);
        } finally {
          setIsSaving(false);
        }
      }, delay);
    },
    [fullKey, delay, onSave]
  );

  // Update value and trigger autosave
  const setAutosaveValue = useCallback(
    (newValue: string | ((prev: string) => string)) => {
      const resolvedValue = typeof newValue === 'function'
        ? newValue(value)
        : newValue;
      setValue(resolvedValue);
      save(resolvedValue);
    },
    [value, save]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Persist entire entry data
  const saveEntry = useCallback(
    (entryData: Record<string, unknown>) => {
      try {
        localStorage.setItem(`bibliotheca_entry_${storageKey}`, JSON.stringify(entryData));
      } catch (error) {
        console.warn('Failed to save entry:', error);
      }
    },
    [storageKey]
  );

  // Load entire entry data
  const loadEntry = useCallback((): Record<string, unknown> | null => {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem(`bibliotheca_entry_${storageKey}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, [storageKey]);

  // Clear saved data
  const clearSaved = useCallback(() => {
    localStorage.removeItem(fullKey);
    localStorage.removeItem(`bibliotheca_entry_${storageKey}`);
    setValue('');
    setLastSaved(null);
  }, [fullKey, storageKey]);

  return {
    value,
    setValue: setAutosaveValue,
    isSaving,
    lastSaved,
    saveEntry,
    loadEntry,
    clearSaved,
  };
}

// Simple version that just autosaves a single field
export function useSimpleAutosave(
  initialValue: string,
  storageKey: string,
  delay: number = 1000
) {
  const hook = useAutosave(initialValue, {
    storageKey,
    delay,
  });

  return hook;
}