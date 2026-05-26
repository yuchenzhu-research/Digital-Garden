"use client";

import { useDataManagementController } from '@/hooks/useDataManagementController';
import { Download, Upload, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeFooterProps {
  userEntryCount: number;
  onDataChanged?: () => void;
}

export function HomeFooter({ userEntryCount, onDataChanged }: HomeFooterProps) {
  const {
    fileInputRef,
    handleExport,
    handleFileImport,
    handleImportClick,
    importMessage,
    importStatus,
    isExporting,
    isImporting,
  } = useDataManagementController({ onDataChanged });

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

          <div className="flex items-center gap-2">
            {importStatus !== 'idle' && (
              <span className={cn(
                "text-[10px] px-2.5 py-1 rounded-full border",
                importStatus === 'success'
                  ? "bg-green-500/5 border-green-500/20 text-green-400"
                  : "bg-red-500/5 border-red-500/20 text-red-400"
              )}>
                {importMessage}
              </span>
            )}
            <button
              onClick={handleExport}
              disabled={isExporting || isImporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-[10px] uppercase tracking-wider font-sans transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isExporting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
              Export
            </button>
            <button
              onClick={handleImportClick}
              disabled={isExporting || isImporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-[10px] uppercase tracking-wider font-sans transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isImporting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
              Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
