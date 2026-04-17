"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ARCHIVE_CATEGORIES, type ArchiveCategory } from '@/lib/types';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchBar({
    value,
    onChange,
    placeholder = "Search archive...",
    className
}: SearchBarProps) {
    const [isFocused, setIsFocused] = useState(false);

    const handleClear = useCallback(() => {
        onChange('');
    }, [onChange]);

    return (
        <div className={cn('relative', className)}>
            <motion.div
                animate={{
                    boxShadow: isFocused
                        ? '0 0 0 1px rgba(219, 184, 102, 0.32), 0 0 0 4px rgba(219, 184, 102, 0.08)'
                        : '0 0 0 0 transparent'
                }}
                className={cn(
                    'surface-panel flex items-center gap-3 rounded-full px-4 py-3 transition-colors',
                    isFocused ? 'border-primary/40' : ''
                )}
            >
                <Search className={cn(
                    'w-4 h-4 transition-colors',
                    isFocused ? 'text-primary' : 'text-muted-foreground'
                )} />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground/50"
                />
                <AnimatePresence>
                    {value && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={handleClear}
                            className="rounded-full p-1 transition-colors hover:bg-white/10"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

// ============================================================================
// Category Filter Component
// ============================================================================

type Category = 'all' | ArchiveCategory;

const CATEGORIES: Array<{ key: Category; label: string; icon: LucideIcon }> = [
    { key: 'all', label: 'All', icon: Filter },
    ...ARCHIVE_CATEGORIES.map((category) => ({
        key: category,
        label: category,
        icon: Filter,
    })),
];

interface CategoryFilterProps {
    value: Category;
    onChange: (value: Category) => void;
    className?: string;
}

export function CategoryFilter({
    value,
    onChange,
    className
}: CategoryFilterProps) {
    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = value === cat.key;

                return (
                    <motion.button
                        key={cat.key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onChange(cat.key)}
                        className={cn(
                            'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-sans tracking-wide transition-colors backdrop-blur-md',
                            isActive
                                ? 'border border-primary/20 bg-primary/12 text-primary'
                                : 'border border-white/8 bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground'
                        )}
                    >
                        <Icon className="w-3 h-3" />
                        <span>{cat.label}</span>
                    </motion.button>
                );
            })}
        </div>
    );
}

// Combined Filter Bar
interface FilterBarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    categoryValue: Category;
    onCategoryChange: (value: Category) => void;
    className?: string;
}

export function FilterBar({
    searchValue,
    onSearchChange,
    categoryValue,
    onCategoryChange,
    className
}: FilterBarProps) {
    return (
        <div className={cn('flex flex-col items-start justify-between gap-4 md:flex-row md:items-center', className)}>
            <CategoryFilter
                value={categoryValue}
                onChange={onCategoryChange}
            />
            <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search by title, figure, or keyword..."
                className="w-full md:w-80"
            />
        </div>
    );
}

export type { CategoryFilterProps };
export { type Category };
