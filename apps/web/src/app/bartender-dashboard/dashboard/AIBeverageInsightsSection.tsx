'use client';

import React from 'react';
import { mockAIBeverageInsights } from '../data';
import { Sparkles, ChevronRight, TrendingUp, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

interface AIBeverageInsightsSectionProps {
  onOpenAIModal?: () => void;
}

export default function AIBeverageInsightsSection({ onOpenAIModal }: AIBeverageInsightsSectionProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <h2 className="text-white text-lg font-semibold font-['Inter'] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          AI Beverage Insights
        </h2>

        <button
          type="button"
          onClick={() => {
            if (onOpenAIModal) onOpenAIModal();
            else toast.info('Opening AI Beverage Analytics');
          }}
          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-white/5 text-white text-sm font-medium font-['DM_Sans'] transition-colors flex items-center gap-1 cursor-pointer"
        >
          View AI Insights
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Insights List */}
      <div className="space-y-2.5">
        {mockAIBeverageInsights.map((insight, idx) => (
          <div
            key={insight.id}
            className="p-3 bg-neutral-900/60 hover:bg-neutral-800/60 rounded-xl border border-white/5 transition-colors space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium font-['Inter'] flex items-center gap-1.5">
                {idx === 0 ? (
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Lightbulb className="w-3 h-3 text-amber-400" />
                )}
                {insight.title}
              </span>
            </div>
            <p className="text-neutral-400 text-sm font-normal font-['Inter'] leading-relaxed">
              {insight.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
