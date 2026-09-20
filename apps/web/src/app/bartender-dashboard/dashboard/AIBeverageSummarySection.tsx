'use client';

import React from 'react';
import {
  Sparkles,
  FileSpreadsheet,
  Wine,
  Users,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface AIBeverageSummarySectionProps {
  onOpenAIModal: () => void;
  onOpenReportModal?: () => void;
}

export default function AIBeverageSummarySection({
  onOpenAIModal,
  onOpenReportModal,
}: AIBeverageSummarySectionProps) {
  return (
    <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Col (7 cols): Bar Operations Narrative */}
        <div className="lg:col-span-7 space-y-4">
          {/* Header Row */}
          <div className="flex items-center gap-3">
            <div className="size-9 bg-zinc-800 border border-white/10 rounded-lg flex items-center justify-center text-amber-400">
              <Wine className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-white text-lg font-semibold font-['Inter'] leading-tight">
                Tavonza AI — Bar Summary
              </h2>
              <p className="text-neutral-400 text-sm font-normal font-['Inter']">
                Tuesday, July 15 · 10:24 AM
              </p>
            </div>
          </div>

          {/* Core Operations Paragraph */}
          <p className="text-white text-base sm:text-lg font-normal font-['Inter'] leading-relaxed max-w-2xl">
            Bar operations are running smoothly with a{' '}
            <span className="text-emerald-400 font-semibold">95% efficiency score</span>. Seven beverage orders require immediate preparation. Cocktail demand is expected to increase by{' '}
            <span className="text-amber-400 font-semibold">25%</span> during the evening.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                if (onOpenReportModal) onOpenReportModal();
                else toast.info('Opening detailed bar operational report');
              }}
              className="h-9 px-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-slate-200 text-sm font-medium font-['Outfit'] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-300" />
              View AI Report
            </button>

            <button
              type="button"
              onClick={onOpenAIModal}
              className="h-9 px-4 bg-yellow-500 hover:bg-yellow-400 text-white rounded-lg font-semibold text-sm font-['Outfit'] shadow-md hover:shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              Ask Tavonza AI
            </button>
          </div>

          {/* Quick Priority Action Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {[
              'Prioritize VIP drink order #20581',
              'Prepare 2 Signature Mojitos',
              'Restock fresh mint leaves',
            ].map((actionText, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => toast.info(`Action initiated: ${actionText}`)}
                className="px-2.5 py-1.5 bg-neutral-800/80 hover:bg-neutral-800 rounded-md border border-amber-500/20 text-amber-400/90 hover:text-amber-300 text-sm font-medium font-['Plus_Jakarta_Sans'] transition-colors cursor-pointer"
              >
                {actionText}
              </button>
            ))}
          </div>
        </div>

        {/* Right Col (5 cols): Bar Capacity & Beverage Workflow */}
        <div className="lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-6 space-y-5">
          {/* Bar Capacity */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-white text-base font-semibold font-['Inter']">Bar Capacity</span>
              <span className="text-yellow-500 text-sm font-bold font-mono">74%</span>
            </div>

            {/* Capacity Progress Bar */}
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="w-[74%] h-full bg-yellow-500 rounded-full" />
            </div>

            {/* Key Capacity Metrics Row */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2 bg-neutral-800/60 rounded-lg border border-white/5 text-center">
                <div className="text-xs text-zinc-400 font-['Inter']">Bartenders</div>
                <div className="text-base font-bold text-white font-mono mt-0.5">02</div>
              </div>
              <div className="p-2 bg-neutral-800/60 rounded-lg border border-white/5 text-center">
                <div className="text-xs text-zinc-400 font-['Inter']">Queue</div>
                <div className="text-base font-bold text-white font-mono mt-0.5">18</div>
              </div>
              <div className="p-2 bg-neutral-800/60 rounded-lg border border-white/5 text-center">
                <div className="text-xs text-zinc-400 font-['Inter']">Avg Prep</div>
                <div className="text-base font-bold text-white font-mono mt-0.5">4 min</div>
              </div>
            </div>
          </div>

          {/* Beverage Workflow Stages */}
          <div className="space-y-2 border-t border-white/5 pt-3">
            <span className="text-white text-base font-semibold font-['Inter']">Beverage Workflow</span>

            <div className="grid grid-cols-4 gap-2">
              <div className="p-2.5 rounded-lg border border-white/10 bg-white/5 text-center">
                <div className="text-xs text-zinc-400 font-['Inter']">New</div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">07</div>
              </div>
              <div className="p-2.5 rounded-lg border border-white/10 bg-white/5 text-center">
                <div className="text-xs text-amber-400 font-['Inter']">Preparing</div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">08</div>
              </div>
              <div className="p-2.5 rounded-lg border border-white/10 bg-white/5 text-center">
                <div className="text-xs text-blue-400 font-['Inter']">Quality</div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">03</div>
              </div>
              <div className="p-2.5 rounded-lg border border-white/10 bg-white/5 text-center">
                <div className="text-xs text-emerald-400 font-['Inter']">Ready</div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">06</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
