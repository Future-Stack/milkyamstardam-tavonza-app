'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CustomerAIRecommendationBannerProps {
  onActionClick?: () => void;
}

export const CustomerAIRecommendationBanner: React.FC<CustomerAIRecommendationBannerProps> = ({
  onActionClick,
}) => {
  return (
    <div className="w-full px-3 py-3 bg-white/10 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-['Plus_Jakarta_Sans']">
      <div className="flex items-start sm:items-center gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
        <div className="text-base leading-5">
          <span className="text-amber-500 font-semibold">AI Recommendation:</span>{' '}
          <span className="text-slate-200/90 font-normal">
            18 VIP customers haven&apos;t visited in 30+ days. Sending a personalized re-engagement perk could recover ~$3,200 in monthly revenue.
          </span>
        </div>
      </div>

      {onActionClick && (
        <button
          type="button"
          onClick={onActionClick}
          className="self-end sm:self-auto shrink-0 flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
        >
          <span>Review Campaign</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default CustomerAIRecommendationBanner;
