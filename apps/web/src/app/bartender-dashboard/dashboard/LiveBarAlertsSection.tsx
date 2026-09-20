'use client';

import React from 'react';
import { mockBarAlerts } from '../data';
import { Radio } from 'lucide-react';

export default function LiveBarAlertsSection() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-2xl space-y-4 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <h2 className="text-white text-base sm:text-lg font-semibold font-['Plus_Jakarta_Sans'] flex items-center gap-2">
          Live Bar Alerts
        </h2>
        <div className="px-2.5 py-0.5 bg-red-500/10 border border-red-500/30 rounded-full flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-red-400 text-xs font-bold font-mono uppercase tracking-wider">
            LIVE
          </span>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-2.5">
        {mockBarAlerts.map((alt) => (
          <div
            key={alt.id}
            className={`p-3 rounded-xl border ${alt.bgTint} ${alt.borderTint} flex items-start gap-3 transition-colors`}
          >
            <span className={`size-2 rounded-full ${alt.dotColor} mt-1.5 flex-shrink-0 animate-pulse`} />
            <p className="text-gray-300 text-sm font-normal font-['Inter'] leading-relaxed">
              {alt.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
