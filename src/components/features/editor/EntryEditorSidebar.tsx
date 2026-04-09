"use client";

import type { KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

interface EntryEditorSidebarProps {
  currentKeyword: string;
  figure: string;
  isEditMode: boolean;
  keywords: string[];
  lastSaved: Date | null;
  mobileDraftMode: boolean;
  onFigureChange: (value: string) => void;
  onKeywordChange: (value: string) => void;
  onKeywordKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onRemoveKeyword: (keyword: string) => void;
}

export function EntryEditorSidebar({
  currentKeyword,
  figure,
  isEditMode,
  keywords,
  lastSaved,
  mobileDraftMode,
  onFigureChange,
  onKeywordChange,
  onKeywordKeyDown,
  onRemoveKeyword,
}: EntryEditorSidebarProps) {
  return (
    <aside className="lg:col-span-4 space-y-12 mb-16 lg:mb-0">
      <div>
        <h3 className="font-sans text-xs tracking-widest text-muted-foreground uppercase mb-4 border-l-2 border-primary pl-4">
          Figure
        </h3>
        <input
          type="text"
          value={figure}
          onChange={(event) => onFigureChange(event.target.value)}
          placeholder="Name of Figure..."
          className="w-full bg-transparent font-epic-serif text-2xl text-foreground placeholder:text-muted-foreground/30 outline-none border-none p-0 focus:ring-0"
        />
      </div>

      <div>
        <h3 className="font-sans text-xs tracking-widest text-muted-foreground uppercase mb-4 border-l-2 border-primary pl-4">
          Keywords
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <AnimatePresence>
            {keywords.map((keyword) => (
              <motion.span
                key={keyword}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-sans rounded-sm group cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={() => onRemoveKeyword(keyword)}
              >
                {keyword}
                <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        <div className="relative">
          <input
            type="text"
            value={currentKeyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            onKeyDown={onKeywordKeyDown}
            placeholder="Add keyword + Enter..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none border-b border-muted focus:border-primary transition-colors py-1"
          />
          <Plus className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
        </div>
      </div>

      {!isEditMode && lastSaved && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-1 text-xs text-muted-foreground/50"
        >
          <p>Draft autosaved locally {lastSaved.toLocaleTimeString()}</p>
          <p>
            {mobileDraftMode
              ? 'This draft stays in this browser. Open desktop mode when you are ready to archive it.'
              : 'Unpublished changes stay on this device until you publish them to the archive.'}
          </p>
        </motion.div>
      )}

      {mobileDraftMode && !isEditMode && (
        <div className="space-y-3 rounded-2xl border border-foreground/10 bg-card/40 p-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-muted-foreground/60">
            Local Draft Mode
          </p>
          <p className="text-sm text-muted-foreground">
            Mobile keeps drafts on this device only. Formal archive publishing remains a desktop action.
          </p>
        </div>
      )}
    </aside>
  );
}
