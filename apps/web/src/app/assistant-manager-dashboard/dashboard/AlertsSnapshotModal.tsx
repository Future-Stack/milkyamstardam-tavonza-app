'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import { mockFrontlineAlerts } from '../data';
import { FrontlineAlert } from '../types';
import { toast } from 'sonner';

export interface AlertsSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlertsSnapshotModal({
  isOpen,
  onClose,
}: AlertsSnapshotModalProps) {
  const [alerts, setAlerts] = useState<FrontlineAlert[]>(mockFrontlineAlerts);

  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleResolve = (id: string, title: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    toast.success(`Resolved alert: "${title}".`);
  };

  return (
    <div
      className="assistant-manager-modal-backdrop fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <h2 className="text-white text-lg font-bold font-['Inter']">
                Frontline Alerts Snapshot ({alerts.length})
              </h2>
              <p className="text-zinc-400 text-xs font-['Inter']">
                Active alerts requiring Assistant Manager intervention or server check-in.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-semibold font-['Inter']">
                      {alert.tableNumber}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded">
                      {alert.zone}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        alert.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : alert.severity === 'warning'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <div className="text-zinc-300 text-xs font-medium">
                    {alert.title} — {alert.description}
                  </div>
                  <div className="text-zinc-500 text-[11px] flex items-center gap-3">
                    <span>Server: {alert.server}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-zinc-400" /> {alert.elapsedMinutes}m elapsed ({alert.timestamp})
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleResolve(alert.id, alert.title)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-emerald-600/30 hover:text-emerald-400 text-zinc-300 text-xs font-medium rounded-lg border border-zinc-700 transition-colors cursor-pointer flex-shrink-0 self-end sm:self-center flex items-center gap-1.5"
                >
                  <CheckCircle className="size-3.5" />
                  <span>Resolve</span>
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-zinc-900/40 rounded-xl text-zinc-500 text-sm">
              All frontline alerts have been resolved. Floor is running smoothly!
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setAlerts([]);
              toast.success('All active alerts marked resolved.');
            }}
            className="text-xs text-zinc-400 hover:text-white cursor-pointer"
          >
            Clear All Alerts
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertsSnapshotModal;
