'use client';

import React from 'react';
import {
  mockFloorOccupancy,
  mockSeatedGuests,
  mockStaffActive,
  mockFrontlineAlertsKPI,
} from '../data';
import { LayoutGrid, Users, ShieldCheck, AlertTriangle } from 'lucide-react';

export interface FloorKPICardsProps {
  onOpenAlertsSnapshot?: () => void;
  onOpenStaffView?: () => void;
}

export function FloorKPICards({
  onOpenAlertsSnapshot,
  onOpenStaffView,
}: FloorKPICardsProps) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {/* 1. Floor Occupancy */}
      <div className="h-32 px-3.5 py-4 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-600 bg-black/60 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-white text-base font-normal font-['Inter'] leading-5">
              Floor Occupancy
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-yellow-400 text-3xl font-medium font-['Inter'] leading-8">
                {mockFloorOccupancy.rate}
              </span>
              <span className="text-neutral-400 text-sm font-normal font-['Poppins']">
                {mockFloorOccupancy.tablesFraction}
              </span>
            </div>
          </div>
          <div className="size-7 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="size-4 text-amber-500" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/60">
          <span className="text-neutral-500 text-sm font-normal font-['Inter']">
            {mockFloorOccupancy.tablesOpen} tables open
          </span>
          <div className="px-2 py-0.5 bg-green-500/5 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-700 flex items-center">
            <span className="text-emerald-500 text-xs font-normal font-['Inter'] leading-4">
              {mockFloorOccupancy.bussingCount} bussing
            </span>
          </div>
        </div>
      </div>

      {/* 2. Seated Guests */}
      <div className="h-32 px-3.5 py-4 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-600 bg-black/60 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-white text-base font-normal font-['Inter'] leading-5">
              Seated Guests
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-yellow-400 text-3xl font-medium font-['Inter'] leading-8">
                {mockSeatedGuests.totalGuests}
              </span>
              <span className="text-neutral-400 text-sm font-normal font-['Poppins']">
                {mockSeatedGuests.unit}
              </span>
            </div>
          </div>
          <div className="size-7 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="size-4 text-amber-500" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/60">
          <span className="text-neutral-500 text-sm font-normal font-['Inter']">
            {mockSeatedGuests.subtitle}
          </span>
          <div className="px-2 py-0.5 rounded-[5px] flex items-center">
            <span className="text-emerald-500 text-xs font-normal font-['Inter'] leading-4">
              +{mockSeatedGuests.waitlistCount} waitlist
            </span>
          </div>
        </div>
      </div>

      {/* 3. Staff Active */}
      <div
        onClick={onOpenStaffView}
        className="h-32 px-3.5 py-4 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-600 bg-black/60 flex flex-col justify-between cursor-pointer hover:border-zinc-500 transition-colors"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-white text-base font-normal font-['Inter'] leading-5">
              Staff Active
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-yellow-400 text-3xl font-medium font-['Inter'] leading-8">
                {mockStaffActive.activeCount}
              </span>
              <span className="text-neutral-400 text-sm font-normal font-['Poppins']">
                {mockStaffActive.rosteredTotal}
              </span>
            </div>
          </div>
          <div className="size-7 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="size-4 text-amber-500" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/60">
          <span className="text-neutral-500 text-sm font-normal font-['Inter']">
            {mockStaffActive.coverageNote}
          </span>
        </div>
      </div>

      {/* 4. Frontline Alerts */}
      <div className="h-32 px-3.5 py-4 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-600 bg-black/60 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-white text-base font-normal font-['Inter'] leading-5">
              Frontline Alerts
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-yellow-400 text-3xl font-medium font-['Inter'] leading-8">
                {mockFrontlineAlertsKPI.pendingCount}
              </span>
              <span className="text-neutral-400 text-sm font-normal font-['Poppins']">
                {mockFrontlineAlertsKPI.statusLabel}
              </span>
            </div>
          </div>
          <div className="size-7 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="size-4 text-amber-500" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/60">
          <span className="text-neutral-500 text-sm font-normal font-['Inter']">
            {mockFrontlineAlertsKPI.actionNote}
          </span>
          <button
            type="button"
            onClick={onOpenAlertsSnapshot}
            className="text-emerald-500 text-xs font-normal font-['Inter'] underline leading-4 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            {mockFrontlineAlertsKPI.actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FloorKPICards;
