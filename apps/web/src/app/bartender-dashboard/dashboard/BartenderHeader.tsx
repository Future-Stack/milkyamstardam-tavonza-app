'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  Sparkles,
  User,
  LogOut,
  Settings,
  Wine
} from 'lucide-react';
import { toast } from 'sonner';
import { useLogout } from '@/hooks/useLogout';
import { useAppSelector } from '@/redux/hooks';

interface BartenderHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onOpenAIModal: () => void;
}

export default function BartenderHeader({
  searchQuery,
  setSearchQuery,
  sidebarOpen,
  setSidebarOpen,
  onOpenAIModal,
}: BartenderHeaderProps) {
  const { user } = useAppSelector((state) => state.auth);
  const { handleLogout } = useLogout();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const displayName = user?.name || user?.email?.split('@')[0] || 'Bartender';
  const displayRole = user?.assignments?.[0]?.role?.replace(/_/g, ' ') || 'Head Mixologist';
  const branchName = user?.assignments?.[0]?.branch?.name || 'Downtown Branch';

  return (
    <header className="h-20 bg-black border-b border-white/10 px-3 sm:px-8 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30 flex-shrink-0 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.15)]">
      {/* Left: Mobile Toggle & Branch Selector */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-1.5 sm:p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white cursor-pointer shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Branch Selector Pill */}
        <div className="h-9 px-2.5 sm:px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-lg inline-flex items-center flex-nowrap gap-1.5 sm:gap-2 max-w-[155px] xs:max-w-[210px] sm:max-w-none shrink-0 min-w-0">
          <span className="size-2 rounded-full bg-green-500 animate-pulse shrink-0" />
          <span className="text-slate-400 text-sm font-medium font-['Inter'] hidden md:inline shrink-0">
            Tavonza Group /
          </span>
          <span className="text-white text-xs sm:text-sm md:text-base font-medium font-['Inter'] truncate whitespace-nowrap min-w-0">
            Downtown Branch
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-0.5 shrink-0" />
        </div>
      </div>

      {/* Middle: Universal Search Bar */}
      <div className="flex-1 max-w-md mx-2 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders, customers, or ask AI..."
            className="w-full h-9 pl-9 pr-4 bg-zinc-900 rounded-lg border border-white/10 text-base text-white placeholder:text-neutral-500 outline-none focus:border-amber-500/50 transition-colors font-['Inter']"
          />
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="size-9 sm:size-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center relative text-zinc-300 hover:text-white hover:border-amber-500/30 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="size-4 bg-red-500 rounded-full text-white text-xs font-bold absolute -top-1 -right-1 flex items-center justify-center shadow-md">
              2
            </span>
          </button>

          {/* Notification Popover */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-white/10 rounded-xl p-3 shadow-2xl z-50 space-y-2 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-sm font-semibold text-white font-['Inter']">Bar Alerts</span>
                <span className="text-xs text-amber-400 font-medium">2 Urgent</span>
              </div>
              <div className="space-y-1.5 text-sm text-zinc-300">
                <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                  VIP Drink order #20581 timer expiring in 2m.
                </div>
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  Fresh mint stock is below 15% par level.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="h-10 sm:h-11 pl-2 pr-2 sm:pr-3 bg-zinc-900 border border-white/10 rounded-xl flex items-center gap-2 sm:gap-3 hover:border-amber-500/30 transition-colors cursor-pointer"
          >
            <div className="size-7 sm:size-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-inner shrink-0">
              <Wine className="w-4 h-4 text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-white text-sm font-medium font-['Inter'] leading-tight">
                {displayName}
              </div>
              <div className="text-slate-400 text-xs font-medium font-['Inter'] leading-tight">
                {user?.email || 'bartender@tavonza.demo'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 sm:ml-1 shrink-0" />
          </button>

          {/* Profile Menu Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <p className="text-sm font-semibold text-white">{displayName}</p>
                <p className="text-xs text-zinc-400 capitalize">{displayRole}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  toast.info('Navigating to bartender profile');
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                Profile Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  onOpenAIModal();
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-amber-400 hover:bg-amber-500/10 rounded-lg cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Ask Tavonza AI
              </button>
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
      </div>
    </header>
  );
}
