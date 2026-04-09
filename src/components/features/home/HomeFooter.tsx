interface HomeFooterProps {
  userEntryCount: number;
}

export function HomeFooter({ userEntryCount }: HomeFooterProps) {
  return (
    <footer className="container mx-auto px-4 py-12 border-t border-foreground/5 text-muted-foreground/60">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="font-serif text-xl text-foreground">
            Bibliotheca Vitae
          </span>
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="font-sans text-sm">
            Since 2026
          </span>
        </div>
        {userEntryCount > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded">
              {userEntryCount} personal moment{userEntryCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </footer>
  );
}
