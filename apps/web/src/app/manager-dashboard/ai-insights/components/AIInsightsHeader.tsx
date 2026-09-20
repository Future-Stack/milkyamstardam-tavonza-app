'use client';

import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface AIInsightsHeaderProps {
  onAskAI?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const AIInsightsHeader: React.FC<AIInsightsHeaderProps> = ({
  onAskAI,
  onRefresh,
  isRefreshing = false,
}) => {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      toast.success('AI telemetry refreshed with latest POS and kitchen events.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-white text-3xl sm:text-4xl font-semibold font-['Inter'] leading-9 tracking-tight">
          AI Insights
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg font-normal font-['Inter'] leading-6 mt-1">
          Tavonza AI-powered operational intelligence
        </p>
      </div>

      {/* Right side live status & actions */}
      <div className="flex items-center gap-3">
        {/* Live status badge from Figma */}
        <div className="px-3 py-2 bg-green-500/10 rounded-lg outline outline-1 outline-offset-[-1px] outline-green-500/20 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-emerald-500 text-sm font-medium font-sans">
            Analyzing live data
          </span>
        </div>

        {/* Refresh AI intelligence button */}
        <button
          type="button"
          onClick={handleRefresh}
          className="h-9 px-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-neutral-300 text-sm font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Ask AI Copilot */}
        {onAskAI && (
          <button
            type="button"
            onClick={onAskAI}
            className="h-9 px-3.5 bg-yellow-500 hover:bg-yellow-400 text-white font-semibold text-sm rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Ask Tavonza AI</span>
          </button>
        )}
      </div>
    </div>
  );
};
