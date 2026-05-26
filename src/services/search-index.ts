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

export interface SearchResult extends Document {
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
 * SearchIndex Class wrapping MiniSearch
 */
export class SearchIndex {
  private miniSearch: MiniSearch | null = null;
  private documents: Document[] = [];

  constructor(initialDocuments: Document[] = []) {
    this.rebuild(initialDocuments);
  }

  /**
   * Rebuild or update the search index with a new list of documents.
   * Auto-rebuilds index when entries/documents change.
   */
  public rebuild(documents: Document[]): void {
    this.documents = documents;

    if (documents.length === 0) {
      this.miniSearch = null;
      return;
    }

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
    this.miniSearch = index;
  }

  /**
   * Search method conforming to simple API: search(query: string): SearchResult[]
   * Supports fuzzy search, field boosting, and falls back to simple filtering when index is not ready.
   */
  public search(query: string): SearchResult[] {
    const trimmed = query.trim();
    if (!trimmed) {
      return this.documents.map((doc) => ({
        ...doc,
        score: 1,
        match: {},
      }));
    }

    if (!this.miniSearch) {
      // Fallback: simple includes filtering
      const lowerQuery = trimmed.toLowerCase();
      return this.documents
        .filter((doc) => 
          doc.title.toLowerCase().includes(lowerQuery) ||
          doc.author.toLowerCase().includes(lowerQuery) ||
          doc.description.toLowerCase().includes(lowerQuery) ||
          (doc.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ?? false) ||
          (doc.longDescription?.toLowerCase().includes(lowerQuery) ?? false) ||
          (doc.academicContext?.toLowerCase().includes(lowerQuery) ?? false)
        )
        .map((doc) => ({
          ...doc,
          score: 1,
          match: {},
        }));
    }

    const miniResults = this.miniSearch.search(trimmed, {
      boost: FIELD_BOOST,
      fuzzy: 0.2,
      prefix: true,
    });

    const docMap = new Map(this.documents.map((doc) => [doc.id, doc]));

    return miniResults
      .map((res) => {
        const doc = docMap.get(res.id);
        if (!doc) return null;
        return {
          ...doc,
          score: res.score,
          match: res.match,
        };
      })
      .filter((item): item is SearchResult => item !== null);
  }
}

/**
 * Backward-compatible helper to create a MiniSearch index.
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
 * Backward-compatible search function.
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
