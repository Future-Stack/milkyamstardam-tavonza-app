'use client';

import React from 'react';
import { X, Clock, Calendar } from 'lucide-react';
import { StaffMember } from '../../types';

interface StaffScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffMembers: StaffMember[];
}

export const StaffScheduleModal: React.FC<StaffScheduleModalProps> = ({
  isOpen,
  onClose,
  staffMembers,
}) => {
  if (!isOpen) return null;

  const morningShift = staffMembers.filter(
    (s) => s.shift.includes('8AM') || s.shift.includes('7AM') || s.shift.includes('9AM')
  );
  const afternoonShift = staffMembers.filter(
    (s) =>
      s.shift.includes('11AM') ||
      s.shift.includes('12PM') ||
      s.shift.includes('10AM') ||
      s.shift.includes('4PM')
  );

  return (
    <div className="fixed inset-0 lg:left-72 top-20 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-black border border-white/15 rounded-2xl p-6 shadow-2xl space-y-6 font-['Inter'] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold font-['Inter']">
                Today’s Shift Schedule
              </h2>
              <p className="text-zinc-400 text-sm mt-0.5">
                Wednesday, July 16 · Downtown Branch · All Stations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="space-y-5 overflow-y-auto flex-1 custom-scrollbar pr-1">
          {/* Morning Shift */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-400 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Morning Shift (7:00 AM – 4:00 PM)</span>
              </div>
              <span className="text-sm text-zinc-400">
                {morningShift.length} staff scheduled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {morningShift.map((s) => (
                <div
                  key={s.id}
                  className="p-3 bg-zinc-800/80 rounded-xl border border-white/5 flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center font-bold text-white text-xs">
                      {s.initials}
                    </div>
                    <div>
                      <span className="font-semibold text-white block">{s.fullName}</span>
                      <span className="text-zinc-400 text-xs">{s.role}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-300 font-mono text-xs block">{s.shift}</span>
                    <span className={`text-xs ${s.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      ● {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mid-day / Afternoon Shift */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-400 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Afternoon & Evening Shift (10:00 AM – 8:00 PM)</span>
              </div>
              <span className="text-sm text-zinc-400">
                {afternoonShift.length} staff scheduled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {afternoonShift.map((s) => (
                <div
                  key={s.id}
                  className="p-3 bg-zinc-800/80 rounded-xl border border-white/5 flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center font-bold text-white text-xs">
                      {s.initials}
                    </div>
                    <div>
                      <span className="font-semibold text-white block">{s.fullName}</span>
                      <span className="text-zinc-400 text-xs">{s.role}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-300 font-mono text-xs block">{s.shift}</span>
                    <span className={`text-xs ${s.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      ● {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Close Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
