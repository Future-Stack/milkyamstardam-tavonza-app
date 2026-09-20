'use client';

import React from 'react';
import { mockBeverageInventory } from '../data';
import { Package, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface BeverageInventorySectionProps {
  onOpenInventory?: () => void;
}

export default function BeverageInventorySection({ onOpenInventory }: BeverageInventorySectionProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div>
          <h2 className="text-white text-lg font-semibold font-['Inter'] leading-tight">
            Beverage Inventory
          </h2>
          <p className="text-zinc-400 text-sm font-normal font-['Inter'] mt-0.5">
            Smart Stock Notifications
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onOpenInventory) onOpenInventory();
            else toast.info('Navigating to full Bar Inventory');
          }}
          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-white/5 text-white text-sm font-medium font-['DM_Sans'] transition-colors flex items-center gap-1 cursor-pointer"
        >
          View Inventory
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inventory List */}
      <div className="space-y-2.5">
        {mockBeverageInventory.map((item) => (
          <div
            key={item.id}
            className="h-12 px-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className={`size-2 rounded-full ${item.dotColor}`} />
              <span className="text-white text-sm font-medium font-['Inter']">
                {item.name}
              </span>
            </div>

            <div
              className={`px-2.5 py-0.5 rounded-full border text-sm font-medium font-mono ${item.badgeBg} ${item.badgeText} ${item.badgeBorder}`}
            >
              {item.stockStatus}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
