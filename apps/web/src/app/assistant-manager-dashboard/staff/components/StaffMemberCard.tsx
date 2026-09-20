'use client';

import React from 'react';
import { MapPin, Clock, Smartphone } from 'lucide-react';
import { StaffMember } from '../../types';

export interface StaffMemberCardProps {
  staff: StaffMember;
  onPage: (name: string) => void;
}

export function StaffMemberCard({ staff, onPage }: StaffMemberCardProps) {
  return (
    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col justify-between gap-3 hover:border-zinc-700 transition-colors shadow-sm">
      <div className="space-y-2.5">
        <div className="flex items-center gap-3">
          <img
            src={staff.avatar}
            alt={staff.name}
            className="size-11 rounded-full object-cover border border-zinc-700"
          />
          <div className="min-w-0">
            <div className="text-white text-base font-semibold font-['Inter'] truncate">
              {staff.name}
            </div>
            <div className="text-zinc-400 text-xs truncate">{staff.role}</div>
          </div>
        </div>

        <div className="space-y-1 text-xs text-zinc-400 border-t border-zinc-900 pt-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-zinc-300 font-medium">Zone:</span> {staff.zone}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-zinc-500 flex-shrink-0" />
            <span>Shift: {staff.shiftHours}</span>
          </div>
          {staff.activeTables > 0 && (
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Smartphone className="size-3.5" />
              <span>Managing {staff.activeTables} active tables</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium rounded-md">
          Active On Duty
        </span>
        <button
          type="button"
          onClick={() => onPage(staff.name)}
          className="text-xs text-yellow-400 hover:underline cursor-pointer"
        >
          Page
        </button>
      </div>
    </div>
  );
}

export default StaffMemberCard;
