'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem } from '../types';

export interface MenuHeaderProps {
  items: MenuItem[];
  onOpenAddModal: () => void;
}

export default function MenuHeader({
  items,
  onOpenAddModal,
}: MenuHeaderProps) {
  const totalCount = items.length;
  const activeCount = items.filter((i) => i.isActive).length;
  const hiddenCount = totalCount - activeCount;

  // Calculate average margin
  const avgMargin =
    items.length > 0
      ? Math.round(
          items.reduce((acc, curr) => acc + (curr.marginPercent || 66), 0) /
            items.length
        )
      : 72;

  return (
    <div className="space-y-6 w-full">
      {/* Title & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-4xl font-semibold font-['Inter'] leading-9 tracking-tight">
            Menu Management
          </h1>
          <p className="text-slate-400 text-base md:text-lg font-normal font-['Inter'] leading-6 mt-1">
            Manage dishes, recipes, pricing categories, and profit margins.
          </p>
        </div>

        {/* Add Item CTA Button */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="h-10 px-4 bg-yellow-500 hover:bg-yellow-400 text-white font-semibold text-sm font-['Inter'] rounded-[10px] shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Item</span>
        </button>
      </div>

      {/* 4 KPI Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Total Items */}
        <div className="p-4 bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-neutral-800 flex flex-col justify-between h-20">
          <div className="text-white text-2xl font-bold font-['Inter'] leading-5">
            {totalCount < 10 ? `0${totalCount}` : totalCount}
          </div>
          <div>
            <div className="text-zinc-400 text-sm font-semibold font-['Inter'] leading-4">
              Total Items
            </div>
            <div className="text-zinc-500 text-xs font-medium font-['Inter'] leading-3">
              {activeCount} Active
            </div>
          </div>
        </div>

        {/* Active Items */}
        <div className="p-4 bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-neutral-800 flex flex-col justify-between h-20">
          <div className="text-white text-2xl font-bold font-['Inter'] leading-5">
            {activeCount < 10 ? `0${activeCount}` : activeCount}
          </div>
          <div>
            <div className="text-zinc-400 text-sm font-semibold font-['Inter'] leading-4">
              Active Items
            </div>
            <div className="text-zinc-500 text-xs font-medium font-['Inter'] leading-3">
              {hiddenCount < 10 ? `0${hiddenCount}` : hiddenCount} Hidden
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-4 bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-neutral-800 flex flex-col justify-between h-20">
          <div className="text-white text-2xl font-bold font-['Inter'] leading-5">
            $21.0k
          </div>
          <div>
            <div className="text-zinc-400 text-sm font-semibold font-['Inter'] leading-4">
              Total Revenue
            </div>
            <div className="text-zinc-500 text-xs font-medium font-['Inter'] leading-3">
              All time
            </div>
          </div>
        </div>

        {/* Avg Margin */}
        <div className="p-4 bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-neutral-800 flex flex-col justify-between h-20">
          <div className="text-green-500 text-2xl font-bold font-['Inter'] leading-5">
            {avgMargin}%
          </div>
          <div>
            <div className="text-stone-300 text-sm font-semibold font-['Inter'] leading-4">
              Avg Margin
            </div>
            <div className="text-zinc-500 text-xs font-medium font-['Inter'] leading-3">
              Across all items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
