"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Save, Trash2 } from 'lucide-react';

interface EntryEditorActionsProps {
  isEditMode: boolean;
  isPublishing: boolean;
  mobileDraftMode: boolean;
  onCloseEditor: () => void | Promise<void>;
  onDiscardDraft: () => void | Promise<void>;
  onPublish: () => void | Promise<void>;
}

export function EntryEditorActions({
  isEditMode,
  isPublishing,
  mobileDraftMode,
  onCloseEditor,
  onDiscardDraft,
  onPublish,
}: EntryEditorActionsProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-8 right-8 z-50"
    >
      {mobileDraftMode && !isEditMode ? (
        <div className="flex items-center gap-3">
          <button
            onClick={() => void onDiscardDraft()}
            className="flex items-center gap-2 px-5 py-4 bg-background/90 text-foreground rounded-full shadow-2xl border border-foreground/10 hover:bg-background transition-all hover:scale-105 active:scale-95 font-sans tracking-widest uppercase text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Discard Draft
          </button>
          <button
            onClick={() => void onCloseEditor()}
            className="flex items-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-full shadow-2xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 group font-sans tracking-widest uppercase text-sm"
          >
            <Save className="w-4 h-4" />
            Keep Local Draft
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => void onPublish()}
            disabled={isPublishing}
            className="flex items-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-full shadow-2xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 group font-sans tracking-widest uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isPublishing
              ? (isEditMode ? 'Updating...' : 'Preserving...')
              : (isEditMode ? 'Update Archive Entry' : 'Publish to Archive')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-8 right-0 text-[10px] text-muted-foreground/40 font-sans tracking-widest"
          >
            Cmd+S or Ctrl+S to save
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
