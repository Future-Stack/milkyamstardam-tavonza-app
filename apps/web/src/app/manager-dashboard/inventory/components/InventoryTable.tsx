'use client';

import React from 'react';
import { PackagePlus, Edit3 } from 'lucide-react';
import { InventoryItem } from '../../types';

interface InventoryTableProps {
  items: InventoryItem[];
  onRestockItem: (item: InventoryItem) => void;
  onAdjustItem: (item: InventoryItem) => void;
  onToggleStatus: (item: InventoryItem) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  onRestockItem,
  onAdjustItem,
  onToggleStatus,
}) => {
  if (items.length === 0) {
    return (
      <div className="w-full h-64 rounded-xl border border-white/10 bg-black flex flex-col items-center justify-center p-6 text-center">
        <p className="text-white text-lg font-medium">No inventory items found</p>
        <p className="text-slate-400 text-sm mt-1">
          Try clearing your search or category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-black rounded-xl border border-white/10 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left border-collapse">
          {/* Header matching Figma */}
          <thead>
            <tr className="h-16 bg-black border-b border-white/10 text-white text-lg font-semibold font-['Inter']">
              <th className="pl-8 pr-4 font-semibold">Item</th>
              <th className="px-4 font-semibold">Category</th>
              <th className="px-4 font-semibold">Stock Level</th>
              <th className="px-4 font-semibold">Min Level</th>
              <th className="px-4 font-semibold">Status</th>
              <th className="pr-8 pl-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr
                key={item.id}
                className="h-14 sm:h-16 hover:bg-white/[0.03] transition-colors group"
              >
                {/* Item Name */}
                <td className="pl-8 pr-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-white text-lg font-medium font-['Inter'] leading-5 group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </span>
                    {item.supplier && (
                      <span className="text-zinc-500 text-xs font-normal line-clamp-1 mt-0.5">
                        {item.supplier}
                      </span>
                    )}
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 bg-neutral-400/20 rounded-[5px] text-zinc-400 text-sm font-medium font-['Plus_Jakarta_Sans'] inline-block border border-white/5">
                    {item.category}
                  </span>
                </td>

                {/* Stock Level: Progress Bar + Metric */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* Progress Bar matching Figma */}
                    <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden shrink-0">
                      <div
                        className={`h-1.5 rounded-full ${item.progressColor} transition-all duration-500`}
                        style={{ width: `${Math.min(100, Math.max(15, item.progressPercentage))}%` }}
                      />
                    </div>
                    {/* Metric Text */}
                    <span className={`text-sm font-normal font-['Inter'] leading-4 ${item.textColor} font-mono`}>
                      {item.currentStockText}
                    </span>
                  </div>
                </td>

                {/* Min Level */}
                <td className="px-4 py-3">
                  <span className="text-white text-lg font-medium font-['Inter'] leading-5 font-mono">
                    {item.minLevel}
                  </span>
                </td>

                {/* Status Toggle Badge */}
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(item)}
                    className={`px-2.5 py-0.5 rounded-[5px] text-sm font-semibold font-['Inter'] transition-all cursor-pointer border ${
                      item.status === 'Available'
                        ? 'bg-green-950 text-green-500 border-green-800/40 hover:bg-green-900/60'
                        : 'bg-stone-800 text-red-400 border-red-500/20 hover:bg-stone-700/60'
                    }`}
                    title="Toggle item availability status"
                  >
                    {item.status}
                  </button>
                </td>

                {/* Actions matching Figma */}
                <td className="pr-8 pl-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    {/* Quick Restock Action */}
                    <button
                      type="button"
                      onClick={() => onRestockItem(item)}
                      className="p-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors cursor-pointer"
                      title="Quick Restock PO"
                    >
                      <PackagePlus className="w-3.5 h-3.5" />
                    </button>

                    {/* Adjust / Edit Action */}
                    <button
                      type="button"
                      onClick={() => onAdjustItem(item)}
                      className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5 transition-colors cursor-pointer"
                      title="Adjust Stock / Waste"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
