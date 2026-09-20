'use client';

import React from 'react';
import { Search, Calendar, Plus } from 'lucide-react';

interface StaffFilterBarProps {
  selectedRole: string;
  onSelectRole: (role: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenScheduleModal: () => void;
  onOpenAddModal: () => void;
}

const roleOptions = [
  'All Roles',
  'Waiters',
  'Kitchen',
  'Bartenders',
  'Hosts',
  'Managers',
];

const statusOptions = ['All Status', 'Active', 'On Break'];

export const StaffFilterBar: React.FC<StaffFilterBarProps> = ({
  selectedRole,
  onSelectRole,
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
  onOpenScheduleModal,
  onOpenAddModal,
}) => {
  return (
    <div className="space-y-4">
      {/* Top row: Role filter pills & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Role Pills */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          {roleOptions.map((role) => {
            const isActive = selectedRole.toLowerCase() === role.toLowerCase();
            return (
              <button
                key={role}
                type="button"
                onClick={() => onSelectRole(role)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium font-['Inter'] whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-black text-white font-semibold shadow-sm border border-white/20'
                    : 'bg-black/60 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-white/10'
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Schedule & Add Staff Member */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenScheduleModal}
            className="px-3.5 py-2 rounded-lg bg-black hover:bg-zinc-950 border border-white/10 text-white text-sm font-semibold font-['Inter'] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>Schedule</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold font-['Inter'] flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4 text-white stroke-[3]" />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Search input & Status toggle pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search staff by name, role, email..."
            className="w-full h-9 pl-9 pr-4 bg-black rounded-lg border border-white/10 text-sm text-white placeholder:text-zinc-500 focus:outline-amber-500/50 transition-colors font-['Inter']"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5">
          {statusOptions.map((status) => {
            const isActive = selectedStatus.toLowerCase() === status.toLowerCase();
            return (
              <button
                key={status}
                type="button"
                onClick={() => onSelectStatus(status)}
                className={`px-3 py-1 rounded-md text-sm font-medium font-['Inter'] transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-black text-amber-400 border border-amber-500/30 font-semibold'
                    : 'bg-black text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
