'use client';

import React from 'react';
import { Users, CheckCircle2, Calendar, DollarSign } from 'lucide-react';
import { TablesKPIStats } from '../../types';

interface TablesKPIsProps {
  stats: TablesKPIStats;
}

export const TablesKPIs: React.FC<TablesKPIsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
      {/* KPI 1: Occupied */}
      <div className="h-20 p-4 sm:p-5 bg-black rounded-xl border border-white/10 flex items-center gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-orange-500 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">
            {stats.occupiedText}
          </span>
          <span className="text-zinc-400 text-sm font-medium font-['Inter'] leading-4">
            Occupied
          </span>
        </div>
      </div>

      {/* KPI 2: Available */}
      <div className="h-20 p-4 sm:p-5 bg-black rounded-xl border border-white/10 flex items-center gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center text-green-500 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-green-500 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">
            {stats.availableCount}
          </span>
          <span className="text-zinc-400 text-sm font-medium font-['Inter'] leading-4">
            Available
          </span>
        </div>
      </div>

      {/* KPI 3: Reserved */}
      <div className="h-20 p-4 sm:p-5 bg-black rounded-xl border border-white/10 flex items-center gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-500 shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-blue-500 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">
            {stats.reservedCount}
          </span>
          <span className="text-zinc-400 text-sm font-medium font-['Inter'] leading-4">
            Reserved
          </span>
        </div>
      </div>

      {/* KPI 4: Active Revenue */}
      <div className="h-20 p-4 sm:p-5 bg-black rounded-xl border border-white/10 flex items-center gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-purple-500/15 flex items-center justify-center text-purple-500 shrink-0">
          <DollarSign className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-purple-400 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">
            ${stats.activeRevenue}
          </span>
          <span className="text-zinc-400 text-sm font-medium font-['Inter'] leading-4">
            Active Revenue
          </span>
        </div>
      </div>
    </div>
  );
};
