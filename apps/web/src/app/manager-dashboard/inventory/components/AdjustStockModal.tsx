'use client';

import React, { useState } from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { InventoryItem } from '../../types';

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onConfirmAdjustment: (
    itemId: string,
    adjustmentType: 'add' | 'remove' | 'set',
    amount: number,
    reason: string
  ) => void;
}

export const AdjustStockModal: React.FC<AdjustStockModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirmAdjustment,
}) => {
  const [type, setType] = useState<'add' | 'remove' | 'set'>('add');
  const [amount, setAmount] = useState<number>(1);
  const [reason, setReason] = useState<string>('Delivery Receipt');
  const [notes, setNotes] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 && type !== 'set') return;
    onConfirmAdjustment(item.id, type, amount, `${reason}${notes ? ` - ${notes}` : ''}`);
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
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-white text-lg font-bold font-['Plus_Jakarta_Sans']">
                Adjust Stock: {item.name}
              </h3>
              <p className="text-slate-400 text-sm font-normal">
                Current: {item.currentStockText} (Target: {item.minLevel})
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Adjustment Mode */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setType('add')}
              className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                type === 'add'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-zinc-900 border border-white/10 text-slate-300 hover:bg-zinc-850'
              }`}
            >
              + Add (Receive)
            </button>
            <button
              type="button"
              onClick={() => setType('remove')}
              className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                type === 'remove'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-zinc-900 border border-white/10 text-slate-300 hover:bg-zinc-850'
              }`}
            >
              - Remove (Waste)
            </button>
            <button
              type="button"
              onClick={() => setType('set')}
              className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                type === 'set'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-zinc-900 border border-white/10 text-slate-300 hover:bg-zinc-850'
              }`}
            >
              Set Exact Count
            </button>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-xs font-semibold uppercase tracking-wider">
              {type === 'set' ? 'New Total Stock' : 'Adjustment Amount'} ({item.unit})
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="h-10 px-3 bg-black rounded-lg border border-white/10 text-white font-mono text-lg font-bold focus:border-amber-500 outline-none"
            />
          </div>

          {/* Reason */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-xs font-semibold uppercase tracking-wider">
              Reason for Adjustment
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-9 px-3 bg-black rounded-lg border border-white/10 text-white text-sm focus:border-amber-500 outline-none cursor-pointer"
            >
              <option value="Delivery Receipt">Delivery Receipt</option>
              <option value="Kitchen Usage">Kitchen Usage Correction</option>
              <option value="Waste / Spoilage">Waste / Spoilage / Expired</option>
              <option value="Inventory Recount">Physical Inventory Recount</option>
              <option value="Transfer">Inter-branch Transfer</option>
            </select>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-xs font-semibold uppercase tracking-wider">
              Additional Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Broken packaging or batch #882"
              className="h-9 px-3 bg-black rounded-lg border border-white/10 text-white placeholder-zinc-500 text-sm focus:border-amber-500 outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="submit"
              className="h-10 bg-yellow-500 hover:bg-yellow-400 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-yellow-500/20"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Apply Adjustment</span>
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
