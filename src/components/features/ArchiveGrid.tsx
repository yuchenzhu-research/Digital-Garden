import { useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { ImageCard } from '@/components/ui/ImageCard';
import { documents } from '@/lib/data';

interface ArchiveGridProps {
    onCardClick?: (id: string) => void;
    showAll?: boolean;
}

export function ArchiveGrid({ onCardClick, showAll = false }: ArchiveGridProps) {
    // Scroll to archive grid
    const scrollToArchive = useCallback(() => {
        const element = document.getElementById('archive-grid');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (
        <section id="archive-grid" className="container mx-auto px-4 py-20">
            <div className="mb-16">
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-decorative text-muted-foreground/60 block mb-3">
                            Complete Collection
                        </span>
                        <h2 className="font-epic-serif text-4xl md:text-5xl text-foreground font-light">
                            Browse Archive
                        </h2>
                    </div>
                    <button
                        onClick={scrollToArchive}
                        className="hidden md:flex items-center gap-3 px-6 py-3 border border-foreground/20 hover:border-foreground/40 transition-colors duration-300"
                    >
                        <span className="font-sans text-sm tracking-widest uppercase">
                            View All
                        </span>
                        <ArrowRight className="w-4 h-4 opacity-60" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/5 border border-foreground/5">
                {(showAll ? documents : documents.slice(0, 6)).map((doc) => (
                    <div
                        key={doc.id}
                        className="group relative aspect-square overflow-hidden bg-card"
                    >
                        <ImageCard
                            id={doc.id}
                            title={doc.title}
                            description={doc.description}
                            year={doc.year}
                            author={doc.author}
                            imageUrl={doc.imageUrl}
                            floatingTexts={{ topLeft: doc.category }}
                            aspectRatio="square"
                            size="small"
                            className="h-full w-full border-none"
                            focalPoint={doc.focalPoint}
                            onClick={() => onCardClick?.(doc.id)}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
