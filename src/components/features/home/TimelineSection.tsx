"use client";

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Document, ArchiveCategory } from '@/lib/types';
import { ARCHIVE_CATEGORIES } from '@/lib/types';

// Year parser utility: handles BC/AD and negative numbers
export function parseIntYear(yearStr: string): number {
  if (!yearStr) return 0;
  const cleanStr = yearStr.trim().toUpperCase();
  const isBC = /B\.?C\.?E?/.test(cleanStr) || cleanStr.includes("BC") || cleanStr.includes("公元前");
  
  // Extract number
  const matches = cleanStr.match(/-?\d+/);
  if (!matches) return 0;
  
  const num = parseInt(matches[0], 10);
  if (isNaN(num)) return 0;
  
  if (isBC) {
    return -Math.abs(num);
  }
  return num;
}

interface TimelineSectionProps {
  documents: Document[];
  onDocumentSelect: (documentId: string) => void;
}

export function TimelineSection({ documents, onDocumentSelect }: TimelineSectionProps) {
  const [hoveredCategory, setHoveredCategory] = useState<ArchiveCategory | null>(null);

  // 1. Sort documents by chronological year
  const sortedDocs = useMemo(() => {
    return [...documents].sort((a, b) => parseIntYear(a.year) - parseIntYear(b.year));
  }, [documents]);

  // 2. Category statistics breakdown
  const categoryStats = useMemo(() => {
    const counts = {
      Philosophy: 0,
      History: 0,
      Art: 0,
      Technology: 0,
    };
    
    let total = 0;
    documents.forEach((doc) => {
      if (doc.category in counts) {
        counts[doc.category as keyof typeof counts]++;
        total++;
      }
    });

    return ARCHIVE_CATEGORIES.map((cat) => {
      const count = counts[cat] || 0;
      const percentage = total > 0 ? (count / total) * 100 : 0;
      return {
        category: cat,
        count,
        percentage,
      };
    });
  }, [documents]);

  // Donut Chart logic
  const radius = 60;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  
  // Custom theme colors for categories matching Night Museum gold aesthetics
  const categoryColors: Record<ArchiveCategory, { stroke: string; glow: string; text: string }> = {
    Philosophy: {
      stroke: "oklch(0.78 0.12 79)", // Primary Old Gold
      glow: "rgba(219, 184, 102, 0.4)",
      text: "text-amber-200"
    },
    History: {
      stroke: "oklch(0.62 0.15 35)", // Terracotta Gold / Amber
      glow: "rgba(180, 100, 50, 0.4)",
      text: "text-amber-500"
    },
    Art: {
      stroke: "oklch(0.74 0.06 190)", // Soft Bronze Gold / Teal gold accent
      glow: "rgba(100, 180, 190, 0.4)",
      text: "text-cyan-200"
    },
    Technology: {
      stroke: "oklch(0.76 0.08 35)", // Bright Brass / Gold
      glow: "rgba(220, 160, 60, 0.4)",
      text: "text-yellow-400"
    }
  };

  // Generate paths for SVG segments
  let accumulatedPercentage = 0;
  const chartSegments = categoryStats.map((stat) => {
    const percentage = stat.percentage;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const rotation = (accumulatedPercentage / 100) * 360;
    accumulatedPercentage += percentage;

    return {
      ...stat,
      strokeDashoffset,
      rotation,
      colors: categoryColors[stat.category],
    };
  });

  return (
    <section className="container mx-auto px-4 py-24 relative overflow-hidden">
      {/* Decorative Night Museum Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-[#B46432]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mb-16 border-t border-[var(--line-subtle)] pt-12">
        <span className="text-decorative text-primary/80 block mb-3">
          Chronological Chronicle
        </span>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <h2 className="font-epic-serif text-4xl md:text-5xl text-foreground font-light">
              Timeline of Human Knowledge
            </h2>
            <p className="mt-4 max-w-2xl text-reading-soft">
              Explore the records arranged in historical flow, tracking the development of philosophy, science, art, and technology across eras.
            </p>
          </div>

          {/* Elegant SVG Category Statistics Panel */}
          <div className="surface-panel rounded-[24px] p-6 flex flex-col sm:flex-row items-center gap-8 lg:max-w-md w-full border-elegant">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-white/5"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {chartSegments.map((segment) => (
                  <motion.circle
                    key={segment.category}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke={segment.colors.stroke}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ 
                      strokeDashoffset: segment.strokeDashoffset,
                      strokeWidth: hoveredCategory === segment.category ? strokeWidth + 3 : strokeWidth
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    style={{
                      transformOrigin: "80px 80px",
                      transform: `rotate(${segment.rotation}deg)`,
                      filter: hoveredCategory === segment.category 
                        ? `drop-shadow(0 0 6px ${segment.colors.glow})` 
                        : "none"
                    }}
                    onMouseEnter={() => setHoveredCategory(segment.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className="transition-all duration-300 cursor-pointer"
                  />
                ))}
              </svg>
              {/* Inner Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                {hoveredCategory ? (
                  <>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {hoveredCategory}
                    </span>
                    <span className="text-xl font-serif text-primary font-bold">
                      {categoryStats.find(s => s.category === hoveredCategory)?.count}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Total
                    </span>
                    <span className="text-2xl font-serif text-foreground font-light">
                      {documents.length}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Category Legend */}
            <div className="flex flex-col gap-2.5 w-full">
              {categoryStats.map((stat) => {
                const colors = categoryColors[stat.category];
                const isHovered = hoveredCategory === stat.category;
                return (
                  <div
                    key={stat.category}
                    className={`flex items-center justify-between text-xs transition-all duration-200 py-0.5 px-2 rounded-lg cursor-pointer ${
                      isHovered ? "bg-white/5" : "hover:bg-white/5"
                    }`}
                    onMouseEnter={() => setHoveredCategory(stat.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: colors.stroke, boxShadow: `0 0 6px ${colors.glow}` }}
                      />
                      <span className="text-muted-foreground font-medium">{stat.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground/80 font-semibold">{stat.count}</span>
                      <span className="text-muted-foreground/50">({Math.round(stat.percentage)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Track Section */}
      <div className="relative max-w-5xl mx-auto py-12">
        {/* Continuous Central Golden Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/10 via-primary/50 to-primary/10" />
        
        {/* Timeline Items */}
        <div className="relative space-y-16">
          {sortedDocs.map((doc, index) => {
            const isLeft = index % 2 === 0;
            const categoryColor = categoryColors[doc.category]?.stroke || "var(--primary)";

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.3) }}
                className={`relative flex flex-col md:flex-row items-center justify-center w-full`}
              >
                {/* Center Node Indicator */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10 w-4 h-4 rounded-full border-2 bg-background transition-all duration-300 group-hover:scale-125"
                  style={{ borderColor: categoryColor, boxShadow: `0 0 10px ${categoryColor}` }}
                />

                {/* Left/Right Card Container */}
                <div className={`w-full md:w-1/2 px-6 flex ${isLeft ? 'md:justify-end' : 'md:justify-start md:col-start-2'}`}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    onClick={() => onDocumentSelect(doc.id)}
                    className="w-full max-w-md surface-panel rounded-[20px] overflow-hidden border border-white/5 hover:border-primary/40 cursor-pointer p-5 transition-colors group text-left"
                  >
                    {/* Header: Year & Category */}
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <span className="text-lg font-serif text-primary tracking-wide text-glow-gold font-semibold">
                        {doc.year}
                      </span>
                      <span 
                        className="text-[9px] uppercase tracking-[0.2em] font-sans px-2 py-0.5 rounded-full border"
                        style={{ 
                          color: categoryColor,
                          borderColor: `${categoryColor}25`,
                          backgroundColor: `${categoryColor}08`
                        }}
                      >
                        {doc.category}
                      </span>
                    </div>

                    {/* Image Thumbnail (if exists) */}
                    {doc.imageUrl && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden mb-4 bg-muted">
                        <img 
                          src={doc.imageUrl} 
                          alt={doc.title} 
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                      </div>
                    )}

                    {/* Title & Author */}
                    <h3 className="text-md md:text-lg font-serif font-light text-foreground group-hover:text-primary transition-colors duration-200">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-muted-foreground/80 mb-2 italic">
                      by {doc.author}
                    </p>

                    {/* Short Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>
                  </motion.div>
                </div>

                {/* Empty counterpart spacer for desktop grid layout alignment */}
                <div className="hidden md:block w-1/2 px-6" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
