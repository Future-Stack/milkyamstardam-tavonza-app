'use client';

import React from 'react';
import { Award, Sparkles, TrendingUp } from 'lucide-react';

export default function TodayBarPerformanceSection() {
  const metrics = [
    { label: 'Beverage Accuracy', value: '99.2%', sub: 'Target: 98%' },
    { label: 'On-Time Pour Rate', value: '96.8%', sub: 'Target: 95%' },
    { label: 'Speed Benchmark', value: '3.2m', sub: 'Target: 4.5m' },
    { label: 'Guest Rating', value: '4.9/5', sub: 'Based on 142 drinks' },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-2xl space-y-4 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="border-b border-white/5 pb-2">
        <h2 className="text-white text-base sm:text-lg font-semibold font-['Plus_Jakarta_Sans'] flex items-center gap-2">
          Today&apos;s Bar Performance
        </h2>
      </div>

      {/* 2x2 Metric Grid */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1"
          >
            <span className="text-zinc-400 text-sm font-normal font-['Outfit'] block">
              {m.label}
            </span>
            <span className="text-gray-200 text-2xl sm:text-3xl font-bold font-mono block">
              {m.value}
            </span>
            <span className="text-zinc-500 text-xs font-mono block">
              {m.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Insight Banner */}
      <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-300 font-['Outfit'] leading-relaxed">
          Serving beverages within 5 minutes has increased customer satisfaction by{' '}
          <span className="text-amber-400 font-semibold">14%</span> today.
        </p>
      </div>
    </div>
  );
}
