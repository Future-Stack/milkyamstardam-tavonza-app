'use client';

import React from 'react';
import { Pencil, Trash2, Flame } from 'lucide-react';
import { ManagerMenuItem } from '../../types';

interface MenuItemsTableProps {
  items: ManagerMenuItem[];
  onEditItem: (item: ManagerMenuItem) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleStatus: (item: ManagerMenuItem) => void;
}

export const MenuItemsTable: React.FC<MenuItemsTableProps> = ({
  items,
  onEditItem,
  onDeleteItem,
  onToggleStatus,
}) => {
  if (items.length === 0) {
    return (
      <div className="w-full h-64 rounded-xl border border-white/10 bg-black flex flex-col items-center justify-center p-6 text-center">
        <p className="text-white text-lg font-medium">No menu items found</p>
        <p className="text-slate-400 text-sm mt-1">
          Try changing your category filter or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-black rounded-xl border border-white/10 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left border-collapse">
          {/* Table Header matching Figma */}
          <thead>
            <tr className="h-14 sm:h-16 bg-black border-b border-white/10 text-white text-base sm:text-lg font-semibold font-['Inter']">
              <th className="pl-6 pr-4 font-semibold">Item</th>
              <th className="px-4 font-semibold">Category</th>
              <th className="px-4 font-semibold">Price</th>
              <th className="px-4 font-semibold">Status</th>
              <th className="px-4 font-semibold">Popular</th>
              <th className="pr-6 pl-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          {/* Table Body matching Figma */}
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr
                key={item.id}
                className="h-14 sm:h-16 hover:bg-white/[0.04] transition-colors group"
              >
                {/* Item Name & Details */}
                <td className="pl-6 pr-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-white text-base sm:text-lg font-medium font-['Inter'] leading-5 group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </span>
                    {item.description && (
                      <span className="text-zinc-500 text-xs font-normal line-clamp-1 max-w-xs mt-0.5">
                        {item.description}
                      </span>
                    )}
                  </div>
                </td>

                {/* Category Badge */}
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 bg-black/30 rounded-[5px] text-zinc-400 text-sm font-medium font-['Plus_Jakarta_Sans'] inline-block border border-white/5">
                    {item.category}
                  </span>
                </td>

                {/* Price */}
                <td className="px-4 py-3">
                  <span className="text-amber-500 text-lg font-medium font-['Inter'] leading-5">
                    ${item.price.toFixed(2)}
                  </span>
                </td>

                {/* Status Toggle Badge */}
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(item)}
                    className={`px-2.5 py-0.5 rounded-[5px] text-sm font-semibold font-['Inter'] transition-all cursor-pointer border ${
                      item.status === 'Available'
                        ? 'bg-green-950/80 text-green-400 border-green-800/40 hover:bg-green-900/80'
                        : 'bg-stone-800/80 text-red-400 border-red-500/20 hover:bg-stone-700/80'
                    }`}
                    title="Click to toggle availability"
                  >
                    {item.status}
                  </button>
                </td>

                {/* Popular Badge */}
                <td className="px-4 py-3">
                  {item.isPopular ? (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-stone-800/90 rounded-[5px] border border-amber-500/20">
                      <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-amber-500 text-sm font-medium font-['Plus_Jakarta_Sans'] leading-none">
                        Popular
                      </span>
                    </div>
                  ) : (
                    <span className="text-zinc-600 text-sm pl-2">-</span>
                  )}
                </td>

                {/* Actions */}
                <td className="pr-6 pl-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditItem(item)}
                      className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Edit Item"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 rounded-md text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
