"use client";

import type { ChangeEvent, RefObject } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RotateCcw, Trash2 } from 'lucide-react';

interface EntryEditorHeroProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  image: string;
  isEditMode: boolean;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void | Promise<void>;
  onRemoveImage: () => void;
  onTitleChange: (value: string) => void;
  title: string;
}

export function EntryEditorHero({
  fileInputRef,
  image,
  isEditMode,
  onImageUpload,
  onRemoveImage,
  onTitleChange,
  title,
}: EntryEditorHeroProps) {
  return (
    <header className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden group">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt="Hero background"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors"
            title="Change Image"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onRemoveImage}
            className="p-2 bg-red-500/60 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md transition-colors"
            title="Remove Image"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageUpload}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:px-12 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <input
            type="text"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Enter Title..."
            className="w-full bg-transparent font-epic-serif text-5xl md:text-7xl lg:text-8xl text-white font-light leading-[0.95] mb-6 drop-shadow-lg placeholder:text-white/20 outline-none border-none p-0 focus:ring-0"
          />

          <p className="font-elegant-sans text-lg md:text-xl text-white/60 italic font-light max-w-2xl">
            — {isEditMode
              ? 'Editing an archived moment. Scroll to revise the narrative.'
              : 'Visual Anchor Established. Scroll to edit details.'}
          </p>
        </motion.div>
      </div>
    </header>
  );
}
