/**
 * Shared utilities for storage adapters.
 *
 * Centralises logic that was previously duplicated across
 * web-storage.ts, web-fs-storage.ts, and native-storage.ts.
 */

import type { Entry, EntrySummary, SavedEntry } from './storage-repository';

// ============================================================================
// ID Generation
// ============================================================================

/**
 * Generate a unique ID (timestamp + random suffix).
 * Used by adapters when an entry does not already carry an ID.
 */
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// ============================================================================
// Entry → Summary projection
// ============================================================================

/**
 * Project a full Entry array into lightweight EntrySummary objects.
 * Every adapter was doing this identically — now it lives in one place.
 */
export const toEntrySummaries = (entries: Entry[]): EntrySummary[] => {
  return entries.map((entry) => ({
    id: (entry as SavedEntry).id || '',
    title: entry.title,
    figure: entry.figure,
    imageUrl: entry.imageUrl,
    dateCreated: entry.dateCreated,
    keywords: entry.keywords,
  }));
};
