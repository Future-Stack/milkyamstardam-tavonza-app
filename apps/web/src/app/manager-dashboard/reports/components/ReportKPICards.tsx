'use client';

import React from 'react';
import { AnalyticsKPIData } from '../../types';

interface ReportKPICardsProps {
  kpis: AnalyticsKPIData;
}

export const ReportKPICards: React.FC<ReportKPICardsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full select-none">
      {/* 1. Revenue Today */}
      <div className="h-32 p-5 bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-green-700/30 flex flex-col justify-between hover:outline-green-600/50 hover:bg-neutral-900/90 transition-all group">
        <div className="flex flex-col gap-1.5">
          <span className="text-neutral-500 text-sm font-semibold font-['Inter'] leading-5">
            Revenue Today
          </span>
          <span className="text-emerald-500 text-3xl font-bold font-['Inter'] leading-6 group-hover:scale-[1.02] transition-transform origin-left">
            {kpis.revenueToday}
          </span>
        </div>
        <div className="text-emerald-500 text-sm font-medium font-['Inter'] leading-4 flex items-center gap-1">
          <span>{kpis.revenueTrend}</span>
        </div>
      </div>

      {/* 2. Orders Today */}
      <div className="h-32 p-5 bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-blue-500/30 flex flex-col justify-between hover:outline-blue-500/50 hover:bg-neutral-900/90 transition-all group">
        <div className="flex flex-col gap-1.5">
          <span className="text-neutral-500 text-sm font-semibold font-['Inter'] leading-5">
            Orders Today
          </span>
          <span className="text-blue-500 text-3xl font-bold font-['Inter'] leading-6 group-hover:scale-[1.02] transition-transform origin-left">
            {kpis.ordersToday}
          </span>
        </div>
        <div className="text-sm font-medium font-['Inter'] leading-4 flex items-center gap-1">
          <span className="text-emerald-500">↑</span>
          <span className="text-slate-400">{kpis.ordersTrend.replace('↑', '').trim()}</span>
        </div>
      </div>

      {/* 3. Avg. Order Value */}
      <div className="h-32 p-5 bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-yellow-500/30 flex flex-col justify-between hover:outline-yellow-500/50 hover:bg-neutral-900/90 transition-all group">
        <div className="flex flex-col gap-1.5">
          <span className="text-neutral-500 text-sm font-semibold font-['Inter'] leading-5">
            Avg. Order Value
          </span>
          <span className="text-yellow-500 text-3xl font-bold font-['Inter'] leading-6 group-hover:scale-[1.02] transition-transform origin-left">
            {kpis.avgOrderValue}
          </span>
        </div>
        <div className="text-emerald-500 text-sm font-medium font-['Inter'] leading-4 flex items-center gap-1">
          <span>{kpis.avgOrderTrend}</span>
        </div>
      </div>

      {/* 4. Table Turnover */}
      <div className="h-32 p-5 bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-purple-500/30 flex flex-col justify-between hover:outline-purple-500/50 hover:bg-neutral-900/90 transition-all group">
        <div className="flex flex-col gap-1.5">
          <span className="text-neutral-500 text-sm font-semibold font-['Inter'] leading-5">
            Table Turnover
          </span>
          <span className="text-purple-500 text-3xl font-bold font-['Inter'] leading-6 group-hover:scale-[1.02] transition-transform origin-left">
            {kpis.tableTurnover}
          </span>
        </div>
        <div className="text-emerald-500 text-sm font-medium font-['Inter'] leading-4 flex items-center gap-1">
          <span>{kpis.turnoverSubtitle}</span>
        </div>
      </div>
    </div>
  );
};
