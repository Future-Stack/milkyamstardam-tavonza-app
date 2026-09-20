'use client';

import React from 'react';
import { QrCode, Smartphone, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { QRStatsData } from '../../types';

interface QRStatsKPIsProps {
  stats: QRStatsData;
}

export const QRStatsKPIs: React.FC<QRStatsKPIsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
      {/* Card 1: Active QR Codes */}
      <div className="h-24 bg-black rounded-xl border border-white/10 p-4 flex flex-col justify-between overflow-hidden relative hover:bg-zinc-950 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400 text-sm font-semibold font-['Inter'] leading-5">
            Active QR Codes
          </span>
          <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <QrCode className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <span className="text-emerald-500 text-2xl font-bold font-['Inter'] leading-5">
            {stats.activeQRCodes}
          </span>
          <p className="text-slate-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4 mt-0.5">
            {stats.activeSubtitle}
          </p>
        </div>
      </div>

      {/* Card 2: Scans Today */}
      <div className="h-24 bg-black rounded-xl border border-white/10 p-4 flex flex-col justify-between overflow-hidden relative hover:bg-zinc-950 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400 text-sm font-semibold font-['Inter'] leading-5">
            Scans Today
          </span>
          <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Smartphone className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <span className="text-blue-500 text-2xl font-bold font-['Inter'] leading-5">
            {stats.scansToday}
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <p className="text-slate-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4">
              {stats.scansGrowth}
            </p>
          </div>
        </div>
      </div>

      {/* Card 3: Orders via QR */}
      <div className="h-24 bg-black rounded-xl border border-white/10 p-4 flex flex-col justify-between overflow-hidden relative hover:bg-zinc-950 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400 text-sm font-semibold font-['Inter'] leading-5">
            Orders via QR
          </span>
          <div className="w-6 h-6 rounded-md bg-yellow-500/10 flex items-center justify-center text-yellow-500">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <span className="text-yellow-500 text-2xl font-bold font-['Inter'] leading-5">
            {stats.ordersViaQRPercent}%
          </span>
          <p className="text-slate-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4 mt-0.5">
            {stats.ordersSubtitle}
          </p>
        </div>
      </div>

      {/* Card 4: Avg. Order Value */}
      <div className="h-24 bg-black rounded-xl border border-white/10 p-4 flex flex-col justify-between overflow-hidden relative hover:bg-zinc-950 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400 text-sm font-semibold font-['Inter'] leading-5">
            Avg. Order Value
          </span>
          <div className="w-6 h-6 rounded-md bg-violet-500/10 flex items-center justify-center text-violet-400">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <span className="text-violet-500 text-2xl font-bold font-['Inter'] leading-5">
            ${stats.avgOrderValue.toFixed(2)}
          </span>
          <p className="text-slate-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4 mt-0.5">
            {stats.avgSubtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
