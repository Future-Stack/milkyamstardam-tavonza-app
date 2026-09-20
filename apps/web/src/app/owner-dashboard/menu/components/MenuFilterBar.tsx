'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { MenuCategory } from '../types';

export interface MenuFilterBarProps {
  categories: MenuCategory[];
  activeCategory: MenuCategory;
  onSelectCategory: (category: MenuCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function MenuFilterBar({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: MenuFilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full pt-2">
      {/* Category Segmented Tabs */}
      <div className="inline-flex items-center rounded-lg border border-white/20 bg-neutral-900/60 p-0.5 self-start overflow-hidden">
        {categories.map((category, idx) => {
          const isActive = activeCategory === category;
          const isFirst = idx === 0;
          const isLast = idx === categories.length - 1;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`h-8 px-3.5 text-sm font-normal font-['Inter'] transition-all cursor-pointer whitespace-nowrap flex items-center justify-center ${
                isFirst ? 'rounded-l-md' : ''
              } ${isLast ? 'rounded-r-md' : ''} ${
                isActive
                  ? 'bg-yellow-500 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5 border-l border-white/10 first:border-l-0'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="w-full lg:w-96 h-10 px-4 bg-gray-50/5 rounded-[5px] border border-stone-300/10 flex items-center gap-3 focus-within:border-amber-400/60 transition-colors">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search Items..."
          className="w-full bg-transparent text-base text-white placeholder:text-zinc-600 focus:outline-none font-['Inter']"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="text-xs text-zinc-400 hover:text-white px-1.5 py-0.5 rounded bg-zinc-800 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
