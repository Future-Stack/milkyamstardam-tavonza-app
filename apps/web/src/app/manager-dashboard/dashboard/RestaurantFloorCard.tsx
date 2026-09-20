'use client';

import React, { useState } from 'react';
import { ChevronRight, LayoutGrid, CheckCircle, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { FloorStatusItem } from '../types';

interface RestaurantFloorCardProps {
  floorItems: FloorStatusItem[];
  onOpenLayout?: () => void;
}

export const RestaurantFloorCard: React.FC<RestaurantFloorCardProps> = ({
  floorItems,
  onOpenLayout,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return <CheckCircle className="w-3.5 h-3.5 text-teal-400" />;
      case 'occupied':
        return <Clock className="w-3.5 h-3.5 text-blue-500" />;
      case 'reserved':
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
      case 'cleaning':
        return <AlertTriangle className="w-3.5 h-3.5 text-zinc-400" />;
      default:
        return <LayoutGrid className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  const totalTables = floorItems.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="w-full bg-black rounded-[10px] border border-white/10 shadow-lg p-5 flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-amber-500" />
          <h3 className="text-white text-lg font-semibold font-['Inter']">
            Restaurant Floor
          </h3>
          <span className="text-xs text-neutral-400 font-mono">
            {totalTables} Total
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenLayout}
          className="text-amber-500 hover:text-amber-400 text-base font-medium font-['Inter'] inline-flex items-center gap-1 transition-colors group"
        >
          Open Layout
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Status List */}
      <div className="mt-4 space-y-2.5">
        {floorItems.map((item) => {
          const isSelected = selectedStatus === item.status;
          return (
            <div
              key={item.status}
              onClick={() => setSelectedStatus(isSelected ? null : item.status)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-[5px] border border-white/10 ${
                item.bg
              } hover:brightness-125 transition-all cursor-pointer ${
                isSelected ? 'ring-1 ring-amber-500' : ''
              }`}
            >
              <div className="flex items-center gap-2.5">
                {getStatusIcon(item.status)}
                <span className={`text-sm font-medium font-['Inter'] ${item.color}`}>
                  {item.status}
                </span>
              </div>
              <span className="text-white text-sm font-normal font-['Inter'] font-mono">
                {item.count} Tables
              </span>
            </div>
          );
        })}
      </div>

      {/* Occupancy Indicator Footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
        <span>Capacity: 75% utilized</span>
        <span className="text-teal-400 font-medium">Floor 1 & 2 Active</span>
      </div>
    </div>
  );
};
