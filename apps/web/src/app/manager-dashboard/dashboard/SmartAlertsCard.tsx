'use client';

import React, { useState } from 'react';
import { ChevronRight, AlertCircle, Check, BellRing } from 'lucide-react';
import { SmartAlert } from '../types';

interface SmartAlertsCardProps {
  alerts: SmartAlert[];
  onViewAll?: () => void;
  onSelectAlert?: (alert: SmartAlert) => void;
}

export const SmartAlertsCard: React.FC<SmartAlertsCardProps> = ({
  alerts,
  onViewAll,
  onSelectAlert,
}) => {
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const getSeverityDot = (severity: SmartAlert['severity']) => {
    switch (severity) {
      case 'danger':
        return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]';
      case 'warning':
        return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.7)]';
      case 'caution':
        return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.7)]';
      case 'success':
        return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]';
      default:
        return 'bg-blue-500';
    }
  };

  const handleResolve = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setResolvedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const unreadCount = alerts.filter((a) => !resolvedIds.has(a.id)).length;

  return (
    <div className="w-full bg-black rounded-[10px] border border-white/10 shadow-lg p-5 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-red-500 text-lg font-semibold font-['Inter'] flex items-center gap-2">
              <BellRing className="w-4 h-4" />
              Smart Alerts
            </h2>
            {unreadCount > 0 && (
              <span className="text-sm px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono font-semibold border border-red-500/30">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="text-slate-400 hover:text-white text-sm font-['Inter'] flex items-center gap-1 transition-colors"
          >
            View all
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="mt-1 text-zinc-400 text-sm font-normal font-['Inter'] leading-relaxed">
          Stay informed with real-time business alerts and AI-powered notifications.
        </p>
      </div>

      {/* Alerts list */}
      <div className="mt-4 space-y-2.5">
        {alerts.map((alert) => {
          const isResolved = resolvedIds.has(alert.id);
          return (
            <div
              key={alert.id}
              onClick={() => onSelectAlert && onSelectAlert(alert)}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isResolved
                  ? 'bg-black/50 border-white/5 opacity-50'
                  : 'bg-zinc-950 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Left indicator & text */}
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-125 ${getSeverityDot(
                    alert.severity
                  )}`}
                />
                <span className="text-white text-sm font-normal font-['Inter'] truncate">
                  {alert.message}
                </span>
              </div>

              {/* Right meta & action */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-neutral-400 text-xs font-normal font-['Inter']">
                  {alert.timeAgo}
                </span>
                <button
                  type="button"
                  title={isResolved ? 'Mark active' : 'Acknowledge alert'}
                  onClick={(e) => handleResolve(e, alert.id)}
                  className={`p-1 rounded transition-colors ${
                    isResolved
                      ? 'text-emerald-400 hover:text-emerald-300'
                      : 'text-neutral-500 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 text-amber-500" />
          AI continuous monitoring active
        </span>
        <span className="text-neutral-400 font-mono">Downtown Branch</span>
      </div>
    </div>
  );
};
