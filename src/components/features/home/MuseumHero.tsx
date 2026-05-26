"use client";

import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";

interface MuseumHeroProps {
  title?: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
  onAppend?: () => void;
  appendLabel?: string;
  mobileNote?: string;
}

const letterVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.6 + i * 0.04,
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function MuseumHero({
  title = "Bibliotheca Vitae",
  subtitle = "A personal archive of moments, curated in time.",
  appendLabel = "Append Moment",
  onAppend,
  onSearch,
  mobileNote,
}: MuseumHeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background Stage */}
      <div className="absolute inset-0 -z-10 bg-black">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.45 }}
          transition={{ duration: 4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-[url('/archive/museum-hero.png')] bg-cover bg-center will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        <div className="absolute inset-0 mask-vignette bg-background/30" />
      </div>

      {/* Hero Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl w-full text-center"
      >
        <motion.span variants={itemVariants} className="text-kicker mb-6 block">
          Private Archive No. 88
        </motion.span>

        {/* Staggered Letter Reveal Title */}
        <h1 className="text-6xl md:text-8xl lg:text-[10rem] mb-8 text-glow-gold leading-[0.9] tracking-tighter" style={{ perspective: "800px" }}>
          {title.split("").map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="inline-block"
              style={{ transformOrigin: "bottom center" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl font-serif italic text-reading-soft max-w-2xl mx-auto mb-14 leading-relaxed"
        >
          {subtitle}
        </motion.p>

        {/* Action Bar */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row items-center justify-center gap-5 max-w-3xl mx-auto"
        >
          {/* Search Bar with Glassmorphism */}
          <div className="w-full relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-primary/30 group-focus-within:text-primary transition-colors duration-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Examine the archive..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full surface-glass rounded-[4px] py-5 pl-14 pr-8 text-sm text-foreground focus:outline-none focus:border-primary/20 transition-all duration-500 placeholder:text-ink-faint/30 font-sans tracking-wide focus:shadow-[0_0_30px_rgba(219,184,102,0.08)]"
            />
            <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-primary/60 via-primary/40 to-transparent transition-all duration-700 group-focus-within:w-full" />
          </div>

          {/* CTA Button with Pulsing Glow */}
          <button
            onClick={onAppend}
            className="relative whitespace-nowrap btn-minimal rounded-[4px] px-10 py-5 flex items-center gap-3 group border-white/10 overflow-hidden"
          >
            {/* Pulsing glow background */}
            <motion.div
              className="absolute inset-0 rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              animate={{
                boxShadow: [
                  "inset 0 0 20px rgba(219,184,102,0.0)",
                  "inset 0 0 20px rgba(219,184,102,0.15)",
                  "inset 0 0 20px rgba(219,184,102,0.0)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <Plus className="w-4 h-4 text-primary group-hover:rotate-180 transition-transform duration-700" />
            <span className="text-[10px] uppercase font-sans tracking-[0.3em] font-medium">
              {appendLabel}
            </span>
          </button>
        </motion.div>

        {mobileNote && (
          <motion.div
            variants={itemVariants}
            className="mt-12 flex items-center justify-center gap-4 opacity-40"
          >
            <div className="h-px w-8 bg-primary/20" />
            <p className="text-[9px] uppercase tracking-[0.4em] text-ink-faint italic max-w-xs">
              {mobileNote}
            </p>
            <div className="h-px w-8 bg-primary/20" />
          </motion.div>
        )}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[8px] uppercase tracking-[0.4em] text-ink-faint/40">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
