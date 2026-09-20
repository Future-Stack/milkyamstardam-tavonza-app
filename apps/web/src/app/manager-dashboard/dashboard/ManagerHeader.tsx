'use client';

import React from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
  Sparkles,
} from 'lucide-react';
import { ManagerProfile } from '../types';

interface ManagerHeaderProps {
  profile: ManagerProfile;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onSearch?: (query: string) => void;
  onOpenSidebar?: () => void;
  onOpenAIModal?: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  notificationCount?: number;
}

export const ManagerHeader: React.FC<ManagerHeaderProps> = ({
  profile,
  searchQuery = '',
  setSearchQuery,
  onSearch,
  onOpenSidebar,
  onOpenAIModal,
  onOpenNotifications,
  onOpenProfile,
  notificationCount = 2,
}) => {
  const [internalQuery, setInternalQuery] = React.useState(searchQuery);
  const currentQuery = setSearchQuery ? searchQuery : internalQuery;

  const handleQueryChange = (val: string) => {
    if (setSearchQuery) {
      setSearchQuery(val);
    } else {
      setInternalQuery(val);
    }
    if (onSearch) {
      onSearch(val);
    }
  };
  return (
    <header className="h-20 bg-black/95 border-b border-white/10 px-3 sm:px-8 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30 backdrop-blur-md shrink-0 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.25)] font-['Inter']">
      {/* Left: Mobile menu toggle + Branch Selector */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Branch Pill */}
        <div className="h-9 px-2.5 sm:px-3 py-1.5 bg-zinc-900 rounded-lg border border-white/10 flex items-center flex-nowrap gap-1.5 sm:gap-2 shadow-sm max-w-[155px] xs:max-w-[210px] sm:max-w-none shrink-0 min-w-0">
          <span className="w-2 h-2 rounded-full bg-green-500 opacity-80 animate-pulse shrink-0" />
          <span className="text-slate-400 text-sm font-medium font-['Inter'] hidden md:inline shrink-0">
            {profile.company} /
          </span>
          <span className="text-white text-xs sm:text-sm md:text-base font-medium font-['Inter'] truncate whitespace-nowrap min-w-0">
            {profile.branch}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={currentQuery}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search orders, customers, or ask AI..."
            className="w-full h-9 pl-9 pr-4 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white placeholder:text-neutral-500 focus:outline-amber-500/50 transition-colors font-['Inter']"
          />
        </div>
      </div>

      {/* Right: Notification + Profile block */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* AI Quick Button */}
        {/* <button
          type="button"
          onClick={onOpenAIModal}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 border border-amber-400/30 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Ask AI</span>
        </button> */}

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={onOpenNotifications}
            className="w-9 h-9 bg-zinc-900 rounded-lg border border-white/10 flex items-center justify-center text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center font-['Inter']">
            {notificationCount}
          </span>
        </div>

        {/* Manager Profile Box */}
        <div
          onClick={onOpenProfile}
          className="h-10 sm:h-12 bg-zinc-900 rounded-lg border border-white/10 px-2 sm:px-2.5 py-1.5 flex items-center gap-2 sm:gap-2.5 cursor-pointer hover:bg-zinc-850 transition-colors"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
            <User className="w-4 h-4 text-white" />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-slate-200 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-4">
              {profile.name}
            </span>
            <span className="text-slate-400 text-xs font-medium font-['Inter'] leading-3">
              {profile.email}
            </span>
          </div>

          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
};

export const ManagerGreeting: React.FC<{ profile: ManagerProfile }> = ({ profile }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 font-['Inter']">
      <div>
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold font-['Inter'] leading-tight">
          Good Morning, {profile.name.split(' ')[0]}
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm md:text-base font-normal font-['Inter'] mt-1">
          Wednesday, July 16 · {profile.branch} · Lunch Service
        </p>
      </div>

      {/* Live Status Pill */}
      <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-900 rounded-[10px] border border-white/10 shadow-sm flex items-center gap-2 self-start sm:self-auto">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-white text-xs sm:text-sm font-semibold font-['Inter']">
          Live · Updated just now
        </span>
      </div>
    </div>
  );
};
