"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ImageCard } from "@/components/ui/ImageCard";
import type { Document } from "@/lib/types";

interface ArchiveBrowserProps {
  documents: Document[];
  onDocumentClick?: (doc: Document) => void;
}

export function ArchiveBrowser({ documents, onDocumentClick }: ArchiveBrowserProps) {
  const categories = ["all", "Art", "Technology", "Philosophy"];
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredDocs = activeCategory === "all" 
    ? documents 
    : documents.filter(doc => doc.category === activeCategory);

  return (
    <section className="py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-primary/10 pb-8">
          <div>
            <span className="text-kicker mb-2 block">Archive Index</span>
            <h2 className="text-3xl md:text-5xl text-glow-gold">Collection Directory</h2>
          </div>

          <div className="flex gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-all rounded-sm ${
                  activeCategory === cat 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "text-ink-faint hover:text-ink-strong"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDocs.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 3) * 0.1, duration: 0.6 }}
            >
              <ImageCard 
                id={doc.id}
                title={doc.title}
                author={doc.author}
                imageUrl={doc.imageUrl}
                aspectRatio="square"
                size="small"
                onClick={() => onDocumentClick?.(doc)}
              />
            </motion.div>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div className="py-32 text-center">
            <p className="font-serif italic text-ink-faint">No records found for this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
