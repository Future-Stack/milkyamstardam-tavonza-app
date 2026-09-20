'use client';

import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';
import { FloorTable } from '../../types';

interface AssignWaiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: FloorTable | null;
  onAssign: (tableId: string, waiterName: string) => void;
}

const availableWaiters = [
  { name: 'Emma Wilson', role: 'Head Waiter', activeTables: 3 },
  { name: 'David Chen', role: 'Senior Server', activeTables: 2 },
  { name: 'Lucas Rossi', role: 'Server', activeTables: 4 },
  { name: 'Sarah Johnson', role: 'Floor Manager', activeTables: 1 },
  { name: 'Michael Scott', role: 'Server', activeTables: 2 },
  { name: 'Elena Rostova', role: 'Server', activeTables: 3 },
];

export const AssignWaiterModal: React.FC<AssignWaiterModalProps> = ({
  isOpen,
  onClose,
  table,
  onAssign,
}) => {
  const [selectedWaiter, setSelectedWaiter] = useState(table?.waiter || 'Emma Wilson');

  if (!isOpen || !table) return null;

  const handleConfirm = () => {
    onAssign(table.id, selectedWaiter);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 lg:left-72 top-20 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-sm bg-black border border-white/15 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/5 pb-3">
          <div>
            <h3 className="text-slate-200 text-base font-bold font-['Plus_Jakarta_Sans'] leading-5">
              Assign Waiter to {table.tableNumber}
            </h3>
            <p className="text-slate-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4 mt-0.5">
              Select an available staff member for this table
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-amber-500 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Waiters List */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
          {availableWaiters.map((w) => {
            const isChosen = selectedWaiter === w.name;
            return (
              <div
                key={w.name}
                onClick={() => setSelectedWaiter(w.name)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                  isChosen
                    ? 'bg-amber-500/15 border-amber-500/50 text-white'
                    : 'bg-zinc-950 border-white/10 text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{w.name}</span>
                  <span className="text-xs text-zinc-500">
                    {w.role} · {w.activeTables} active tables
                  </span>
                </div>

                {isChosen && (
                  <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full h-9 px-4 bg-yellow-500 hover:bg-yellow-400 text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] rounded-[5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-yellow-500/20 active:scale-[0.99]"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Confirm Assignment</span>
        </button>
      </div>
    </div>
  );
};
