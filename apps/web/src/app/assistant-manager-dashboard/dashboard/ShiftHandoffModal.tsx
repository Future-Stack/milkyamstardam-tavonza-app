'use client';

import React, { useState } from 'react';
import { X, ClipboardCheck, DollarSign, Clock, CheckCircle2, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export interface ShiftHandoffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShiftHandoffModal({
  isOpen,
  onClose,
}: ShiftHandoffModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);

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

  const handleSignOff = () => {
    setAcknowledged(true);
    toast.success('Shift handoff acknowledged and signed by Marcus (AM).');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div
      className="assistant-manager-modal-backdrop fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
              <ClipboardCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-white text-lg font-bold font-['Inter']">
                Shift Handoff Log &amp; Briefing
              </h2>
              <p className="text-zinc-400 text-xs font-['Inter']">
                Morning Opening Shift → Mid-Day AM Operational Handover
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

        {/* Shift Overview Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
              <Clock className="size-3.5 text-amber-400" />
              <span>Shift Window</span>
            </div>
            <div className="text-white text-sm font-semibold">07:00 - 11:30 AM</div>
          </div>

          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
              <DollarSign className="size-3.5 text-emerald-400" />
              <span>Drawer Count</span>
            </div>
            <div className="text-white text-sm font-semibold">$1,250.00 Exact</div>
          </div>

          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
              <UserCheck className="size-3.5 text-blue-400" />
              <span>Handed Over By</span>
            </div>
            <div className="text-white text-sm font-semibold">Elena Vance (RM)</div>
          </div>
        </div>

        {/* Manager Log Notes */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Operational Log Notes
          </div>
          <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2 text-sm text-zinc-300">
            <p>
              • <strong>Kitchen prep:</strong> Sea Bass delivery arrived on schedule. Halibut ran out early during breakfast catering (item 86&apos;d).
            </p>
            <p>
              • <strong>Reservations:</strong> Apex Capital corporate party of 10 seated at Table 04 &amp; Private Room 1 at 10:15 AM. Special attention needed.
            </p>
            <p>
              • <strong>Floor maintenance:</strong> POS terminal 4 rebooted and operating normally. All 8 floor staff checked in on time.
            </p>
          </div>
        </div>

        {/* Sign off status */}
        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            {acknowledged ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="size-4" /> Signed by Marcus (AM)
              </span>
            ) : (
              <span>Pending Assistant Manager acknowledgment</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-xl cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSignOff}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-medium text-sm rounded-xl transition-colors cursor-pointer"
            >
              Sign &amp; Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShiftHandoffModal;
