/**
 * Archive Search Index
 * Full-text search using MiniSearch for client-side searching of documents.
 */

import MiniSearch, { type SearchResult as MiniSearchResult } from 'minisearch';
import type { Document } from '@/lib/types';

export interface ArchiveSearchResult {
  id: string;
  score: number;
  match: Record<string, string[]>;
}

const SEARCH_FIELDS = ['title', 'author', 'description', 'tags_joined', 'category', 'longDescription', 'academicContext'];

const FIELD_BOOST: Record<string, number> = {
  title: 5,
  tags_joined: 3,
  author: 2,
  description: 2,
  category: 1,
  longDescription: 1,
  academicContext: 1,
};

/**
 * Create a MiniSearch index from an array of Documents.
 */
export function createSearchIndex(documents: Document[]): MiniSearch {
  const index = new MiniSearch({
    fields: SEARCH_FIELDS,
    storeFields: ['id'],
    searchOptions: {
      boost: FIELD_BOOST,
      fuzzy: 0.2,
      prefix: true,
    },
  });

  const indexableDocuments = documents.map((doc) => ({
    id: doc.id,
    title: doc.title,
    author: doc.author,
    description: doc.description,
    tags_joined: doc.tags?.join(' ') ?? '',
    category: doc.category,
    longDescription: doc.longDescription ?? '',
    academicContext: doc.academicContext ?? '',
  }));

  index.addAll(indexableDocuments);
  return index;
}

/**
 * Search documents using the MiniSearch index.
 * Returns an array of ArchiveSearchResult sorted by relevance.
 */
export function searchDocuments(
  index: MiniSearch,
  query: string,
): ArchiveSearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const results: MiniSearchResult[] = index.search(query, {
    boost: FIELD_BOOST,
    fuzzy: 0.2,
    prefix: true,
  });

  return results.map((result) => ({
    id: String(result.id),
    score: result.score,
    match: result.match,
  }));
}
