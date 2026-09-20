'use client';

import React from 'react';
import { Sparkles, FileText, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { AIOperationsSummary } from '../types';

interface OperationsSummaryBannerProps {
  summary: AIOperationsSummary;
  onAskAI: () => void;
  onViewReport: () => void;
  onApplyRecommendation?: (rec: string) => void;
}

export const OperationsSummaryBanner: React.FC<OperationsSummaryBannerProps> = ({
  summary,
  onAskAI,
  onViewReport,
  onApplyRecommendation,
}) => {
  const handleChipClick = (rec: string) => {
    if (onApplyRecommendation) {
      onApplyRecommendation(rec);
    } else {
      toast.success(`Action initiated: "${rec}"`);
    }
  };

  return (
    <div className="w-full p-5 md:p-6 bg-black rounded-[10px] border border-white/10 shadow-lg transition-all space-y-4">
      {/* Top row: Title + Description + Circular Score */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-white text-sm md:text-base font-bold font-['Inter'] leading-5">
              Tavonza AI Operations Summary
            </h3>
          </div>

          <p className="text-zinc-300 text-sm font-normal font-['Inter'] leading-5 max-w-4xl">
            {summary.description}
          </p>
        </div>

        {/* Circular Gauge Score */}
        <div className="flex flex-col items-center justify-center shrink-0 self-center lg:self-start">
          <div className="relative w-14 h-14 rounded-full bg-black border border-white/15 flex flex-col items-center justify-center shadow-inner">
            <div className="absolute inset-0 rounded-full border-2 border-amber-500" />
            <span className="text-white text-sm font-bold font-['Plus_Jakarta_Sans'] leading-none">
              {summary.score}
            </span>
            <span className="text-slate-400 text-[9px] font-normal font-['Inter'] leading-tight">
              / 100
            </span>
          </div>
          <span className="text-amber-400 text-sm font-bold font-['Plus_Jakarta_Sans'] mt-1">
            {summary.rating}
          </span>
        </div>
      </div>

      {/* Actionable Chips */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        {summary.recommendations.map((rec) => (
          <button
            key={rec}
            type="button"
            onClick={() => handleChipClick(rec)}
            className="h-7 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 border border-amber-500/20 text-amber-400 hover:text-amber-300 text-sm font-medium font-['Plus_Jakarta_Sans'] rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <ArrowRight className="w-2.5 h-2.5 text-amber-500/80" />
            <span>{rec}</span>
          </button>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onAskAI}
          className="h-7 px-3 py-1 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] rounded-md flex items-center gap-1.5 transition-all cursor-pointer shadow-md font-bold"
        >
          <Sparkles className="w-3 h-3 text-white" />
          <span>Ask Tavonza AI</span>
        </button>

        <button
          type="button"
          onClick={onViewReport}
          className="h-7 px-3 py-1 bg-gray-900 hover:bg-gray-800 border border-white/10 text-slate-200 text-sm font-medium font-['Plus_Jakarta_Sans'] rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <FileText className="w-3 h-3 text-slate-300" />
          <span>View AI Report</span>
        </button>
      </div>
    </div>
  );
};
