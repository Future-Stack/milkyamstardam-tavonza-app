'use client';

import React from 'react';
import { User, ShieldCheck, Mail, Clock, Award, Building } from 'lucide-react';

export function ProfileView() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white font-['Inter'] flex items-center gap-2.5">
          <User className="size-6 text-amber-400" />
          Manager Profile
        </h1>
        <p className="text-zinc-400 text-sm font-['Inter'] mt-1">
          Assistant Manager credentials, active shift privileges, and operational security tier.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6">
        <img
          src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80"
          alt="Marcus Vance"
          className="size-24 rounded-full border-2 border-amber-400 object-cover shadow-lg"
        />
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white font-['Poppins']">Marcus Vance</h2>
            <span className="px-2.5 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-full">
              Level 2 Manager PIN: Enabled
            </span>
          </div>
          <p className="text-zinc-400 text-sm font-['Inter']">
            Assistant Manager • Tavonza AI Hospitality Downtown Branch
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-zinc-400 pt-2">
            <span className="flex items-center gap-1.5">
              <Building className="size-3.5 text-zinc-500" /> Downtown Branch (#DT-01)
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5 text-zinc-500" /> marcus.v@tavonza.ai
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-zinc-500" /> Shift: 07:30 AM - 04:00 PM
            </span>
          </div>
        </div>
      </div>

      {/* Privileges & Permissions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
          <h3 className="text-white text-base font-semibold font-['Inter'] flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-400" /> Authorized Floor Privileges
          </h3>
          <ul className="space-y-2 text-xs text-zinc-300">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Void / Comp items up to $150.00 without RM secondary code
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Table transfer and split check overrides
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Live 86&apos;d stock toggle &amp; POS kitchen broadcast
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Shift handoff sign-off and morning cash drawer tally
            </li>
          </ul>
        </div>

        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
          <h3 className="text-white text-base font-semibold font-['Inter'] flex items-center gap-2">
            <Award className="size-4 text-amber-400" /> Performance Badges
          </h3>
          <div className="space-y-2 text-xs text-zinc-300">
            <div className="p-2 bg-zinc-900 rounded-lg flex items-center justify-between">
              <span>Average Floor Turn Time</span>
              <span className="text-emerald-400 font-semibold">51m (Goal: &lt;60m)</span>
            </div>
            <div className="p-2 bg-zinc-900 rounded-lg flex items-center justify-between">
              <span>Bussing Turnaround</span>
              <span className="text-emerald-400 font-semibold">6.8m (Fastest in Branch)</span>
            </div>
            <div className="p-2 bg-zinc-900 rounded-lg flex items-center justify-between">
              <span>VIP Satisfaction Rating</span>
              <span className="text-yellow-400 font-semibold">4.9 / 5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
