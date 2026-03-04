"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HorizontalScrollSectionProps {
    children: React.ReactNode;
    className?: string;
    showScrollIndicator?: boolean;
    onScrollProgress?: (progress: number) => void;
}

export function HorizontalScrollSection({
    children,
    className,
    showScrollIndicator = true,
    onScrollProgress,
}: HorizontalScrollSectionProps) {
    const targetRef = useRef<HTMLDivElement>(null);
    // 垂直视觉中心触发逻辑 (v4)：
    // offset: ["start center", "end center"]
    // 意味着当 Section 顶部到达屏幕中心时开始计数 (0)，底部离开中心时结束 (1)
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start center", "end center"]
    });

    // Notify parent of scroll progress for particle effects
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (onScrollProgress) {
            onScrollProgress(latest);
        }
    });

    // 空间感布局 (v4)：
    // 30% 留白对称布局：
    // 起始 X = 30vw (左侧留白 30%)
    // 结束 X = 100vw - 30vw - (3张卡片总宽 + 2个间距)
    // 卡片宽 45vw, 间距 6vw (approx. for 6rem)
    // 总宽 = 45*3 + 6*2 = 135 + 12 = 147vw
    // 结束 X = 70vw - 147vw = -77vw

    // Header Opacity (v7): 入场后保持常驻 (0.1 -> 1.0)
    const headerOpacity = useTransform(scrollYProgress,
        [0, 0.1, 1],
        [1, 1, 1]
    );

    // X 轴物理位移 (v5.1)：
    // 0 -> 0.1: 入场定格 (牛顿居中锁定)
    // 0.1 -> 0.9: 漫长的平滑横移
    // 0.9 -> 1.0: 离场定格 (伽利略居中锁定)
    const xRaw = useTransform(
        scrollYProgress,
        [0, 0.1, 0.9, 1],
        ['30vw', '30vw', '-77vw', '-77vw']
    );

    // 物理特性：减小质量 (mass) 使其对滚动更敏感，增加 stiffness
    const x = useSpring(xRaw, {
        damping: 35,
        stiffness: 100,
        mass: 0.8,
    });

    // 缩放：在 0.5 处（第二张卡片居中）时达到最大，增加动感
    const cardScaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.97]);
    const cardScale = useSpring(cardScaleRaw, {
        damping: 25,
        stiffness: 150,
    });

    return (
        <section
            ref={targetRef}
            className={cn('relative h-[800vh] py-0', className)} // 更长的滚动区间以获得更稳的吸附感
        >
            <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
                {/* Section header - 位置上移，腾出空间 */}
                <motion.div
                    style={{ opacity: headerOpacity }}
                    className="absolute top-[8vh] left-0 w-full z-10 pointer-events-none"
                >
                    <div className="container mx-auto px-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-px bg-primary/40" />
                                    <span className="text-display-xs text-primary font-elegant-sans tracking-[0.3em] uppercase">
                                        Archive Collection
                                    </span>
                                </div>
                                <h2 className="font-epic-serif text-5xl md:text-8xl text-foreground font-light leading-none whitespace-nowrap">
                                    Selected <span className="italic ml-4">Works</span>
                                </h2>
                            </div>

                            {showScrollIndicator && (
                                <div className="hidden md:flex flex-col items-end gap-3 text-xs tracking-widest text-muted-foreground/40 mt-4">
                                    <div className="flex items-center gap-4">
                                        <span>Scroll to explore</span>
                                        <span className="w-24 h-px bg-foreground/10" />
                                        <span className="animate-side-to-side text-lg">→</span>
                                    </div>
                                    <span className="font-mono text-[10px] uppercase">/ Timeless Archive</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Horizontal scroll container - 整体重心下移，营造 40% 底部呼吸空间 */}
                <div className="h-full flex items-center justify-center translate-y-[10vh]">
                    <motion.div
                        style={{ x, scale: cardScale }}
                        className="flex gap-[6vw] items-center will-change-transform flex-nowrap"
                    >
                        {children}
                    </motion.div>
                </div>

                {/* Floating background letter - 进一步降低透明度以防冲突 */}
                <div className="absolute left-[5vw] top-1/2 -translate-y-1/2 -z-10 opacity-[0.01] pointer-events-none select-none text-foreground">
                    <span className="font-epic-serif text-[20rem] md:text-[40rem] leading-none">A</span>
                </div>
            </div>
        </section>
    );
}
