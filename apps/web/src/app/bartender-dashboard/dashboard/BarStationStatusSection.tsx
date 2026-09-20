'use client';

import React from 'react';
import { mockBarStations } from '../data';
import { Wine, Coffee, GlassWater, Sparkles } from 'lucide-react';

export default function BarStationStatusSection() {
  const stationIcons = [Wine, Coffee, GlassWater, Sparkles];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="border-b border-white/5 pb-2">
        <h2 className="text-white text-lg font-semibold font-['Inter'] leading-tight">
          Bar Stations
        </h2>
        <p className="text-neutral-400 text-sm font-medium font-['Inter'] mt-0.5">
          Station Status
        </p>
      </div>

      {/* Station List */}
      <div className="space-y-2.5">
        {mockBarStations.map((station, idx) => {
          const Icon = stationIcons[idx] || Wine;
          return (
            <div
              key={station.id}
              className="p-3 bg-gray-800/40 rounded-xl border border-white/5 flex items-center justify-between gap-3 hover:bg-gray-800/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 bg-white/10 rounded-lg border border-white/10 flex items-center justify-center text-gray-300">
                  <Icon className="w-4 h-4 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-gray-200 text-base font-medium font-['Outfit'] leading-tight">
                    {station.name}
                  </h3>
                  <p className="text-gray-500 text-sm font-normal font-mono">
                    {station.activeOrders} active orders
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                <span className={`size-1.5 rounded-full ${station.dotColor} animate-pulse`} />
                <span className={`text-sm font-medium font-mono ${station.statusColor}`}>
                  {station.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
