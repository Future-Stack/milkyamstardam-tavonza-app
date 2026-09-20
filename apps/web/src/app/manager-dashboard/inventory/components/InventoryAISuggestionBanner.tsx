'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface InventoryAISuggestionBannerProps {
  onAutoRestock?: () => void;
}

export const InventoryAISuggestionBanner: React.FC<InventoryAISuggestionBannerProps> = ({
  onAutoRestock,
}) => {
  return (
    <div className="w-full min-h-12 px-4 py-3 bg-black rounded-xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-amber-500/5">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-base sm:text-lg leading-snug">
          <span className="text-amber-500 font-semibold font-['Plus_Jakarta_Sans'] mr-1.5">
            AI Suggestion:
          </span>
          <span className="text-slate-200/90 font-normal font-['Plus_Jakarta_Sans']">
            Restock mozzarella cheese and olive oil before 5:00 PM to avoid dinner service disruption.
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onAutoRestock}
        className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-sm font-semibold font-['Plus_Jakarta_Sans'] rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
      >
        <span>Auto-Restock Critical</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
