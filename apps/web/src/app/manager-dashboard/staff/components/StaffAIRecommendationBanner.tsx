'use client';

import React from 'react';
import { AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

interface StaffAIRecommendationBannerProps {
  onBalanceLoads: () => void;
}

export const StaffAIRecommendationBanner: React.FC<StaffAIRecommendationBannerProps> = ({
  onBalanceLoads,
}) => {
  return (
    <div className="p-4 rounded-xl bg-black border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 sm:mt-0">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="text-base font-['Inter'] leading-relaxed">
          <span className="font-semibold text-white">AI Recommendation: </span>
          <span className="text-zinc-300">
            Emma Wilson and Olivia Park are each handling 4 tables — above the team average. Consider redistributing to improve service speed.
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onBalanceLoads}
        className="shrink-0 px-3.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-semibold font-['Inter'] flex items-center gap-1.5 transition-colors cursor-pointer self-end sm:self-center"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Balance Table Loads</span>
        <ArrowRight className="w-3 h-3 text-amber-400" />
      </button>
    </div>
  );
};
