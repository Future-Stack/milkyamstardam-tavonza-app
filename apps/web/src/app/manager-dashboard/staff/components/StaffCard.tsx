'use client';

import React from 'react';
import { Clock, Phone, Mail, MoreVertical } from 'lucide-react';
import { StaffMember } from '../../types';

interface StaffCardProps {
  member: StaffMember;
  onToggleStatus: (id: string) => void;
  onSelectMember?: (member: StaffMember) => void;
}

export const StaffCard: React.FC<StaffCardProps> = ({
  member,
  onToggleStatus,
  onSelectMember,
}) => {
  // Role badge color mapping
  const getRoleBadgeStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case 'waiter':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'chef':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'bartender':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'manager':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'host':
        return 'bg-teal-500/15 text-teal-400 border-teal-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-white/10';
    }
  };

  const isActive = member.status === 'Active';

  return (
    <div className="bg-black border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-sm hover:border-white/20 transition-all group">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {/* Avatar box */}
          <div className="w-11 h-11 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center text-white font-bold text-base tracking-tight shrink-0 shadow-inner">
            {member.initials}
          </div>

          {/* Name & Role/Status Row */}
          <div>
            <h3 className="text-white font-bold text-lg font-['Inter'] leading-tight group-hover:text-amber-400 transition-colors">
              {member.fullName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-0.5 rounded-md border text-xs font-semibold font-['Inter'] ${getRoleBadgeStyle(
                  member.role
                )}`}
              >
                {member.role}
              </span>

              <button
                type="button"
                onClick={() => onToggleStatus(member.id)}
                title="Click to toggle status"
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <span
                  className={`text-sm font-medium font-['Inter'] ${
                    isActive ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {member.status}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Action button */}
        {onSelectMember && (
          <button
            type="button"
            onClick={() => onSelectMember(member)}
            className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="View Details"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Middle Stats Grid (3 Boxes matching Screenshot 1) */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        {/* Box 1: Tables (Blue) */}
        <div className="bg-zinc-950 rounded-xl py-3 px-2 flex flex-col items-center justify-center border border-white/10">
          <span className="text-blue-400 font-bold text-2xl font-['Inter'] leading-tight">
            {member.tablesCount}
          </span>
          <span className="text-zinc-400 text-sm font-medium font-['Inter'] mt-0.5">
            Tables
          </span>
        </div>

        {/* Box 2: Orders (Amber) */}
        <div className="bg-zinc-950 rounded-xl py-3 px-2 flex flex-col items-center justify-center border border-white/10">
          <span className="text-amber-500 font-bold text-2xl font-['Inter'] leading-tight">
            {member.ordersCount}
          </span>
          <span className="text-zinc-400 text-sm font-medium font-['Inter'] mt-0.5">
            Orders
          </span>
        </div>

        {/* Box 3: Rating (Emerald Green) */}
        <div className="bg-zinc-950 rounded-xl py-3 px-2 flex flex-col items-center justify-center border border-white/10">
          <span className="text-emerald-400 font-bold text-2xl font-['Inter'] leading-tight">
            {member.rating.toFixed(1)}
          </span>
          <span className="text-zinc-400 text-sm font-medium font-['Inter'] mt-0.5">
            Rating
          </span>
        </div>
      </div>

      {/* Bottom Shift Footer */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-sm text-zinc-400 font-['Inter']">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <span>{member.shift}</span>
        </div>

        <div className="flex items-center gap-2">
          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              className="p-1 hover:text-white transition-colors"
              title={member.phone}
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="p-1 hover:text-white transition-colors"
              title={member.email}
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
