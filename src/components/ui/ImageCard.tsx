"use client";

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ImageCardProps {
    id: string;
    title: string;
    description?: string;
    year?: string;
    author?: string;
    imageUrl: string;
    floatingTexts?: {
        topLeft?: string;
        centerLeft?: string;
        bottomRight?: string;
    };
    className?: string;
    aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
    focalPoint?: string;
    size?: 'default' | 'small';
    onClick?: () => void; // 新增 onClick 属性
}

export function ImageCard({
    id,
    title,
    description,
    year,
    author,
    imageUrl,
    floatingTexts,
    className,
    aspectRatio = 'video',
    focalPoint,
    size = 'default',
    onClick,
}: ImageCardProps) {
    const aspectRatioClasses = {
        square: 'aspect-square',
        video: 'aspect-video',
        portrait: 'aspect-[3/4]',
        auto: 'aspect-auto',
    };

    const isSmall = size === 'small';

    return (
        <div
            onClick={onClick}
            role="button"
            tabIndex={0}
            data-entry-id={id}
            aria-label={`Open ${title}${author ? ` by ${author}` : ''}${year ? ` (${year})` : ''}`}
            className={cn(
                'group relative block flex-none cursor-pointer overflow-hidden rounded-[2px] transition-all duration-[1.2s] ease-out hover:shadow-2xl',
                aspectRatioClasses[aspectRatio],
                className,
            )}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick?.();
                }
            }}
        >
            {/* Background Image Stage */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-surface-1">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-[2.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    sizes={isSmall ? "400px" : "1200px"}
                    style={{ objectPosition: focalPoint || 'center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
                <div className="absolute inset-0 bg-black/10 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0" />
            </div>

            {/* Hairline Frame */}
            <div className="absolute inset-[1px] z-20 border-[0.5px] border-white/10 opacity-60 transition-all duration-700 group-hover:inset-[12px] group-hover:border-primary/40 group-hover:opacity-100" />

            {/* Floating Metadata */}
            {floatingTexts && (
                <div className="pointer-events-none absolute inset-0 z-20">
                    {floatingTexts.topLeft && (
                        <div className="absolute left-6 top-6 flex items-center gap-3 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: 12 }}
                                className="h-[1px] bg-primary" 
                            />
                            <span className="font-sans text-[8px] font-medium uppercase tracking-[0.4em] text-primary/80">
                                {floatingTexts.topLeft}
                            </span>
                        </div>
                    )}

                    {floatingTexts.centerLeft && (
                        <div className="absolute left-6 top-1/2 flex -translate-y-1/2 flex-col items-center gap-4">
                            <div className="h-12 w-px bg-primary/20" />
                            <span className="py-2 font-sans text-[8px] uppercase tracking-[0.5em] text-white/30 writing-mode-vertical">
                                {floatingTexts.centerLeft}
                            </span>
                            <div className="h-12 w-px bg-primary/20" />
                        </div>
                    )}

                    {floatingTexts.bottomRight && (
                        <div className="absolute bottom-8 right-8 flex flex-col items-end opacity-40 group-hover:opacity-80 transition-opacity duration-700">
                            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
                                {floatingTexts.bottomRight}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Content Overlay */}
            <div className={cn(
                "pointer-events-none absolute inset-x-6 bottom-6 z-30 transition-transform duration-700 group-hover:translate-y-[-10px]",
                isSmall ? "md:inset-x-8 md:bottom-8" : "md:inset-x-12 md:bottom-12",
            )}>
                <div className="mb-4">
                    <span className="text-kicker mb-3 block opacity-0 translate-y-4 transition-all duration-700 group-hover:opacity-100 group-hover:translate-y-0">
                        {author || "Archival Entry"}
                    </span>
                    <h3 className={cn(
                        "font-serif font-light leading-[1.05] text-white text-glow-gold",
                        isSmall ? "text-3xl md:text-5xl" : "text-5xl md:text-7xl lg:text-8xl",
                    )}>
                        {title}
                    </h3>
                </div>

                {description && (
                    <p className={cn(
                        "max-w-xl font-serif italic leading-relaxed text-reading-soft opacity-0 translate-y-4 transition-all duration-1000 delay-100 group-hover:opacity-80 group-hover:translate-y-0",
                        isSmall ? "text-sm" : "text-sm md:text-lg",
                    )}>
                        {description}
                    </p>
                )}
                
                <div className="mt-8 overflow-hidden h-px w-0 bg-primary/40 transition-all duration-1000 delay-300 group-hover:w-full" />
            </div>

            {/* Highlight Line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-1000 ease-out group-hover:w-full" />
        </div>
    );
}
