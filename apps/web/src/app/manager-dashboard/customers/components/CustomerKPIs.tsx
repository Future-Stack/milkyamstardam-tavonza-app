'use client';

import React from 'react';
import { CustomerKPIsData } from '../../types';

interface CustomerKPIsProps {
  kpis: CustomerKPIsData;
}

export const CustomerKPIs: React.FC<CustomerKPIsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* Total Customers */}
      <div className="h-24 relative bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-zinc-300/25 overflow-hidden p-4 flex flex-col justify-between">
        <div className="text-zinc-400 text-sm font-semibold font-['Inter'] leading-5">
          Total Customers
        </div>
        <div className="text-emerald-500 text-3xl font-bold font-['Inter'] leading-tight">
          {kpis.totalCustomers.toLocaleString()}
        </div>
        <div className="text-slate-400 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4 flex items-center gap-1">
          {kpis.totalCustomersSubtitle}
        </div>
      </div>

      {/* VIP Members */}
      <div className="h-24 relative bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-zinc-300/25 overflow-hidden p-4 flex flex-col justify-between">
        <div className="text-zinc-400 text-sm font-semibold font-['Inter'] leading-5">
          VIP Members
        </div>
        <div className="text-amber-500 text-3xl font-bold font-['Inter'] leading-tight">
          {kpis.vipMembers.toLocaleString()}
        </div>
        <div className="text-slate-400 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4">
          {kpis.vipSubtitle}
        </div>
      </div>

      {/* Avg. Rating */}
      <div className="h-24 relative bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-zinc-300/25 overflow-hidden p-4 flex flex-col justify-between">
        <div className="text-zinc-400 text-sm font-semibold font-['Inter'] leading-5">
          Avg. Rating
        </div>
        <div className="text-emerald-500 text-3xl font-bold font-['Inter'] leading-tight">
          {kpis.avgRating.toFixed(1)}
        </div>
        <div className="text-slate-400 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4">
          {kpis.avgRatingSubtitle}
        </div>
      </div>

      {/* Return Rate */}
      <div className="h-24 relative bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-zinc-300/25 overflow-hidden p-4 flex flex-col justify-between">
        <div className="text-zinc-400 text-sm font-semibold font-['Inter'] leading-5">
          Return Rate
        </div>
        <div className="text-blue-500 text-3xl font-bold font-['Inter'] leading-tight">
          {kpis.returnRate}%
        </div>
        <div className="text-slate-400 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4">
          {kpis.returnRateSubtitle}
        </div>
      </div>
    </div>
  );
};

export default CustomerKPIs;
