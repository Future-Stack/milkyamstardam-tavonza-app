'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { AIInsightsKPIData } from '../../types';

interface AIInsightsKPICardsProps {
  kpis: AIInsightsKPIData;
}

export const AIInsightsKPICards: React.FC<AIInsightsKPICardsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full select-none">
      {/* 1. Insights Generated */}
      <div className="h-24 p-4 sm:p-5 bg-white/5 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-[10px] flex flex-col justify-between hover:bg-white/[0.08] hover:outline-white/30 transition-all group">
        <span className="text-zinc-400 text-sm font-semibold font-['Inter'] leading-4">
          Insights Generated
        </span>
        <span className="text-amber-500 text-2xl sm:text-3xl font-bold font-['Inter'] leading-6 group-hover:scale-105 transition-transform origin-left">
          {kpis.insightsGenerated}
        </span>
        <span className="text-slate-400 text-sm font-normal font-sans leading-4">
          {kpis.insightsGeneratedSubtitle}
        </span>
      </div>

      {/* 2. Actions Suggested */}
      <div className="h-24 p-4 sm:p-5 bg-white/5 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-[10px] flex flex-col justify-between hover:bg-white/[0.08] hover:outline-white/30 transition-all group">
        <span className="text-zinc-400 text-sm font-semibold font-['Inter'] leading-4">
          Actions Suggested
        </span>
        <span className="text-orange-500 text-2xl sm:text-3xl font-bold font-['Inter'] leading-6 group-hover:scale-105 transition-transform origin-left">
          {kpis.actionsSuggested}
        </span>
        <span className="text-slate-400 text-sm font-normal font-sans leading-4">
          {kpis.actionsSuggestedSubtitle}
        </span>
      </div>

      {/* 3. Accuracy Rate */}
      <div className="h-24 p-4 sm:p-5 bg-white/5 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-[10px] flex flex-col justify-between hover:bg-white/[0.08] hover:outline-white/30 transition-all group">
        <span className="text-zinc-400 text-sm font-semibold font-['Inter'] leading-4">
          Accuracy Rate
        </span>
        <span className="text-emerald-500 text-2xl sm:text-3xl font-bold font-['Inter'] leading-6 group-hover:scale-105 transition-transform origin-left">
          {kpis.accuracyRate}
        </span>
        <span className="text-slate-400 text-sm font-normal font-sans leading-4">
          {kpis.accuracyRateSubtitle}
        </span>
      </div>

      {/* 4. Efficiency Gain */}
      <div className="h-24 p-4 sm:p-5 bg-white/5 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-[10px] flex flex-col justify-between hover:bg-white/[0.08] hover:outline-white/30 transition-all group">
        <span className="text-zinc-400 text-sm font-semibold font-['Inter'] leading-4">
          Efficiency Gain
        </span>
        <span className="text-violet-500 text-2xl sm:text-3xl font-bold font-['Inter'] leading-6 group-hover:scale-105 transition-transform origin-left">
          {kpis.efficiencyGain}
        </span>
        <div className="flex items-center gap-1.5 text-sm text-slate-400 font-sans">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <span>{kpis.efficiencyGainSubtitle}</span>
        </div>
      </div>
    </div>
  );
};
