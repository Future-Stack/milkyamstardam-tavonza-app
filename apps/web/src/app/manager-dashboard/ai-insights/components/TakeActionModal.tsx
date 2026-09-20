'use client';

import React from 'react';
import { X, Sparkles, CheckCircle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { AIInsightItem } from '../../types';

interface TakeActionModalProps {
  insight: AIInsightItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAction: (insightId: string) => void;
  onAskAI: (prompt: string) => void;
}

export const TakeActionModal: React.FC<TakeActionModalProps> = ({
  insight,
  isOpen,
  onClose,
  onConfirmAction,
  onAskAI,
}) => {
  if (!isOpen || !insight) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-xl shadow-2xl p-6 relative font-['Inter']">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-white text-xl font-semibold">{insight.title}</h2>
            <span className="text-sm text-amber-400 font-medium">Tavonza AI Recommendation</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="mt-5 space-y-4 text-sm">
          {/* Summary Box */}
          <div className="p-3.5 bg-black/40 border border-white/5 rounded-lg">
            <span className="text-neutral-400 block mb-1">Operational Observation</span>
            <p className="text-white text-base leading-relaxed">{insight.description}</p>
          </div>

          {/* Impact Metric & Action */}
          {insight.impactMetric && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="font-semibold">Projected Impact:</span>
              <span>{insight.impactMetric}</span>
            </div>
          )}

          {insight.recommendedAction && (
            <div className="p-3.5 bg-zinc-800/60 border border-white/5 rounded-lg">
              <span className="text-neutral-400 block mb-1 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                Recommended Execution Step:
              </span>
              <p className="text-neutral-200 text-sm leading-5">{insight.recommendedAction}</p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              onAskAI(`Tell me more details and risks about applying AI recommendation: "${insight.title}" - ${insight.description}`);
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-neutral-300 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Ask AI Details
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirmAction(insight.id);
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-white text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5 text-white" />
            <span>Apply Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
