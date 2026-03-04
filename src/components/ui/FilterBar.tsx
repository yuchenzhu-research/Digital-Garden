"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

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
                        ? '0 0 0 2px rgba(var(--primary), 0.2)'
                        : '0 0 0 0 transparent'
                }}
                className={cn(
                    'flex items-center gap-3 px-4 py-3 bg-background border transition-colors rounded-lg',
                    isFocused ? 'border-primary' : 'border-foreground/10'
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
                            className="p-1 hover:bg-foreground/10 rounded transition-colors"
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

const CATEGORIES = [
    { key: 'all', label: 'All', icon: Filter },
    { key: 'Art', label: 'Art', icon: Filter },
    { key: 'Philosophy', label: 'Philosophy', icon: Filter },
    { key: 'Technology', label: 'Technology', icon: Filter },
    { key: 'History', label: 'History', icon: Filter },
] as const;

type Category = typeof CATEGORIES[number]['key'];

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
                            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans tracking-wide transition-colors',
                            isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground'
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
        <div className={cn('flex flex-col md:flex-row gap-4 items-start md:items-center justify-between', className)}>
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