"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Tag, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { Document } from "@/lib/types";

interface ExhibitDetailProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExhibitDetail({ document, isOpen, onClose }: ExhibitDetailProps) {
  if (!document) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 overflow-hidden">
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/95 backdrop-blur-3xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-6xl h-full bg-surface-1 hairline-gold shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* Image Section */}
            <div className="relative w-full md:w-1/2 h-64 md:h-full bg-surface-2 group">
              <Image
                src={document.imageUrl}
                alt={document.title}
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              <div className="absolute inset-0 mask-vignette opacity-40 pointer-events-none" />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 h-full flex flex-col overflow-y-auto p-8 md:p-16 scrollbar-hide">
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-primary/10 text-ink-faint hover:text-primary transition-all z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col h-full">
                <div className="mb-12">
                  <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-kicker mb-4 block"
                  >
                    Archive Exhibit No. {document.id.padStart(3, '0')}
                  </motion.span>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-6xl text-glow-gold mb-8 leading-tight"
                  >
                    {document.title}
                  </motion.h2>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-12"
                  >
                    <div className="flex items-center gap-2">
                       <User className="w-3 h-3 text-primary" />
                       {document.author}
                    </div>
                    <div className="flex items-center gap-2">
                       <Calendar className="w-3 h-3 text-primary" />
                       Circa {document.year}
                    </div>
                    <div className="flex items-center gap-2">
                       <Tag className="w-3 h-3 text-primary" />
                       {document.category}
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex-1"
                >
                  <div className="mb-12">
                    <h3 className="text-kicker mb-4">Academic Context</h3>
                    <p className="font-serif italic text-xl md:text-2xl text-reading-soft leading-relaxed">
                      {document.academicContext || document.description}
                    </p>
                  </div>

                  <div className="mb-12">
                    <h3 className="text-kicker mb-4">Archival Narrative</h3>
                    <p className="text-reading-soft text-base leading-relaxed opacity-80">
                      {document.longDescription || "This archival entry represents a significant moment in the chronology of human thought. It serves as a testament to the enduring nature of our collective memory and the pursuit of truth through documentation."}
                    </p>
                  </div>

                  {document.tags && (
                    <div className="flex flex-wrap gap-3 mb-12">
                      {document.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-primary/5 border border-primary/20 text-[9px] uppercase tracking-widest text-primary/80">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-auto pt-12 border-t border-primary/10 flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-[0.4em] text-ink-faint">Date Archived</span>
                    <span className="font-mono text-[9px] text-primary">2026-04-17 / SYSTEM_V3</span>
                  </div>
                  <button className="flex items-center gap-2 btn-minimal rounded-sm px-6 py-3">
                    View Primary Source
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
