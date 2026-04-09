"use client";

import { useCallback, useMemo, useState, type KeyboardEvent } from 'react';
import type { DraftEntry, Entry } from '@/services/storage-repository';

type DraftLikeEntry = Partial<Entry> | DraftEntry | null | undefined;

export function useEntryEditorFormState() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [figure, setFigure] = useState('');
  const [moment, setMoment] = useState('');
  const [narrative, setNarrative] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');

  const applyDraft = useCallback((draft: DraftLikeEntry) => {
    setTitle(draft?.title ?? '');
    setFigure(draft?.figure ?? '');
    setMoment(draft?.moment ?? '');
    setNarrative(draft?.narrative ?? '');
    setKeywords(draft?.keywords ?? []);
    setImage(draft?.imageUrl ?? null);
    setCurrentKeyword('');
  }, []);

  const resetForm = useCallback(() => {
    applyDraft(null);
  }, [applyDraft]);

  const removeKeyword = useCallback((keyword: string) => {
    setKeywords((currentKeywords) => currentKeywords.filter((tag) => tag !== keyword));
  }, []);

  const handleKeywordKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    const trimmedKeyword = currentKeyword.trim();
    if (!trimmedKeyword) {
      return;
    }

    event.preventDefault();
    setKeywords((currentKeywords) => (
      currentKeywords.includes(trimmedKeyword)
        ? currentKeywords
        : [...currentKeywords, trimmedKeyword]
    ));
    setCurrentKeyword('');
  }, [currentKeyword]);

  const draftSnapshot = useMemo<DraftEntry>(() => ({
    figure,
    imageUrl: image || undefined,
    keywords,
    moment,
    narrative,
    title,
  }), [figure, image, keywords, moment, narrative, title]);

  return {
    applyDraft,
    currentKeyword,
    draftSnapshot,
    figure,
    handleKeywordKeyDown,
    image,
    keywords,
    moment,
    narrative,
    removeKeyword,
    resetForm,
    setCurrentKeyword,
    setFigure,
    setImage,
    setKeywords,
    setMoment,
    setNarrative,
    setTitle,
    title,
  };
}
