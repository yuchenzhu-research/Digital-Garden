"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { ImageCard } from "@/components/ui/ImageCard";
import type { Document } from "@/lib/types";

interface CuratedShelfProps {
  documents: Document[];
  onDocumentClick?: (doc: Document) => void;
}

export function CuratedShelf({ documents, onDocumentClick }: CuratedShelfProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative py-24 bg-surface-1/30">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
        <div>
          <span className="text-kicker mb-2 block">Private Shelf</span>
          <h2 className="text-3xl md:text-5xl text-glow-gold">Personal Moments</h2>
        </div>
        <div className="hidden md:flex gap-2">
            <span className="text-[10px] uppercase tracking-widest text-ink-faint">Swipe to explore archive</span>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex gap-8 overflow-x-auto pb-12 px-6 md:px-[calc((100vw-80rem)/2+1.5rem)] scrollbar-hide snap-x translate-z-0"
      >
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
            className="flex-none w-[300px] md:w-[450px] snap-start"
          >
            <ImageCard 
              id={doc.id}
              title={doc.title}
              author={doc.author}
              imageUrl={doc.imageUrl}
              aspectRatio="portrait"
              size="small"
              onClick={() => onDocumentClick?.(doc)}
              className="grayscale hover:grayscale-0 transition-[filter] duration-700"
            />
          </motion.div>
        ))}

        {/* Empty shelf placeholder */}
        <div className="flex-none w-[300px] h-[400px] border border-dashed border-primary/20 flex flex-col items-center justify-center text-ink-faint rounded-[2px]">
            <span className="text-[10px] uppercase tracking-[0.4em]">Empty Shelf</span>
        </div>
      </div>

      {/* Shelf Line */}
      <div className="absolute bottom-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
