'use client';

import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { toast } from 'sonner';

export interface StockManageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InventoryItem {
  id: string;
  name: string;
  category: 'Meats & Seafood' | 'Produce' | 'Wines & Spirits' | 'Dry Goods' | 'Dairy';
  stockCount: number;
  parCount: number;
  posStatus: 'Orderable' | "86'd";
  flaggedForReorder: boolean;
}

const initialInventoryItems: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Wild King Salmon Fillets',
    category: 'Meats & Seafood',
    stockCount: 2,
    parCount: 25,
    posStatus: 'Orderable',
    flaggedForReorder: false,
  },
  {
    id: 'inv-2',
    name: 'Prime Dry-Aged Ribeye 14oz',
    category: 'Meats & Seafood',
    stockCount: 1,
    parCount: 20,
    posStatus: "86'd",
    flaggedForReorder: true,
  },
  {
    id: 'inv-3',
    name: 'Heirloom Baby Carrots',
    category: 'Produce',
    stockCount: 3,
    parCount: 30,
    posStatus: 'Orderable',
    flaggedForReorder: false,
  },
  {
    id: 'inv-4',
    name: 'Vintage 2018 Barolo DOCG',
    category: 'Wines & Spirits',
    stockCount: 0,
    parCount: 12,
    posStatus: "86'd",
    flaggedForReorder: true,
  },
  {
    id: 'inv-5',
    name: 'Truffle Tagliatelle Pasta',
    category: 'Dry Goods',
    stockCount: 4,
    parCount: 25,
    posStatus: 'Orderable',
    flaggedForReorder: false,
  },
  {
    id: 'inv-6',
    name: 'Organic Heavy Whipping Cream',
    category: 'Dairy',
    stockCount: 3,
    parCount: 20,
    posStatus: 'Orderable',
    flaggedForReorder: false,
  },
];

type CategoryFilter = 'All' | 'Meats & Seafood' | 'Produce' | 'Wines & Spirits' | 'Dry Goods' | 'Dairy';

export function StockManageModal({ isOpen, onClose }: StockManageModalProps) {
  const [items, setItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const lowStockCount = items.filter((i) => i.stockCount <= 3 && i.posStatus !== "86'd").length;
  const count86 = items.filter((i) => i.posStatus === "86'd").length;

  const filteredItems = items.filter((item) => {
    if (activeCategory !== 'All' && item.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    }
    return true;
  });

  const handleBroadcast86 = (id: string, name: string, currentStatus: "Orderable" | "86'd") => {
    const nextStatus = currentStatus === "86'd" ? 'Orderable' : "86'd";
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, posStatus: nextStatus } : item))
    );
    if (nextStatus === "86'd") {
      toast.error(`Broadcasted: ${name} is now 86'd across all POS & server handhelds.`);
    } else {
      toast.success(`Restocked: ${name} is now Orderable on POS.`);
    }
  };

  const handleFlagReorder = (id: string, name: string, currentFlag: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, flaggedForReorder: !currentFlag } : item))
    );
    if (!currentFlag) {
      toast.info(`Replenishment flag sent to RM Elena Vance for ${name}.`);
    } else {
      toast.info(`Removed reorder flag for ${name}.`);
    }
  };

  return (
    <div
      className="assistant-manager-modal-backdrop fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[680px] max-h-[92vh] px-5 py-6 sm:py-7 bg-zinc-900 rounded-[10px] flex flex-col justify-between gap-5 overflow-hidden shadow-2xl border border-zinc-800 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-zinc-700/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white text-xl font-medium font-['Inter']">
                    Inventory &amp; 86 Hub
                  </span>
                  <div className="h-5 px-2.5 py-1 bg-green-500/5 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-700 flex items-center">
                    <span className="text-emerald-500 text-xs font-normal font-['Inter'] leading-[10px]">
                      Downtown Promenade
                    </span>
                  </div>
                </div>
                <p className="text-neutral-500 text-sm sm:text-base font-normal font-['Inter'] leading-tight">
                  Broadcast 86&apos;d status to POS and flag replenishment items for RM review.
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="size-7 rounded-[3px] outline outline-1 outline-offset-[-1px] outline-white/10 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Metrics & Search Bar */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-white text-lg sm:text-xl font-medium font-['Inter'] leading-4">
                    Low Stock: {lowStockCount}
                  </span>
                  <div className="w-px h-3.5 bg-zinc-500" />
                </div>
                <span className="text-white text-lg sm:text-xl font-medium font-['Inter'] leading-4">
                  86&apos;d: {count86}
                </span>
              </div>

              <div className="w-full h-10 px-4 bg-stone-950/50 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-neutral-800 flex items-center gap-3.5">
                <Search className="size-4 text-neutral-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter Stock"
                  className="w-full bg-transparent text-white placeholder-neutral-500 text-base font-normal font-['Inter'] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-neutral-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 flex-nowrap py-1">
                {(
                  [
                    'All',
                    'Meats & Seafood',
                    'Produce',
                    'Wines & Spirits',
                    'Dry Goods',
                    'Dairy',
                  ] as CategoryFilter[]
                ).map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`p-[6px] px-3.5 rounded-[5px] text-base font-normal font-['Inter'] leading-4 transition-colors cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-yellow-400 text-white font-medium'
                          : 'bg-neutral-800 text-zinc-400 hover:text-white hover:bg-neutral-700'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3 pt-1">
            {filteredItems.map((item) => {
              const is86 = item.posStatus === "86'd";

              return (
                <div
                  key={item.id}
                  className="w-full p-3 bg-black rounded-[10px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border border-neutral-800/80"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-neutral-300 text-base font-medium font-['Inter'] truncate">
                        {item.name}
                      </span>
                      <div className="px-2 py-0.5 bg-green-500/5 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-700 flex items-center">
                        <span className="text-emerald-500 text-xs font-normal font-['Inter'] leading-tight">
                          Manage
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm font-['Inter'] text-neutral-400">
                      <div>
                        <span className="text-white">Stock:</span> {item.stockCount} portions •
                      </div>
                      <div>
                        <span className="text-white">Par:</span> {item.parCount} portions
                      </div>
                    </div>

                    <div className="text-sm font-['Inter']">
                      <span className="text-stone-300">POS Status: </span>
                      <span
                        className={
                          is86
                            ? 'text-rose-400 font-medium'
                            : 'text-yellow-400/80 font-normal'
                        }
                      >
                        {item.posStatus}
                      </span>
                      {item.flaggedForReorder && (
                        <span className="ml-2 text-xs text-amber-400 font-medium">
                          (Reorder Pending)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleBroadcast86(item.id, item.name, item.posStatus)}
                      className={`w-32 px-3.5 py-2.5 rounded-lg text-base font-normal font-['Inter'] leading-6 flex justify-center items-center cursor-pointer transition-all ${
                        is86
                          ? 'bg-amber-400 text-white font-medium shadow-sm'
                          : 'outline outline-1 outline-offset-[-1px] outline-neutral-500 text-white hover:bg-zinc-800'
                      }`}
                    >
                      {is86 ? "86'd Active" : 'Broadcast 86'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFlagReorder(item.id, item.name, item.flaggedForReorder)}
                      className={`w-32 px-3.5 py-2.5 rounded-lg outline outline-1 outline-offset-[-1px] text-base font-normal font-['Inter'] leading-6 flex justify-center items-center cursor-pointer transition-all ${
                        item.flaggedForReorder
                          ? 'outline-amber-400 text-amber-400 bg-amber-400/10'
                          : 'outline-neutral-500 text-white hover:bg-zinc-800'
                      }`}
                    >
                      {item.flaggedForReorder ? 'Flagged' : 'Flag Reorder'}
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="p-8 text-center bg-black/40 rounded-xl text-neutral-500 text-sm">
                No items match your search or category filter.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="w-full px-3 py-2 bg-neutral-700 rounded-[10px] flex justify-between items-center overflow-hidden flex-shrink-0">
          <span className="text-white text-xs sm:text-base font-normal font-['Inter'] truncate">
            Reorder PO authorizations managed by RM Elena Vance.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-900 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-400 flex items-center cursor-pointer transition-colors flex-shrink-0 ml-2"
          >
            <span className="text-neutral-200 text-xs font-normal font-['Inter']">Close</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default StockManageModal;
