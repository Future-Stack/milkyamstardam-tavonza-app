'use client';

import React, { useState } from 'react';
import { X, PackagePlus, Truck } from 'lucide-react';
import { InventoryItem } from '../../types';

interface QuickRestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onConfirmRestock: (itemId: string, addedQty: number, supplier: string) => void;
}

export const QuickRestockModal: React.FC<QuickRestockModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirmRestock,
}) => {
  const [qty, setQty] = useState<number>(10);
  const [supplier, setSupplier] = useState(item?.supplier || 'Primary Supplier Co.');
  const [isExpress, setIsExpress] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qty <= 0) return;
    onConfirmRestock(item.id, qty, supplier);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 lg:left-72 top-20 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-md bg-black border border-white/15 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-white relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <PackagePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-white text-lg font-bold font-['Plus_Jakarta_Sans']">
                Restock {item.name}
              </h3>
              <p className="text-slate-400 text-sm font-normal">
                Category: {item.category} · Target Min: {item.minLevel}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status info */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-950 rounded-xl border border-white/10 text-sm">
          <div>
            <span className="text-slate-400 block">Current Stock</span>
            <span className={`text-base font-bold font-mono ${item.textColor}`}>
              {item.currentStockText}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Status</span>
            <span className="text-base font-semibold text-amber-400">
              {item.stockStatus} Stock
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-xs font-semibold uppercase tracking-wider">
              Restock Quantity ({item.unit})
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQty((prev) => Math.max(1, prev - 5))}
                className="w-9 h-9 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white rounded-lg font-bold text-base transition-colors cursor-pointer flex items-center justify-center"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                className="w-9 h-9 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white rounded-lg font-bold text-base transition-colors cursor-pointer flex items-center justify-center"
              >
                -1
              </button>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={qty}
                onChange={(e) => setQty(Math.max(0, Number(e.target.value)))}
                className="flex-1 h-9 px-3 bg-black rounded-lg border border-white/10 text-center text-white text-lg font-bold font-mono focus:border-amber-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setQty((prev) => prev + 1)}
                className="w-9 h-9 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white rounded-lg font-bold text-base transition-colors cursor-pointer flex items-center justify-center"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => setQty((prev) => prev + 5)}
                className="w-9 h-9 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white rounded-lg font-bold text-base transition-colors cursor-pointer flex items-center justify-center"
              >
                +5
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white text-xs font-semibold uppercase tracking-wider">
              Supplier Partner
            </label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="h-9 px-3 bg-black rounded-lg border border-white/10 text-white text-sm focus:border-amber-500 outline-none"
            />
          </div>

          {/* Express Delivery Checkbox */}
          <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <div className="flex flex-col">
                <span className="text-white text-sm font-semibold">Priority Delivery</span>
                <span className="text-amber-300/80 text-xs">Estimated delivery within 2 hours</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isExpress}
              onChange={(e) => setIsExpress(e.target.checked)}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="submit"
              className="h-10 bg-yellow-500 hover:bg-yellow-400 text-white text-sm font-bold rounded-lg transition-all cursor-pointer shadow-lg shadow-yellow-500/20"
            >
              Confirm Restock PO
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-10 bg-zinc-950 hover:bg-zinc-900 border border-white/10 text-slate-200 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
