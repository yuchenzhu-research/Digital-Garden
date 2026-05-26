"use client";

interface HomeFooterProps {
  userEntryCount: number;
}

export function HomeFooter({ userEntryCount }: HomeFooterProps) {
  return (
    <footer className="container mx-auto border-t border-[var(--line-subtle)] px-4 py-12 text-muted-foreground/60">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="font-serif text-xl text-foreground">
            Bibliotheca Vitae
          </span>
          <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_20px_rgba(219,184,102,0.45)]" />
          <span className="font-sans text-sm uppercase tracking-[0.22em] text-muted-foreground/70">
            Since 2026
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {userEntryCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 text-primary">
                {userEntryCount} personal moment{userEntryCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
