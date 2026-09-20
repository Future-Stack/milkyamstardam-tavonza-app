'use client';

import React from 'react';
import { FloorTable } from '../../types';

interface FloorTableCardProps {
  table: FloorTable;
  isSelected: boolean;
  onSelect: (table: FloorTable) => void;
}

export const FloorTableCard: React.FC<FloorTableCardProps> = ({
  table,
  isSelected,
  onSelect,
}) => {
  // Status style maps
  const getStatusStyles = () => {
    switch (table.status) {
      case 'Occupied':
        return {
          bg: 'bg-black',
          badgeBg: 'bg-orange-700/20 text-orange-400 border border-orange-500/20',
          dot: 'bg-amber-500',
        };
      case 'Available':
        return {
          bg: 'bg-black',
          badgeBg: 'bg-green-700/25 text-green-400 border border-green-500/20',
          dot: 'bg-green-500',
        };
      case 'Reserved':
        return {
          bg: 'bg-black',
          badgeBg: 'bg-blue-700/25 text-blue-400 border border-blue-500/20',
          dot: 'bg-blue-400',
        };
      default:
        return {
          bg: 'bg-black',
          badgeBg: 'bg-white/10 text-zinc-400',
          dot: 'bg-zinc-400',
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div
      onClick={() => onSelect(table)}
      className={`h-48 rounded-xl border p-3.5 flex flex-col justify-between transition-all duration-200 cursor-pointer select-none relative ${
        styles.bg
      } ${
        isSelected
          ? 'border-amber-500 shadow-lg shadow-amber-500/15 scale-[1.02]'
          : 'border-white/10 hover:border-white/30 hover:bg-zinc-950'
      }`}
    >
      {/* Top Header Bar matching Figma */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${styles.dot} shrink-0`} />
          <span className="text-white text-lg font-semibold font-['Inter'] leading-6">
            {table.tableNumber}
          </span>
        </div>

        <span
          className={`text-[10px] font-medium font-['Inter'] px-2 py-0.5 rounded-sm capitalize tracking-wide ${styles.badgeBg}`}
        >
          {table.status}
        </span>
      </div>

      {/* Center Content matching Screenshot 1 */}
      <div className="flex flex-col items-center justify-center my-auto text-center gap-1.5">
        <div className="w-16 h-11 bg-white/5 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/15 backdrop-blur-[10.20px] flex items-center justify-center">
          <span className="text-zinc-200 text-2xl font-bold font-['Inter'] leading-none">
            {table.capacity}p
          </span>
        </div>

        <span className="text-stone-300 text-sm font-normal font-['Inter'] leading-4">
          Capacity: {table.capacity} seats
        </span>

        <span className="text-stone-300 text-sm font-normal font-['Inter'] leading-4">
          {table.status === 'Available'
            ? 'Ready for guests'
            : `${table.currentGuests} guests`}
        </span>
      </div>

      {/* Subtle bottom info */}
      <div className="flex items-center justify-between text-xs text-zinc-500 pt-1.5 border-t border-white/5">
        <span>{table.location}</span>
        <span>{table.waiter !== 'Unassigned' ? `Waiter: ${table.waiter}` : 'Unassigned'}</span>
      </div>
    </div>
  );
};
