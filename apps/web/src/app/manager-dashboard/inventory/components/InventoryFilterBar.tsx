'use client';

import React from 'react';
import { Search, Download, Plus } from 'lucide-react';
import { InventoryCategoryFilter, InventoryStockStatus } from '../../types';
import { inventoryCategoryTabs } from '../../data';

interface InventoryFilterBarProps {
  activeCategory: InventoryCategoryFilter;
  onSelectCategory: (category: InventoryCategoryFilter) => void;
  selectedStockStatus: InventoryStockStatus | 'All';
  onSelectStockStatus: (status: InventoryStockStatus | 'All') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExport: () => void;
  onOpenAddModal: () => void;
}

export const InventoryFilterBar: React.FC<InventoryFilterBarProps> = ({
  activeCategory,
  onSelectCategory,
  selectedStockStatus,
  onSelectStockStatus,
  searchQuery,
  onSearchChange,
  onExport,
  onOpenAddModal,
}) => {
  const stockPills: { label: string; value: InventoryStockStatus | 'All' }[] = [
    { label: 'All Levels', value: 'All' },
    { label: 'Critical (<30%)', value: 'Critical' },
    { label: 'Low Stock', value: 'Low' },
    { label: 'Healthy', value: 'Healthy' },
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Top Filter Bar: Category Tabs + Search + Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 w-full">
        {/* Category Tabs */}
        <div className="h-9 inline-flex items-center rounded-lg border border-white/20 bg-black/40 backdrop-blur-sm overflow-x-auto no-scrollbar max-w-full">
          {inventoryCategoryTabs.map((cat, idx) => {
            const isActive = activeCategory === cat;
            const isFirst = idx === 0;
            const isLast = idx === inventoryCategoryTabs.length - 1;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`h-9 px-3.5 sm:px-4 py-2 flex items-center justify-center text-sm sm:text-base font-normal font-['Inter'] transition-colors whitespace-nowrap cursor-pointer ${
                  isFirst ? 'rounded-tl-lg rounded-bl-lg' : ''
                } ${isLast ? 'rounded-tr-lg rounded-br-lg' : ''} ${
                  idx > 0 ? 'border-l border-white/20' : ''
                } ${
                  isActive
                    ? 'bg-yellow-500 text-white font-medium shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Right side: Search Box & Actions */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          <div className="flex-1 sm:w-64 h-9 px-3 bg-black rounded-lg border border-white/10 flex items-center gap-2 focus-within:border-amber-500/60 transition-all">
            <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search inventory items..."
              className="w-full bg-transparent text-white placeholder-zinc-500 text-sm sm:text-base font-normal font-['Inter'] outline-none"
            />
          </div>

          <button
            type="button"
            onClick={onExport}
            className="px-3 py-2 bg-black hover:bg-zinc-950 rounded-lg border border-white/10 flex items-center gap-1.5 text-white text-sm font-semibold font-['Inter'] transition-colors cursor-pointer shrink-0"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-white text-sm font-semibold font-['Inter'] rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-amber-500/20 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Receive Stock</span>
          </button>
        </div>
      </div>

      {/* Stock Level Quick Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5">
        <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider mr-1 shrink-0">
          Filter by Status:
        </span>
        {stockPills.map((p) => {
          const isSelected = selectedStockStatus === p.value;
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => onSelectStockStatus(p.value)}
              className={`px-2.5 py-1 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap border ${
                isSelected
                  ? 'bg-black text-white border-amber-500/50 shadow-sm'
                  : 'bg-black text-zinc-400 border-white/10 hover:text-white hover:bg-zinc-950'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
