"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Category } from '@/components/ui/FilterBar';
import { documents } from '@/lib/data';
import { entryToDocument } from '@/lib/document-mappers';
import { isUserDocument, type Document } from '@/lib/types';
import { deleteEntry, getEntries } from '@/services/entryService';
import { hasMobileDraft } from '@/services/mobile-draft';
import type { Entry } from '@/services/storage-repository';
import { useMobileDevice } from './useMobileDevice';
import { useArchiveSearch } from './useArchiveSearch';

const DEFAULT_DIMMING_INTENSITY = 0.3;
const FEATURED_DOCUMENTS = documents.slice(0, 3);

const getInitialDimmingIntensity = (): number => {
  if (typeof window === 'undefined') {
    return DEFAULT_DIMMING_INTENSITY;
  }

  const saved = window.localStorage.getItem('bv_dimming_intensity');
  const parsed = saved ? Number.parseFloat(saved) : Number.NaN;

  return Number.isFinite(parsed) ? parsed : DEFAULT_DIMMING_INTENSITY;
};


export function useHomePageController() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [editorEntry, setEditorEntry] = useState<Entry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userEntries, setUserEntries] = useState<Entry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [dimmingIntensity, setDimmingIntensity] = useState(getInitialDimmingIntensity);
  const [hasLocalMobileDraft, setHasLocalMobileDraft] = useState(false);

  const isMobileMode = useMobileDevice();
  const isEditMode = editorEntry !== null;

  const refreshUserEntries = useCallback(async () => {
    try {
      const entries = await getEntries();
      setUserEntries(entries);
    } catch (error) {
      console.warn('Failed to refresh user entries:', error);
    }
  }, []);

  const refreshMobileDraftState = useCallback(async () => {
    if (!isMobileMode) {
      setHasLocalMobileDraft(false);
      return;
    }

    setHasLocalMobileDraft(await hasMobileDraft());
  }, [isMobileMode]);

  useEffect(() => {
    let cancelled = false;

    const loadUserEntries = async () => {
      try {
        const entries = await getEntries();
        if (!cancelled) {
          setUserEntries(entries);
        }
      } catch (error) {
        console.warn('Failed to load user entries:', error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadUserEntries();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadMobileDraftState = async () => {
      if (!isMobileMode) {
        if (!cancelled) {
          setHasLocalMobileDraft(false);
        }
        return;
      }

      const hasDraft = await hasMobileDraft();
      if (!cancelled) {
        setHasLocalMobileDraft(hasDraft);
      }
    };

    void loadMobileDraftState();

    return () => {
      cancelled = true;
    };
  }, [isMobileMode]);

  const allDocuments = useMemo(() => {
    const userDocuments = userEntries.map((entry, index) => entryToDocument(entry, index));
    return [...documents, ...userDocuments];
  }, [userEntries]);

  const { results: searchResults, isSearchActive } = useArchiveSearch(allDocuments, searchQuery);

  const filteredDocuments = useMemo(() => {
    const base = isSearchActive ? searchResults : allDocuments;
    if (category === 'all') {
      return base;
    }
    return base.filter((document) => document.category === category);
  }, [allDocuments, searchResults, isSearchActive, category]);

  const selectedDoc = useMemo(
    () => allDocuments.find((document) => document.id === selectedDocId),
    [allDocuments, selectedDocId]
  );

  useEffect(() => {
    document.body.style.overflow = selectedDocId || isEditing ? 'hidden' : 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedDocId, isEditing]);

  const handleIntensityChange = useCallback((value: number) => {
    setDimmingIntensity(value);
    localStorage.setItem('bv_dimming_intensity', value.toString());
  }, []);

  const handleDeleteEntry = useCallback(async (document: Document) => {
    if (isMobileMode || !isUserDocument(document) || !document.storageId) {
      return;
    }

    if (confirm('Are you sure you want to delete this moment? This cannot be undone.')) {
      await deleteEntry(document.storageId);
      await refreshUserEntries();
      setSelectedDocId(null);
    }
  }, [isMobileMode, refreshUserEntries]);

  const handleEditorClose = useCallback(async () => {
    setIsEditing(false);
    setEditorEntry(null);
    await refreshUserEntries();
    await refreshMobileDraftState();
  }, [refreshMobileDraftState, refreshUserEntries]);

  const handleCreateEntry = useCallback(() => {
    setEditorEntry(null);
    setIsEditing(true);
  }, []);

  const handleEditEntry = useCallback((document: Document) => {
    if (isMobileMode || !isUserDocument(document) || !document.storageId) {
      return;
    }

    const entry = userEntries.find((candidate) => candidate.id === document.storageId);

    if (!entry) {
      console.warn(`Could not find user entry for editing: ${document.storageId}`);
      return;
    }

    setSelectedDocId(null);
    setEditorEntry(entry);
    setIsEditing(true);
  }, [isMobileMode, userEntries]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setCategory('all');
  }, []);

  const heroAppendLabel = isMobileMode
    ? (hasLocalMobileDraft ? 'Continue Local Draft' : 'Open Local Draft')
    : 'Append Moment';

  const heroMobileNote = isMobileMode
    ? 'Mobile keeps drafts in this browser only. Use desktop to publish into the archive.'
    : undefined;

  return {
    allDocuments,
    category,
    clearFilters,
    dimmingIntensity,
    editorEntry,
    featuredDocs: FEATURED_DOCUMENTS,
    filteredDocuments,
    handleCreateEntry,
    handleDeleteEntry,
    handleEditEntry,
    handleEditorClose,
    handleIntensityChange,
    hasLocalMobileDraft,
    heroAppendLabel,
    heroMobileNote,
    isEditing,
    isEditMode,
    isLoading,
    isMobileMode,
    refreshMobileDraftState,
    refreshUserEntries,
    scrollProgress,
    searchQuery,
    selectedDoc,
    setCategory,
    setScrollProgress,
    setSearchQuery,
    setSelectedDocId,
    userEntries,
  };
}
