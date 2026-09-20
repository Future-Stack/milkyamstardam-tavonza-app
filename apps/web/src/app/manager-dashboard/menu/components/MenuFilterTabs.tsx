'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { MenuCategoryFilter } from '../../types';
import { menuFilterTabs } from '../../data';

interface MenuFilterTabsProps {
  activeTab: MenuCategoryFilter;
  onSelectTab: (tab: MenuCategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const MenuFilterTabs: React.FC<MenuFilterTabsProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
      {/* Segmented Filter Bar matching Figma: All, Sweet, Savory, Pancake, Coffee, Drinks */}
      <div className="h-9 inline-flex items-center rounded-lg border border-white/20 bg-black/40 backdrop-blur-sm overflow-x-auto no-scrollbar max-w-full">
        {menuFilterTabs.map((tab, idx) => {
          const isActive = activeTab === tab;
          const isFirst = idx === 0;
          const isLast = idx === menuFilterTabs.length - 1;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onSelectTab(tab)}
              className={`h-9 px-4 py-2 flex items-center justify-center text-base sm:text-lg font-normal font-['Inter'] transition-colors whitespace-nowrap cursor-pointer ${
                isFirst ? 'rounded-tl-lg rounded-bl-lg' : ''
              } ${isLast ? 'rounded-tr-lg rounded-br-lg' : ''} ${
                idx > 0 ? 'border-l border-white/20' : ''
              } ${
                isActive
                  ? 'bg-yellow-500 text-white font-medium shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Menu Item Search Box */}
      <div className="w-full sm:w-72 h-9 px-3.5 bg-black rounded-lg border border-white/10 flex items-center gap-2.5 overflow-hidden focus-within:border-amber-500/60 transition-all">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search menu items..."
          className="w-full bg-transparent text-white placeholder-zinc-500 text-base font-normal font-['Inter'] outline-none"
        />
      </div>
    </div>
  );
};
