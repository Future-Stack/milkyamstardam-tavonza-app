'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { DiningZone, StatusFilter } from '../types';

export interface ZoneAndStatusFiltersProps {
  activeZone: DiningZone;
  setActiveZone: (zone: DiningZone) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeStatus: StatusFilter;
  setActiveStatus: (status: StatusFilter) => void;
}

const zones: DiningZone[] = [
  'All',
  'Main Dining',
  'Patio',
  'Bar & High Tops',
  'Private Room',
];

const statuses: StatusFilter[] = [
  'All',
  'Alerts',
  'Dining',
  'Seated',
  'Check Out',
  'Bussing',
  'Ready',
];

export function ZoneAndStatusFilters({
  activeZone,
  setActiveZone,
  searchQuery,
  setSearchQuery,
  activeStatus,
  setActiveStatus,
}: ZoneAndStatusFiltersProps) {
  return (
    <div className="w-full space-y-4">
      {/* 1. Dining Zones Segmented Control */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="inline-flex h-9 items-center border border-white/20 rounded-lg overflow-hidden flex-nowrap">
          {zones.map((zone, idx) => {
            const isActive = activeZone === zone;
            const isFirst = idx === 0;
            const isLast = idx === zones.length - 1;

            return (
              <button
                key={zone}
                type="button"
                onClick={() => setActiveZone(zone)}
                className={`h-9 px-3 sm:px-4 text-xs sm:text-sm font-normal font-['Inter'] leading-6 transition-colors cursor-pointer whitespace-nowrap ${
                  idx !== 0 ? 'border-l border-white/20' : ''
                } ${
                  isActive
                    ? 'bg-yellow-500 text-white font-semibold'
                    : 'bg-black text-neutral-400 hover:text-white hover:bg-zinc-900'
                } ${isFirst ? 'rounded-l-lg' : ''} ${isLast ? 'rounded-r-lg' : ''}`}
              >
                {zone}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="w-full h-10 px-3 sm:px-4 bg-zinc-900/50 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-neutral-800 flex items-center gap-3">
        <Search className="size-4 text-zinc-400 flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Menu Items, tables, or servers..."
          className="w-full bg-transparent text-white placeholder-zinc-500 text-xs sm:text-sm font-normal font-['Inter'] focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs text-zinc-400 hover:text-white px-1.5 py-0.5 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* 3. Status Filter Pills */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap py-1">
          {statuses.map((status) => {
            const isActive = activeStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setActiveStatus(status)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[10px] text-xs sm:text-sm font-normal font-['Inter'] leading-4 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-white font-medium shadow-sm'
                    : 'bg-neutral-800 text-neutral-400 hover:text-zinc-200 hover:bg-neutral-700'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ZoneAndStatusFilters;
