'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';
import { LiveOrdersKPIData } from '../../types';

interface LiveOrdersKPIsProps {
  data: LiveOrdersKPIData;
}

export const LiveOrdersKPIs: React.FC<LiveOrdersKPIsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Active Orders */}
      <div className="p-5 bg-black rounded-xl border border-white/10 flex flex-col justify-between hover:bg-zinc-950 transition-all group">
        <div>
          <span className="text-white text-sm font-normal font-['Plus_Jakarta_Sans']">
            Active Orders
          </span>
          <div className="text-white text-3xl font-bold font-['Inter'] mt-2">
            {data.activeOrders}
          </div>
        </div>
        <div className="pt-3 flex items-center gap-1.5 text-sm text-neutral-400 font-['Plus_Jakarta_Sans']">
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{data.activeOrdersSubtitle}</span>
        </div>
      </div>

      {/* 2. Avg. Wait Time */}
      <div className="p-5 bg-black rounded-xl border border-white/10 flex flex-col justify-between hover:bg-zinc-950 transition-all group">
        <div>
          <span className="text-white text-sm font-normal font-['Plus_Jakarta_Sans']">
            Avg. Wait Time
          </span>
          <div className="text-white text-3xl font-bold font-['Inter'] mt-2">
            {data.avgWaitTime}
          </div>
        </div>
        <div className="pt-3 flex items-center gap-1.5 text-sm text-neutral-400 font-['Plus_Jakarta_Sans']">
          <ArrowDownRight className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{data.avgWaitTimeSubtitle}</span>
        </div>
      </div>

      {/* 3. Delayed Orders */}
      <div className="p-5 bg-black rounded-xl border border-white/10 flex flex-col justify-between hover:bg-zinc-950 transition-all group">
        <div>
          <span className="text-white text-sm font-normal font-['Plus_Jakarta_Sans']">
            Delayed Orders
          </span>
          <div className="text-white text-3xl font-bold font-['Inter'] mt-2">
            {String(data.delayedOrders).padStart(2, '0')}
          </div>
        </div>
        <div className="pt-3 flex items-center gap-1.5 text-sm text-amber-400 font-['Plus_Jakarta_Sans']">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{data.delayedOrdersSubtitle}</span>
        </div>
      </div>

      {/* 4. Revenue Today */}
      <div className="p-5 bg-black rounded-xl border border-white/10 flex flex-col justify-between hover:bg-zinc-950 transition-all group">
        <div>
          <span className="text-white text-sm font-normal font-['Plus_Jakarta_Sans']">
            Revenue Today
          </span>
          <div className="text-emerald-400 text-3xl font-bold font-['Inter'] mt-2">
            {data.revenueToday}
          </div>
        </div>
        <div className="pt-3 flex items-center gap-1.5 text-sm text-neutral-400 font-['Plus_Jakarta_Sans']">
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{data.revenueTodaySubtitle}</span>
        </div>
      </div>
    </div>
  );
};
