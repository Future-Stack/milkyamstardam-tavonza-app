'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { mockStaffRoster } from '../data';
import { StaffMemberCard } from './components/StaffMemberCard';
import { toast } from 'sonner';

export function StaffView() {
  const handlePage = (name: string) => {
    toast.info(`Direct message sent to ${name}'s terminal.`);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Inter'] flex items-center gap-2.5">
            <Users className="size-6 text-amber-400" />
            Floor Staff Active &amp; Section Roster
          </h1>
          <p className="text-zinc-400 text-sm font-['Inter'] mt-1">
            08 active / 10 rostered • All 4 floor zones staffed and operational.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info('Staff broadcast ping dispatched.')}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-400/30 text-xs font-semibold rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          Ping All Active Devices
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockStaffRoster.map((staff) => (
          <StaffMemberCard
            key={staff.id}
            staff={staff}
            onPage={handlePage}
          />
        ))}
      </div>
    </div>
  );
}

export default StaffView;
