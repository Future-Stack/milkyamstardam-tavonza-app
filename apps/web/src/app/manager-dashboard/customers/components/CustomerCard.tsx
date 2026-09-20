'use client';

import React from 'react';
import { Mail, Eye, Award, Star } from 'lucide-react';
import { ManagerCustomer } from '../../types';

interface CustomerCardProps {
  customer: ManagerCustomer;
  onView: (customer: ManagerCustomer) => void;
  onEmail: (customer: ManagerCustomer) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onView,
  onEmail,
}) => {
  return (
    <div className="w-full bg-white/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-lg p-3.5 flex flex-col justify-between transition-all hover:border-white/30 hover:bg-white/[0.07] group">
      {/* Top Row: Avatar Initials, Name, VIP Icon, and Star Rating */}
      <div className="flex items-start justify-between gap-2.5 pb-2.5 border-b border-neutral-800">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Avatar Initials badge */}
          <div className="w-9 h-9 shrink-0 bg-white/5 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[30px] flex items-center justify-center text-white text-sm font-bold font-['Plus_Jakarta_Sans']">
            {customer.initials}
          </div>

          {/* Name & Stars */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-200 text-base font-medium font-['Inter'] leading-tight truncate">
                {customer.name}
              </span>
              {customer.isVIP && (
                <Award
                  className="w-3.5 h-3.5 text-amber-500 shrink-0"
                />
              )}
            </div>

            {/* Star Rating (5 yellow stars) */}
            <div className="flex items-center gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 ${
                    i < customer.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-zinc-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Small VIP pill tag if VIP */}
        {customer.isVIP && (
          <span className="px-2 py-0.5 rounded text-xs font-semibold font-['Plus_Jakarta_Sans'] bg-amber-500/15 text-amber-400 border border-amber-500/20 shrink-0">
            VIP
          </span>
        )}
      </div>

      {/* Middle Row: 3 Stats Pills (Visits, Spent, Last Visit) */}
      <div className="grid grid-cols-3 gap-2 my-3">
        {/* Visits */}
        <div className="p-1.5 bg-white/5 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/5 backdrop-blur-[30px] flex flex-col items-center justify-center">
          <span className="text-blue-500 text-sm font-semibold font-['Inter'] leading-4">
            {customer.visits}
          </span>
          <span className="text-zinc-500 text-[10px] font-normal font-['Plus_Jakarta_Sans'] leading-3 mt-0.5">
            Visits
          </span>
        </div>

        {/* Spent */}
        <div className="p-1.5 bg-white/5 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/5 backdrop-blur-[30px] flex flex-col items-center justify-center">
          <span className="text-amber-500 text-sm font-bold font-['Inter'] leading-4">
            ${customer.spent.toLocaleString()}
          </span>
          <span className="text-zinc-500 text-[10px] font-normal font-['Plus_Jakarta_Sans'] leading-3 mt-0.5">
            Spent
          </span>
        </div>

        {/* Last Visit */}
        <div className="p-1.5 bg-white/5 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/5 backdrop-blur-[30px] flex flex-col items-center justify-center">
          <span className="text-emerald-500 text-sm font-bold font-['Inter'] leading-4 truncate max-w-full">
            {customer.lastVisit}
          </span>
          <span className="text-zinc-500 text-[10px] font-normal font-['Plus_Jakarta_Sans'] leading-3 mt-0.5">
            Last Visit
          </span>
        </div>
      </div>

      {/* Bottom Row: 2 Buttons (Email and View) */}
      <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onEmail(customer)}
          className="h-6.5 px-2 bg-white/5 hover:bg-white/10 rounded-[5px] flex items-center justify-center gap-1.5 text-slate-400 hover:text-white text-xs font-medium font-['Plus_Jakarta_Sans'] transition-colors cursor-pointer"
        >
          <Mail className="w-3 h-3 text-slate-400" />
          <span>Email</span>
        </button>

        <button
          type="button"
          onClick={() => onView(customer)}
          className="h-6.5 px-2 bg-white/5 hover:bg-white/10 rounded-[5px] flex items-center justify-center gap-1.5 text-white hover:text-amber-300 text-xs font-medium font-['Plus_Jakarta_Sans'] transition-colors cursor-pointer"
        >
          <Eye className="w-3 h-3 text-white" />
          <span>View</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerCard;
