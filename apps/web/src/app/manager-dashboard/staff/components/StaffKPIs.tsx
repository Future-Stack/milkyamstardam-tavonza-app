'use client';

import React from 'react';
import { Users, UserCheck, ChefHat, Star } from 'lucide-react';
import { StaffKPIsData } from '../../types';

interface StaffKPIsProps {
  kpis: StaffKPIsData;
  onFilterRole?: (role: string) => void;
}

export const StaffKPIs: React.FC<StaffKPIsProps> = ({ kpis, onFilterRole }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. On Duty Card */}
      <div
        onClick={() => onFilterRole && onFilterRole('All')}
        className="p-5 bg-black rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-sm font-medium font-['Inter']">On Duty</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-4xl font-bold font-['Inter'] text-white tracking-tight">
          {kpis.onDutyCount}
        </div>
        <div className="text-sm font-medium text-slate-400 mt-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{kpis.onDutySubtitle}</span>
        </div>
      </div>

      {/* 2. Waiters Active Card */}
      <div
        onClick={() => onFilterRole && onFilterRole('Waiters')}
        className="p-5 bg-black rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-sm font-medium font-['Inter']">Waiters Active</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-4xl font-bold font-['Inter'] text-white tracking-tight">
          {kpis.waitersActiveCount < 10 ? `0${kpis.waitersActiveCount}` : kpis.waitersActiveCount}
        </div>
        <div className="text-sm font-medium text-slate-400 mt-1">
          {kpis.waitersSubtitle}
        </div>
      </div>

      {/* 3. Kitchen Staff Card */}
      <div
        onClick={() => onFilterRole && onFilterRole('Kitchen')}
        className="p-5 bg-black rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-sm font-medium font-['Inter']">Kitchen Staff</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <ChefHat className="w-4 h-4" />
          </div>
        </div>
        <div className="text-4xl font-bold font-['Inter'] text-white tracking-tight">
          {kpis.kitchenStaffCount < 10 ? `0${kpis.kitchenStaffCount}` : kpis.kitchenStaffCount}
        </div>
        <div className="text-sm font-medium text-slate-400 mt-1">
          {kpis.kitchenSubtitle}
        </div>
      </div>

      {/* 4. Avg. Rating Card */}
      <div className="p-5 bg-black rounded-xl border border-white/10 hover:border-white/20 transition-all group">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-sm font-medium font-['Inter']">Avg. Rating</span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
            <Star className="w-4 h-4" />
          </div>
        </div>
        <div className="text-4xl font-bold font-['Inter'] text-white tracking-tight">
          {kpis.avgRating.toFixed(1)}
        </div>
        <div className="text-sm font-medium text-slate-400 mt-1">
          {kpis.ratingSubtitle}
        </div>
      </div>
    </div>
  );
};
