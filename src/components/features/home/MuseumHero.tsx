"use client";

import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MuseumHeroProps {
  title?: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
  onAppend?: () => void;
  appendLabel?: string;
  mobileNote?: string;
}

export function MuseumHero({
  title = "Bibliotheca Vitae",
  subtitle = "A personal archive of moments, curated in time.",
  appendLabel = "Append Moment",
  onAppend,
  mobileNote
}: MuseumHeroProps) {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background Stage */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-[url('/archive/museum-hero.png')] bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background" />
        <div className="absolute inset-0 mask-vignette bg-background/20" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.2, 0, 0.2, 1] }}
        >
          <span className="text-kicker mb-6 block">Exhibition No. 01</span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl mb-8 text-glow-gold">
            {title}
          </h1>
          <p className="text-xl md:text-2xl font-serif italic text-reading-soft max-w-2xl mx-auto mb-12">
            {subtitle}
          </p>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto"
        >
          {/* Main Search/Entry Bar */}
          <div className="w-full relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary/40 group-focus-within:text-primary/70 transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder="Search the archive..." 
              className="w-full bg-surface-floating/40 backdrop-blur-xl border border-white/5 rounded-full py-4 pl-12 pr-6 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:bg-surface-floating/60 transition-all placeholder:text-ink-faint/50"
            />
          </div>

          {/* Quick Append Button */}
          <button 
            onClick={onAppend}
            className="whitespace-nowrap btn-minimal rounded-full px-8 py-4 flex items-center gap-2 group"
          >
            <Plus className="w-4 h-4 text-primary group-hover:rotate-90 transition-transform duration-500" />
            {appendLabel}
          </button>
        </motion.div>

        {mobileNote && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.5, duration: 2 }}
            className="mt-8 text-[10px] uppercase tracking-widest text-ink-faint italic"
          >
            {mobileNote}
          </motion.p>
        )}
      </div>

      {/* Decorative Bottom Line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-primary/40 to-transparent" />
    </section>
  );
}
