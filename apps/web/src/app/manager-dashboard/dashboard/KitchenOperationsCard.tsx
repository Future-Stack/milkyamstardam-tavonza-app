'use client';

import React from 'react';
import { ChevronRight, ChefHat, AlertTriangle } from 'lucide-react';
import { KitchenOpsSummary } from '../types';

interface KitchenOperationsCardProps {
  summary: KitchenOpsSummary;
  onOpenKDS?: () => void;
}

export const KitchenOperationsCard: React.FC<KitchenOperationsCardProps> = ({
  summary,
  onOpenKDS,
}) => {
  return (
    <div className="w-full bg-black rounded-[10px] border border-white/10 shadow-lg p-5 flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ChefHat className="w-4 h-4 text-amber-500" />
          <h3 className="text-white text-lg font-semibold font-['Inter']">
            Kitchen Operations
          </h3>
        </div>
        <button
          type="button"
          onClick={onOpenKDS}
          className="text-amber-500 hover:text-amber-400 text-base font-medium font-['Inter'] inline-flex items-center gap-1 transition-colors group"
        >
          KDS
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 2x2 Grid of Metrics */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* Queue */}
        <div className="p-3 bg-white/[0.04] rounded-[6px] border border-white/10 backdrop-blur-lg flex flex-col items-center justify-center hover:bg-white/[0.07] transition-colors">
          <span className="text-orange-500 text-2xl font-bold font-mono">
            {summary.queueCount}
          </span>
          <span className="text-white text-xs font-normal font-['Plus_Jakarta_Sans'] mt-0.5">
            Queue
          </span>
        </div>

        {/* Completed */}
        <div className="p-3 bg-white/[0.04] rounded-[6px] border border-white/10 backdrop-blur-lg flex flex-col items-center justify-center hover:bg-white/[0.07] transition-colors">
          <span className="text-emerald-500 text-2xl font-bold font-mono">
            {summary.completedCount}
          </span>
          <span className="text-white text-xs font-normal font-['Plus_Jakarta_Sans'] mt-0.5">
            Completed
          </span>
        </div>

        {/* Delayed */}
        <div className="p-3 bg-white/[0.04] rounded-[6px] border border-white/10 backdrop-blur-lg flex flex-col items-center justify-center hover:bg-white/[0.07] transition-colors">
          <span className="text-red-500 text-2xl font-bold font-mono">
            {String(summary.delayedCount).padStart(2, '0')}
          </span>
          <span className="text-white text-xs font-normal font-['Plus_Jakarta_Sans'] mt-0.5">
            Delayed
          </span>
        </div>

        {/* Avg Time */}
        <div className="p-3 bg-white/[0.04] rounded-[6px] border border-white/10 backdrop-blur-lg flex flex-col items-center justify-center hover:bg-white/[0.07] transition-colors">
          <span className="text-blue-500 text-2xl font-bold font-mono">
            {summary.avgTime}
          </span>
          <span className="text-white text-xs font-normal font-['Plus_Jakarta_Sans'] mt-0.5">
            Avg Prep
          </span>
        </div>
      </div>

      {/* Station Alert Box */}
      <div className="mt-4 p-2.5 bg-amber-500/10 rounded-[6px] border border-amber-500/25 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-yellow-400/90 text-sm font-normal font-['Inter'] leading-snug">
          {summary.stationAlert}
        </p>
      </div>
    </div>
  );
};
