"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import entryService from '@/services/entryService';
import {
  clearMobileDraft,
  getMobileDraft,
  saveMobileDraft,
} from '@/services/mobile-draft';
import type { DraftEntry, Entry } from '@/services/storage-repository';

interface DraftStorageClient {
  clear: () => Promise<void>;
  get: () => Promise<DraftEntry | null>;
  save: (draft: DraftEntry) => Promise<void>;
}

interface UseEntryEditorDraftBridgeOptions {
  applyDraft: (draft: DraftEntry | Entry | null | undefined) => void;
  draftSnapshot: DraftEntry;
  initialEntry?: Entry;
  isEditMode: boolean;
  mobileDraftMode: boolean;
  onClose?: () => void;
  onDraftStateChange?: () => void;
  resetForm: () => void;
}

const hasDraftContent = (draft: DraftEntry): boolean => {
  return Boolean(
    draft.figure ||
    draft.imageUrl ||
    draft.keywords?.length ||
    draft.moment ||
    draft.narrative ||
    draft.title
  );
};

export function useEntryEditorDraftBridge({
  applyDraft,
  draftSnapshot,
  initialEntry,
  isEditMode,
  mobileDraftMode,
  onClose,
  onDraftStateChange,
  resetForm,
}: UseEntryEditorDraftBridgeOptions) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const draftStorage = useMemo<DraftStorageClient>(() => {
    if (mobileDraftMode) {
      return {
        clear: clearMobileDraft,
        get: getMobileDraft,
        save: saveMobileDraft,
      };
    }

    return {
      clear: entryService.clearDraft,
      get: entryService.getDraft,
      save: entryService.saveDraft,
    };
  }, [mobileDraftMode]);

  const clearDraftStorage = useCallback(async () => {
    await draftStorage.clear();
    setLastSaved(null);
    onDraftStateChange?.();
  }, [draftStorage, onDraftStateChange]);

  const persistDraft = useCallback(async (draft: DraftEntry) => {
    if (isEditMode) {
      return;
    }

    if (!hasDraftContent(draft)) {
      await clearDraftStorage();
      return;
    }

    await draftStorage.save({
      ...draft,
      dateModified: new Date().toISOString(),
    });
    setLastSaved(new Date());
    onDraftStateChange?.();
  }, [clearDraftStorage, draftStorage, isEditMode, onDraftStateChange]);

  useEffect(() => {
    if (isEditMode && initialEntry) {
      applyDraft(initialEntry);
      return;
    }

    let cancelled = false;

    const loadDraft = async () => {
      const savedEntry = await draftStorage.get();
      if (!cancelled && savedEntry) {
        applyDraft(savedEntry);
      }
    };

    void loadDraft();

    return () => {
      cancelled = true;
    };
  }, [applyDraft, draftStorage, initialEntry, isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      return;
    }

    const timer = window.setTimeout(() => {
      void persistDraft(draftSnapshot);
    }, 1500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [draftSnapshot, isEditMode, persistDraft]);

  const discardDraft = useCallback(async () => {
    if (isEditMode) {
      return;
    }

    resetForm();
    await clearDraftStorage();
    onClose?.();
  }, [clearDraftStorage, isEditMode, onClose, resetForm]);

  const closeEditor = useCallback(async () => {
    if (!isEditMode) {
      await persistDraft(draftSnapshot);
    }

    onClose?.();
  }, [draftSnapshot, isEditMode, onClose, persistDraft]);

  return {
    clearDraftStorage,
    closeEditor,
    discardDraft,
    lastSaved,
    persistDraft,
  };
}
