"use client";

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

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
                'surface-card group relative block flex-none cursor-pointer overflow-hidden rounded-[28px] scroll-snap-align-start transition-transform duration-500 hover:-translate-y-1',
                aspectRatioClasses[aspectRatio],
                className,
            )}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick?.();
                }
            }}
        >
            <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-[1.5s] cubic-bezier(0.2,0,0.2,1) group-hover:scale-105"
                    sizes={isSmall ? "400px" : "800px"}
                    style={{ objectPosition: focalPoint || 'center' }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_30%)]" />
            </div>

            <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(4,4,4,0.14)_0%,rgba(4,4,4,0.02)_22%,rgba(4,4,4,0.38)_62%,rgba(4,4,4,0.84)_100%)] transition-opacity duration-500 group-hover:opacity-95" />
            <div className="absolute inset-[10px] z-20 rounded-[22px] border border-white/8 opacity-80 transition-all duration-500 group-hover:border-white/14" />

            {floatingTexts && (
                <div className="pointer-events-none absolute inset-0 z-20">
                    {floatingTexts.topLeft && (
                        <div className="absolute left-6 top-6 flex items-center gap-3 rounded-full border border-white/10 bg-black/25 px-3 py-2 backdrop-blur-md">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span className="font-sans text-[9px] font-medium uppercase tracking-[0.22em] text-white/88">
                                {floatingTexts.topLeft}
                            </span>
                        </div>
                    )}

                    {floatingTexts.centerLeft && (
                        <div className="absolute left-5 top-1/2 flex -translate-y-1/2 flex-col items-center gap-3">
                            <div className="h-10 w-px bg-white/18" />
                            <span className="py-2 font-sans text-[8px] uppercase tracking-[0.42em] text-white/44 writing-mode-vertical">
                                {floatingTexts.centerLeft}
                            </span>
                            <div className="h-10 w-px bg-white/18" />
                        </div>
                    )}

                    {floatingTexts.bottomRight && (
                        <div className="absolute bottom-6 right-6 flex flex-col items-end">
                            <span className="mb-0.5 font-sans text-[8px] uppercase tracking-[0.3em] text-white/50">
                                Ref.
                            </span>
                            <span className="font-mono text-[9px] uppercase tracking-widest text-white/78">
                                {floatingTexts.bottomRight}
                            </span>
                        </div>
                    )}
                </div>
            )}

            <div className={cn(
                "pointer-events-none absolute inset-x-4 bottom-4 z-30",
                isSmall ? "md:inset-x-4" : "md:inset-x-6 md:bottom-6",
            )}>
                <div className="surface-panel rounded-[24px] px-4 py-4 md:px-5 md:py-5">
                    <div className="mb-3 flex items-center justify-between gap-4">
                        <span className="font-sans text-[9px] uppercase tracking-[0.32em] text-primary">
                            Archive Entry
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white/72" />
                    </div>

                    <h3 className={cn(
                        "font-epic-serif font-light leading-[1] text-white",
                        isSmall ? "text-2xl md:text-[2rem]" : "text-3xl md:text-5xl",
                    )}>
                        {title}
                    </h3>

                    {(author || year) && (
                        <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.24em] text-white/56">
                            {[author, year].filter(Boolean).join(' • ')}
                        </p>
                    )}

                    {description && (
                        <p className={cn(
                            "mt-4 max-w-xl font-elegant-sans italic leading-relaxed text-white/70 line-clamp-3",
                            isSmall ? "text-sm" : "text-sm md:text-base",
                        )}>
                            — {description}
                        </p>
                    )}
                </div>
            </div>

            <div className="absolute bottom-5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary/80 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        </div>
    );
}
