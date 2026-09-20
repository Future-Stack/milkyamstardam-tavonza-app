'use client';

import React from 'react';
import { Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { AnalyticsTimeframe } from '../../types';

interface ReportHeaderProps {
  timeframe: AnalyticsTimeframe;
  onTimeframeChange: (tf: AnalyticsTimeframe) => void;
  onExportPDF?: () => void;
  onAskAI?: () => void;
}

const TIMEFRAMES: AnalyticsTimeframe[] = ['Today', 'This Week', 'This Month', 'This Quarter'];

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  timeframe,
  onTimeframeChange,
  onExportPDF,
  onAskAI,
}) => {
  const handleExport = () => {
    if (onExportPDF) {
      onExportPDF();
    } else {
      toast.success('Generating Downtown Branch Executive Performance Report PDF...');
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-white text-3xl sm:text-4xl font-semibold font-['Inter'] leading-9 tracking-tight">
          Analytics
        </h1>
        <p className="text-slate-400 text-base sm:text-lg font-normal font-['Inter'] leading-6 mt-1">
          Deep dive into your restaurant performance metrics.
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Ask AI Copilot pill */}
        {onAskAI && (
          <button
            type="button"
            onClick={onAskAI}
            className="h-9 px-3 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-400 text-sm font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Analysis</span>
          </button>
        )}

        {/* Timeframe selector & Export PDF split button */}
        <div className="inline-flex items-center rounded-lg overflow-hidden border border-neutral-700/60 bg-neutral-900/80 shadow-sm">
          {TIMEFRAMES.map((tf, index) => {
            const isSelected = timeframe === tf;
            const isFirst = index === 0;

            return (
              <button
                key={tf}
                type="button"
                onClick={() => onTimeframeChange(tf)}
                className={`h-9 px-3.5 text-sm sm:text-base font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-yellow-500 text-white font-semibold shadow-inner'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                } ${!isFirst ? 'border-l border-neutral-700/60' : ''}`}
              >
                {tf}
              </button>
            );
          })}

          {/* Export PDF */}
          <button
            type="button"
            onClick={handleExport}
            className="h-9 px-3.5 border-l border-neutral-700/60 text-sm sm:text-base font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
