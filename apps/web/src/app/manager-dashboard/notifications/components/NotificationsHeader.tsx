'use client';

import React from 'react';
import { Check, Settings, SlidersHorizontal } from 'lucide-react';

interface NotificationsHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
  onOpenSettings: () => void;
}

export const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({
  unreadCount,
  onMarkAllRead,
  onOpenSettings,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
      {/* Title & Subtitle */}
      <div className="flex flex-col gap-1">
        <h1 className="text-white text-3xl sm:text-4xl font-semibold font-['Inter'] leading-9 tracking-tight">
          Notifications
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg font-normal font-['Inter'] leading-6">
          System alerts and operational updates
        </p>
      </div>

      {/* Action Buttons matching Figma layout */}
      <div className="flex items-center gap-2.5">
        {/* Mark all read button */}
        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[10.20px] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Check className="w-3.5 h-3.5 text-zinc-400" />
          <div className="text-center font-['Inter']">
            <span className="text-white text-sm font-semibold leading-5">Mark all read</span>
            <span className="text-white text-sm font-normal leading-5 ml-1">({unreadCount})</span>
          </div>
        </button>

        {/* Setting button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[10.20px] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 text-slate-200/80" />
          <span className="text-white text-sm font-semibold font-['Inter'] leading-5">Setting</span>
        </button>
      </div>
    </div>
  );
};
