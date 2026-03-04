"use client";

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

import Link from 'next/link';

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
            className={cn(
                'group relative overflow-hidden bg-warm-paper border-elegant flex-none scroll-snap-align-start block cursor-pointer transition-transform duration-300 hover:scale-[1.01]',
                aspectRatioClasses[aspectRatio],
                className
            )}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick?.();
                }
            }}
        >
            <div className="absolute inset-0 overflow-hidden z-0">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-[1.5s] cubic-bezier(0.2, 0, 0.2, 1) group-hover:scale-110"
                    sizes={isSmall ? "400px" : "800px"}
                    style={{ objectPosition: focalPoint || 'center' }}
                />
                <div className="absolute inset-0 bg-black/5 transition-opacity duration-700 group-hover:opacity-0" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500 z-10" />

            {floatingTexts && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {floatingTexts.topLeft && (
                        <div className="absolute top-6 left-6 flex items-center gap-3">
                            <div className="w-1 h-1 rounded-full bg-primary" />
                            <span className="font-sans text-[9px] font-medium tracking-[0.2em] text-white/90 uppercase">
                                {floatingTexts.topLeft}
                            </span>
                        </div>
                    )}

                    {floatingTexts.centerLeft && (
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
                            <div className="w-px h-8 bg-white/20" />
                            <span className="font-sans text-[8px] uppercase tracking-[0.4em] text-white/40 writing-mode-vertical py-2">
                                {floatingTexts.centerLeft}
                            </span>
                            <div className="w-px h-8 bg-white/20" />
                        </div>
                    )}

                    {floatingTexts.bottomRight && (
                        <div className="absolute bottom-6 right-6 flex flex-col items-end">
                            <span className="font-sans text-[8px] tracking-[0.3em] text-white/50 uppercase mb-0.5">
                                Ref.
                            </span>
                            <span className="font-mono text-[9px] tracking-widest text-white/80 uppercase">
                                {floatingTexts.bottomRight}
                            </span>
                        </div>
                    )}
                </div>
            )}

            <div className={cn(
                "absolute inset-0 flex flex-col justify-end z-30 pointer-events-none",
                isSmall ? "p-10" : "p-12 md:p-16"
            )}>
                <div className="translate-y-4 opacity-0 transition-all duration-700 delay-100 group-hover:translate-y-0 group-hover:opacity-100 h-full flex flex-col justify-end">
                    <div className={isSmall ? "mb-8" : "mb-10"}>
                        <span className={cn(
                            "font-sans tracking-[0.4em] text-primary/90 font-medium uppercase flex items-center gap-3 border-l-2 border-primary pl-4 group-hover:pl-6 transition-all duration-300",
                            isSmall ? "text-[11px] mb-4" : "text-[11px] mb-4"
                        )}>
                            Archive Entry
                            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </span>
                        <h3 className={cn(
                            "font-epic-serif text-white font-light leading-[1.05] drop-shadow-sm",
                            isSmall ? "text-3xl md:text-4xl mb-6 max-w-sm" : "text-4xl md:text-6xl mb-8 max-w-2xl"
                        )}>
                            {title}
                        </h3>
                        <div className="h-px w-0 bg-white/10 group-hover:w-full transition-all duration-1000 ease-out" />
                    </div>

                    {description && (
                        <div className="relative">
                            <p className={cn(
                                "font-elegant-sans text-white/50 leading-relaxed max-w-xl line-clamp-3 italic font-light",
                                isSmall ? "text-sm md:text-base" : "text-sm md:text-lg"
                            )}>
                                — {description}
                            </p>
                            <div className="absolute -left-6 top-0 bottom-0 w-px bg-white/5" />
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute bottom-12 right-1/2 translate-x-1/2 w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-500" />
            <div className="absolute inset-4 border border-white/0 group-hover:border-white/10 transition-all duration-700 pointer-events-none" />
        </div>
    );
}
