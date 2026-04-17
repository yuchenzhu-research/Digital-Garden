"use client";

import { motion } from "framer-motion";

export function ArchivalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-24 px-6 border-t border-primary/10 bg-background overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        <div className="max-w-md">
          <h2 className="text-2xl text-glow-gold mb-6">Bibliotheca Vitae</h2>
          <p className="font-serif italic text-ink-soft mb-8 leading-relaxed">
            "A library of lives, where every moment is a manuscript and every archive is a sanctuary for the narrative of time."
          </p>
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-ink-faint mb-1">Archive ID</span>
              <span className="font-mono text-xs text-primary">BV-001-CORE</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-ink-faint mb-1">Status</span>
              <span className="font-mono text-xs text-primary">LOCAL_ONLY</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end text-[10px] uppercase tracking-[0.3em] text-ink-faint gap-4">
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Documents</a>
            <a href="#" className="hover:text-primary transition-colors">Philosophy</a>
            <a href="#" className="hover:text-primary transition-colors">Chronology</a>
          </div>
          <p className="mt-8">
            &copy; {currentYear} Bibliotheca Vitae — Built for the Renaissance of Personal Data.
          </p>
        </div>
      </div>

      {/* Decorative Stamp */}
      <div className="absolute bottom-12 right-12 w-24 h-24 border border-primary/10 rounded-full flex items-center justify-center opacity-20 rotate-12">
        <span className="text-[8px] uppercase tracking-[0.4em] text-primary text-center leading-tight">
          Curated<br/>Archive<br/>System
        </span>
      </div>
    </footer>
  );
}
