'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { TableFilterTab } from '../../types';

interface TableFilterBarProps {
  activeTab: TableFilterTab;
  onSelectTab: (tab: TableFilterTab) => void;
  counts: {
    all: number;
    occupied: number;
    available: number;
    reserved: number;
  };
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const TableFilterBar: React.FC<TableFilterBarProps> = ({
  activeTab,
  onSelectTab,
  counts,
  searchQuery,
  onSearchChange,
}) => {
  const tabs: { label: string; value: TableFilterTab; count: number }[] = [
    { label: 'All Tables', value: 'All', count: counts.all },
    { label: 'Occupied', value: 'Occupied', count: counts.occupied },
    { label: 'Available', value: 'Available', count: counts.available },
    { label: 'Reserved', value: 'Reserved', count: counts.reserved },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
      {/* Segmented Filter Bar matching Figma */}
      <div className="h-9 inline-flex items-center rounded-lg border border-white/20 bg-black overflow-hidden">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.value;
          const isFirst = idx === 0;
          const isLast = idx === tabs.length - 1;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onSelectTab(tab.value)}
              className={`h-9 px-3.5 py-2 flex items-center justify-center text-sm sm:text-base font-normal font-['Inter'] transition-colors whitespace-nowrap cursor-pointer ${
                isFirst ? 'rounded-tl-lg rounded-bl-lg' : ''
              } ${isLast ? 'rounded-tr-lg rounded-br-lg' : ''} ${
                idx > 0 ? 'border-l border-white/20' : ''
              } ${
                isActive
                  ? 'bg-yellow-500 text-white font-medium shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>

      {/* Find Table Search Input matching Figma */}
      <div className="w-full sm:w-72 h-9 px-3.5 bg-black rounded-lg border border-white/10 flex items-center gap-2.5 overflow-hidden focus-within:border-amber-500/60 transition-all">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Find Table..."
          className="w-full bg-transparent text-white placeholder-zinc-500 text-base font-normal font-['Inter'] outline-none"
        />
      </div>
    </div>
  );
};
