"use client";

import { useEffect, useMemo, useState, useRef } from 'react';
import type { Document } from '@/lib/types';
import { SearchIndex, type SearchResult } from '@/services/search-index';

interface UseArchiveSearchOptions {
  debounceMs?: number;
}

interface UseArchiveSearchReturn {
  results: SearchResult[];
  isSearchActive: boolean;
  highlightTerms: string[];
}

/**
 * Full-text archive search hook.
 * Integrates SearchIndex with the React lifecycle, debounces search query,
 * and returns ranked results with highlight details. Falls back to simple filtering when index is not ready.
 */
export function useArchiveSearch(
  allDocuments: Document[],
  searchQuery: string,
  { debounceMs = 300 }: UseArchiveSearchOptions = {},
): UseArchiveSearchReturn {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [isLoaded, setIsLoaded] = useState(false);

  const searchIndexRef = useRef<SearchIndex | null>(null);
  if (!searchIndexRef.current) {
    searchIndexRef.current = new SearchIndex([]);
  }

  const lastDocsRef = useRef<Document[]>([]);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Ref to hold the latest allDocuments to avoid triggering initial useEffect on every change
  const allDocsRef = useRef<Document[]>(allDocuments);
  useEffect(() => {
    allDocsRef.current = allDocuments;
  }, [allDocuments]);

  // Helper for lazy idle saving
  const saveIndexIdle = (index: SearchIndex) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      try {
        const runSave = async () => {
          const { saveSearchIndex } = await import('@/services/entryService');
          const json = index.serialize();
          if (json) {
            await saveSearchIndex(json);
          }
        };

        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
            runSave();
          }, { timeout: 2000 });
        } else {
          runSave();
        }
      } catch (e) {
        console.warn('Failed to save search index asynchronously:', e);
      }
    }, 1000); // Debounce save by 1s
  };

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), debounceMs);
    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // 1. Initial load from storage on mount
  useEffect(() => {
    let active = true;
    const loadCache = async () => {
      try {
        const { loadSearchIndex } = await import('@/services/entryService');
        const cachedJson = await loadSearchIndex();
        if (!active) return;

        // Use the ref value to avoid listing allDocuments as a dependency
        const currentDocs = allDocsRef.current;

        if (cachedJson) {
          searchIndexRef.current!.loadFromJSON(cachedJson, currentDocs);
          // If cached document count differs, incrementally sync it
          searchIndexRef.current!.updateIncrementally(currentDocs);
          saveIndexIdle(searchIndexRef.current!);
        } else {
          searchIndexRef.current!.rebuild(currentDocs);
          saveIndexIdle(searchIndexRef.current!);
        }
      } catch (error) {
        console.error('Failed to load search index cache:', error);
        if (active) {
          searchIndexRef.current!.rebuild(allDocsRef.current);
        }
      } finally {
        if (active) {
          lastDocsRef.current = allDocsRef.current;
          setIsLoaded(true);
        }
      }
    };

    loadCache();
    return () => {
      active = false;
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  // 2. Incremental update when documents change
  useEffect(() => {
    if (!isLoaded) return;

    const isSame =
      lastDocsRef.current.length === allDocuments.length &&
      lastDocsRef.current.every((doc, index) => doc.id === allDocuments[index]?.id);

    if (isSame) return;

    searchIndexRef.current!.updateIncrementally(allDocuments);
    lastDocsRef.current = allDocuments;
    saveIndexIdle(searchIndexRef.current!);
  }, [allDocuments, isLoaded]);

  // Compute search results
  const results = useMemo(() => {
    // Explicitly reference dependencies to satisfy the exhaustive-deps rule
    void allDocuments;
    void isLoaded;
    return searchIndexRef.current!.search(debouncedQuery);
  }, [debouncedQuery, allDocuments, isLoaded]);

  // Highlight terms extracted from query and MiniSearch match metadata
  const highlightTerms = useMemo(() => {
    const terms = new Set<string>();
    const trimmed = debouncedQuery.trim();

    if (trimmed) {
      trimmed.toLowerCase().split(/\s+/).forEach((word) => {
        if (word.length > 0) {
          terms.add(word);
        }
      });

      results.forEach((res) => {
        if (res.match) {
          Object.keys(res.match).forEach((term) => {
            terms.add(term.toLowerCase());
          });
        }
      });
    }

    return Array.from(terms);
  }, [debouncedQuery, results]);

  const isSearchActive = debouncedQuery.trim().length > 0;

  return { results, isSearchActive, highlightTerms };
}
