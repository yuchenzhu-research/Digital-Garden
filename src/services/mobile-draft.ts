import { del, get, set } from 'idb-keyval';
import type { DraftEntry } from './storage-repository';

const MOBILE_DRAFT_KEY = 'bibliotheca_mobile_draft';

export const saveMobileDraft = async (draft: DraftEntry): Promise<void> => {
  await set(MOBILE_DRAFT_KEY, draft);
};

export const getMobileDraft = async (): Promise<DraftEntry | null> => {
  const draft = await get<DraftEntry>(MOBILE_DRAFT_KEY);
  return draft ?? null;
};

export const clearMobileDraft = async (): Promise<void> => {
  await del(MOBILE_DRAFT_KEY);
};

export const hasMobileDraft = async (): Promise<boolean> => {
  return (await getMobileDraft()) !== null;
};
