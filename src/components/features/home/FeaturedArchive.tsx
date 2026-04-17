"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ImageCard } from "@/components/ui/ImageCard";
import type { Document } from "@/lib/types";

interface FeaturedArchiveProps {
  documents: Document[];
  onDocumentClick?: (doc: Document) => void;
}

export function FeaturedArchive({ documents, onDocumentClick }: FeaturedArchiveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <section ref={containerRef} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-20">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-kicker mb-4"
          >
            Curated Collections
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl text-glow-gold max-w-2xl"
          >
            Archives of the Great Minds
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Large Card */}
          <motion.div 
            style={{ y: y1 }}
            className="lg:col-span-8"
          >
            {documents[0] && (
              <ImageCard 
                id={documents[0].id}
                title={documents[0].title}
                description={documents[0].description}
                author={documents[0].author}
                imageUrl={documents[0].imageUrl}
                floatingTexts={{
                  topLeft: "Primary Exhibit",
                  centerLeft: documents[0].year,
                  bottomRight: "Ref. " + documents[0].id.padStart(3, '0')
                }}
                aspectRatio="video"
                onClick={() => onDocumentClick?.(documents[0])}
              />
            )}
          </motion.div>

          {/* Secondary Stacked Cards */}
          <div className="lg:col-span-4 flex flex-col gap-12 pt-0 lg:pt-32">
            {documents.slice(1, 3).map((doc, index) => (
              <motion.div 
                key={doc.id}
                style={{ y: index === 0 ? y2 : y1 }}
              >
                <ImageCard 
                  size="small"
                  id={doc.id}
                  title={doc.title}
                  description={doc.description}
                  author={doc.author}
                  imageUrl={doc.imageUrl}
                  floatingTexts={{
                    topLeft: "Archive",
                    centerLeft: doc.year,
                    bottomRight: "Ref. " + doc.id.padStart(3, '0')
                  }}
                  aspectRatio="square"
                  onClick={() => onDocumentClick?.(doc)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
