"use client";

import type { ChangeEvent, RefObject } from 'react';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';

interface EntryEditorImageStageProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  isEditMode: boolean;
  mobileDraftMode: boolean;
  onClose?: () => void;
  onCloseEditor: () => void | Promise<void>;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void | Promise<void>;
}

export function EntryEditorImageStage({
  fileInputRef,
  isEditMode,
  mobileDraftMode,
  onClose,
  onCloseEditor,
  onImageUpload,
}: EntryEditorImageStageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-paper p-6 relative">
      {onClose && (
        <button
          onClick={() => void onCloseEditor()}
          className="absolute top-8 left-8 p-3 bg-foreground/5 hover:bg-foreground/10 rounded-full transition-colors z-50 group"
          title="Close Editor"
        >
          <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl aspect-video border-2 border-dashed border-primary/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors group relative overflow-hidden"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageUpload}
        />

        <div className="z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div className="text-center">
            <h2 className="font-epic-serif text-2xl text-foreground mb-2">
              {isEditMode ? 'Update Artifact Image' : 'Upload Artifact Image'}
            </h2>
            <p className="font-sans text-sm text-muted-foreground tracking-widest uppercase">
              Drag &amp; drop or click to browse
            </p>
            {mobileDraftMode && (
              <p className="mt-3 text-[11px] tracking-[0.24em] text-muted-foreground/50 uppercase">
                Local Draft Mode on this device
              </p>
            )}
          </div>
        </div>

        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 -translate-x-1 -translate-y-1" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40 translate-x-1 -translate-y-1" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/40 -translate-x-1 translate-y-1" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 translate-x-1 translate-y-1" />
      </motion.div>
    </div>
  );
}
