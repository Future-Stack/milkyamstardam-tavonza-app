'use client';

import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Sparkles,
  Printer,
  ChevronRight,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { CashierNotification } from '../types';
import { initialCashierNotifications } from '../data';

interface CashierAlertsViewProps {
  onShowToast?: (msg: string) => void;
  onNavigateToQueue?: () => void;
  onOpenAIModal?: () => void;
}

export default function CashierAlertsView({
  onShowToast,
  onNavigateToQueue,
  onOpenAIModal,
}: CashierAlertsViewProps) {
  const [notifications, setNotifications] = useState<CashierNotification[]>(
    initialCashierNotifications
  );

  const handleDismiss = (id: string, title: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    onShowToast?.(`Notification dismissed: "${title}".`);
  };

  const handleAction = (notif: CashierNotification) => {
    if (notif.type === 'payment') {
      onNavigateToQueue?.();
    } else if (notif.type === 'hardware') {
      onShowToast?.('Thermal paper replacement guide sent to station screen.');
    } else {
      onShowToast?.('System status: 100% Operational.');
    }
  };

  return (
    <div className="space-y-6 relative animate-in fade-in duration-300">
      {/* Top Header Bar (From Figma) */}
      <div className="w-full bg-black shadow-[0px_0px_4px_0px_rgba(212,212,212,0.25)] border border-zinc-800/80 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-semibold font-['Inter'] leading-8">
            Notifications
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base font-normal font-['Poppins'] leading-5 mt-0.5">
            Stay up to date with important updates and alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-md text-xs font-medium">
            {notifications.length} Active Alerts
          </span>
        </div>
      </div>

      {/* Notifications List (From Figma: bg-white/10 rounded-[10px] outline-white/10 backdrop-blur-[9.60px]) */}
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => handleAction(notif)}
            className="w-full px-5 sm:px-7 py-4 bg-white/10 rounded-[10px] border border-white/10 backdrop-blur-[9.60px] flex items-center justify-between gap-4 transition-all hover:bg-white/15 cursor-pointer group"
          >
            {/* Left: Icon + Notification Content */}
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Icon (From Figma: size-8 bg-gray-200/5 rounded-[40px] outline-red-600/20) */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                  notif.type === 'payment'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                    : notif.type === 'hardware'
                    ? 'bg-red-500/10 border-red-500/40 text-red-400'
                    : 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                }`}
              >
                {notif.type === 'payment' && <Receipt className="w-4 h-4" />}
                {notif.type === 'hardware' && <Printer className="w-4 h-4" />}
                {notif.type === 'system' && <CheckCircle2 className="w-4 h-4" />}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="text-white text-sm sm:text-base font-bold font-['Inter'] leading-6 group-hover:text-amber-300 transition-colors">
                  {notif.title}
                </div>
                <div className="text-stone-300 text-xs sm:text-sm font-normal font-['DM_Sans'] leading-4">
                  {notif.timeAgo}
                </div>
              </div>
            </div>

            {/* Right: Green Status Dot (From Figma: size-5 bg-green-500 rounded-[45px]) */}
            <div className="flex items-center gap-3 shrink-0">
              {notif.isActive ? (
                <div
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 shadow-[0px_0px_8px_rgba(16,185,129,0.7)] shrink-0 animate-pulse"
                  title="Active"
                />
              ) : (
                <div className="w-3 h-3 rounded-full bg-zinc-600 shrink-0" />
              )}
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-12 text-zinc-500 text-xs bg-zinc-950 rounded-xl border border-zinc-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-500/60 mx-auto mb-2" />
            No new notifications. Register is clear and operating smoothly.
          </div>
        )}
      </div>

      {/* Floating Ask AI Button (From Figma: w-28 h-11 bg-amber-500/80 rounded-full shadow-[0px_8px_24px_rgba(0,0,0,0.25)]) */}
      <button
        onClick={onOpenAIModal}
        className="fixed bottom-8 right-8 z-40 px-5 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 rounded-full shadow-[0px_8px_24px_0px_rgba(0,0,0,0.35)] flex items-center gap-2 cursor-pointer transition-all border border-amber-400/40 group"
      >
        <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
        <span className="text-neutral-950 text-sm font-semibold font-['DM_Sans']">
          Ask AI
        </span>
      </button>
    </div>
  );
}
