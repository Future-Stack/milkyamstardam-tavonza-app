'use client';

import React from 'react';
import { Activity, Sparkles } from 'lucide-react';
import { HealthMetric } from '../types';

interface OperationsHealthCardProps {
  score: number;
  ratingText: string;
  metrics: HealthMetric[];
}

export const OperationsHealthCard: React.FC<OperationsHealthCardProps> = ({
  score,
  ratingText,
  metrics,
}) => {
  return (
    <div className="w-full bg-black rounded-[10px] border border-white/10 shadow-lg p-5 flex flex-col justify-between">
      {/* Header with overall score */}
      <div className="flex items-start justify-between pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" />
            <h3 className="text-white text-lg font-semibold font-['Inter']">
              Operations Health
            </h3>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-amber-500 text-xs font-medium font-['Plus_Jakarta_Sans']">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{ratingText}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-amber-500 text-xl font-bold font-mono">{score}</span>
          <span className="text-amber-500/70 text-sm font-mono">/100</span>
        </div>
      </div>

      {/* 5 Health Metric Progress Bars */}
      <div className="mt-3 space-y-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm font-['Plus_Jakarta_Sans']">
              <span className="text-neutral-300 text-sm font-normal">
                {metric.label}
              </span>
              <span className="text-right font-mono font-medium text-sm text-neutral-200">
                {metric.score}
              </span>
            </div>

            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${metric.color}`}
                style={{ width: `${metric.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
        <span>Target benchmark: &gt; 90</span>
        <span className="text-emerald-400 font-medium">Healthy</span>
      </div>
    </div>
  );
};
