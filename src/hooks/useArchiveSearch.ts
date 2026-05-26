"use client";

import { useEffect, useMemo, useState } from 'react';
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

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), debounceMs);
    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // Maintain SearchIndex and auto-rebuild when documents change
  const searchIndex = useMemo(() => {
    return new SearchIndex(allDocuments);
  }, [allDocuments]);

  // Compute search results
  const results = useMemo(() => {
    return searchIndex.search(debouncedQuery);
  }, [searchIndex, debouncedQuery]);

  // Highlight terms extracted from query and MiniSearch match metadata
  const highlightTerms = useMemo(() => {
    const terms = new Set<string>();
    const trimmed = debouncedQuery.trim();

    if (trimmed) {
      // Split query by spaces to extract basic terms
      trimmed.toLowerCase().split(/\s+/).forEach((word) => {
        if (word.length > 0) {
          terms.add(word);
        }
      });

      // Supplement with actual matches matched by MiniSearch
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
