'use client';

import React, { useState, useEffect } from 'react';
import {
  Store,
  ChevronDown,
  Clock,
  UserCheck,
  Smartphone,
  Menu,
  LogOut,
  User
} from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { useLogout } from '@/hooks/useLogout';

export interface AssistantManagerHeaderProps {
  onOpenMobileSidebar?: () => void;
}

export function AssistantManagerHeader({
  onOpenMobileSidebar,
}: AssistantManagerHeaderProps) {
  const { user } = useAppSelector((state) => state.auth);
  const { handleLogout } = useLogout();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('10:20AM');
  const [branchSelectOpen, setBranchSelectOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(user?.assignments?.[0]?.branch?.name || 'Downtown Branch');

  const displayName = user?.name || user?.email?.split('@')[0] || 'Marcus';
  const displayRole = user?.assignments?.[0]?.role?.replace(/_/g, ' ') || 'Assistant Manager';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || 'AM';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setTimeStr(`${hours}:${minutes}${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full h-20 px-3 sm:px-6 lg:px-8 py-2.5 bg-black border-b border-white/15 shadow-[0px_0px_4px_0px_rgba(212,212,212,0.25)] flex justify-between items-center sticky top-0 z-40 flex-shrink-0">
      {/* Left items & Mobile Menu */}
      <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-1 min-w-0">
        {onOpenMobileSidebar && (
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 sm:p-2 text-zinc-300 hover:text-white bg-zinc-900 rounded-lg cursor-pointer shrink-0"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Branch Selector Pill */}
        <div className="relative min-w-0">
          <button
            type="button"
            onClick={() => setBranchSelectOpen(!branchSelectOpen)}
            className="h-9 px-2.5 sm:px-3 py-1.5 bg-zinc-900 rounded-lg outline outline-1 outline-offset-[-1px] outline-yellow-400/10 flex items-center flex-nowrap gap-1.5 sm:gap-2 hover:bg-zinc-800 transition-colors cursor-pointer max-w-[155px] xs:max-w-[210px] sm:max-w-none shrink-0 min-w-0"
          >
            <Store className="w-4 h-4 text-white flex-shrink-0" />
            <span className="text-white text-xs sm:text-sm font-medium font-['Inter'] leading-5 truncate whitespace-nowrap min-w-0">
              {selectedBranch}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-300 flex-shrink-0" />
          </button>

          {branchSelectOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-zinc-900 border border-white/15 rounded-xl shadow-2xl py-1.5 z-50">
              {['Downtown Branch', 'Midtown Bistro', 'Uptown Rooftop'].map((branch) => (
                <button
                  key={branch}
                  type="button"
                  onClick={() => {
                    setSelectedBranch(branch);
                    setBranchSelectOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-sm font-['Inter'] hover:bg-zinc-800 transition-colors ${
                    selectedBranch === branch ? 'text-amber-400 font-semibold' : 'text-zinc-300'
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Operational Indicators */}
        <div className="hidden md:flex items-center gap-4">
          {/* Clock */}
          <div className="flex items-center gap-1.5 text-white text-sm font-medium font-['Inter'] leading-5">
            <Clock className="w-4 h-4 text-white" />
            <span>{timeStr}</span>
          </div>

          {/* Restaurant Manager on duty */}
          <div className="h-9 px-3 py-1.5 bg-zinc-900 rounded-lg outline outline-1 outline-offset-[-1px] outline-yellow-400/10 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-white flex-shrink-0" />
            <span className="text-white text-sm font-medium font-['Inter'] leading-5 whitespace-nowrap">
              RM: Elena
            </span>
          </div>

          {/* Active Terminals */}
          <div className="h-9 px-3 py-1.5 bg-zinc-900 rounded-lg outline outline-1 outline-offset-[-1px] outline-yellow-400/10 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-white flex-shrink-0" />
            <span className="text-white text-sm font-medium font-['Inter'] leading-5 whitespace-nowrap">
              Terminals 5/6
            </span>
          </div>
        </div>
      </div>

      {/* Right User Profile */}
      <div className="relative flex items-center gap-3 flex-shrink-0 pl-2">
        <button
          type="button"
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-zinc-800/80 transition-colors cursor-pointer"
        >
          <div className="text-right hidden sm:block">
            <div className="text-white text-sm font-semibold font-['Poppins'] leading-tight">
              {displayName}
            </div>
            <div className="text-zinc-400 text-xs font-normal font-['Inter'] leading-4 capitalize">
              {displayRole}
            </div>
          </div>
          <div className="size-10 rounded-full bg-amber-500 border-2 border-amber-400/40 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
            {initials}
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        {profileDropdownOpen && (
          <div className="absolute right-0 top-12 w-52 bg-zinc-900 border border-white/10 rounded-xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in zoom-in-95 font-['Inter']">
            <div className="px-3 py-2 border-b border-white/5 mb-1">
              <p className="text-sm font-semibold text-white">{displayName}</p>
              <p className="text-xs text-zinc-400">{user?.email || selectedBranch}</p>
              <p className="text-xs text-amber-400 mt-0.5 capitalize">{displayRole}</p>
            </div>
            <div className="border-t border-white/5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default AssistantManagerHeader;
