'use client';

import React from 'react';
import { FloorTable } from '../types';
import TableCard from './TableCard';
import { Utensils } from 'lucide-react';

export interface FloorTableGridProps {
  tables: FloorTable[];
  onViewDetails: (table: FloorTable) => void;
  onMarkReady: (tableId: string) => void;
  onResetFilters?: () => void;
}

export function FloorTableGrid({
  tables,
  onViewDetails,
  onMarkReady,
  onResetFilters,
}: FloorTableGridProps) {
  if (tables.length === 0) {
    return (
      <div className="w-full py-16 px-4 bg-stone-950/60 rounded-xl border border-dashed border-zinc-800 flex flex-col items-center justify-center text-center">
        <div className="size-12 bg-zinc-900 rounded-full flex items-center justify-center mb-3">
          <Utensils className="size-6 text-zinc-500" />
        </div>
        <h3 className="text-white text-base font-medium font-['Inter'] mb-1">
          No tables found matching criteria
        </h3>
        <p className="text-zinc-500 text-sm font-['Inter'] max-w-sm mb-4">
          Try adjusting your zone selection, status filter, or clear your search keyword.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-3.5 py-2 bg-yellow-500 hover:bg-yellow-400 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tables.map((table) => (
        <TableCard
          key={table.id}
          table={table}
          onViewDetails={onViewDetails}
          onMarkReady={onMarkReady}
        />
      ))}
    </div>
  );
}

export default FloorTableGrid;
