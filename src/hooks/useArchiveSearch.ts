"use client";

import { useEffect, useMemo, useState } from 'react';
import type { Document } from '@/lib/types';
import { createSearchIndex, searchDocuments } from '@/services/search-index';

interface UseArchiveSearchOptions {
  debounceMs?: number;
}

interface UseArchiveSearchReturn {
  results: Document[];
  isSearchActive: boolean;
}

/**
 * Full-text archive search hook.
 * Builds a MiniSearch index from all documents, debounces query input,
 * and returns ranked results. Falls back to all documents when query is empty.
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

  // Build/rebuild index when documents change
  const index = useMemo(() => {
    if (allDocuments.length === 0) return null;
    return createSearchIndex(allDocuments);
  }, [allDocuments]);

  // Compute search results
  const results = useMemo(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      return allDocuments;
    }

    if (!index) {
      // Fallback: simple includes match
      const query = trimmed.toLowerCase();
      return allDocuments.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.author.toLowerCase().includes(query) ||
          doc.description.toLowerCase().includes(query) ||
          (doc.tags?.some((tag) => tag.toLowerCase().includes(query)) ?? false),
      );
    }

    const searchResults = searchDocuments(index, trimmed);
    const idToRank = new Map(searchResults.map((r, i) => [r.id, i]));

    return allDocuments
      .filter((doc) => idToRank.has(doc.id))
      .sort((a, b) => (idToRank.get(a.id) ?? 0) - (idToRank.get(b.id) ?? 0));
  }, [allDocuments, debouncedQuery, index]);

  const isSearchActive = debouncedQuery.trim().length > 0;

  return { results, isSearchActive };
}
