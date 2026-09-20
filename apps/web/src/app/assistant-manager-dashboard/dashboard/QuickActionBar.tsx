'use client';

import React from 'react';
import { PackageX, ClipboardCheck, MessageSquarePlus, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export interface QuickActionBarProps {
  onManageStock: () => void;
  onReviewHandoff: () => void;
  onSendShiftNote: () => void;
}

export function QuickActionBar({
  onManageStock,
  onReviewHandoff,
  onSendShiftNote,
}: QuickActionBarProps) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {/* 1. 86'd Stock */}
      <div className="px-3 py-3.5 bg-yellow-400/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-yellow-400 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <PackageX className="size-4 text-amber-500" />
          </div>
          <div className="min-w-0">
            <div className="text-white text-base font-medium font-['Inter'] leading-5 truncate">
              86&apos;d Stock
            </div>
            <div className="text-neutral-500 text-xs font-normal font-['Inter'] leading-4 truncate">
              Live items &amp; pos sync
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onManageStock}
          className="px-2.5 py-1.5 bg-green-500/5 hover:bg-green-500/15 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-700 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ml-2"
        >
          <span className="text-emerald-500 text-xs font-normal font-['Inter'] leading-tight">
            Manage
          </span>
        </button>
      </div>

      {/* 2. Shift Handoff */}
      <div className="px-3 py-3.5 bg-black rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-600 flex items-center justify-between hover:border-zinc-500 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <ClipboardCheck className="size-4 text-amber-500" />
          </div>
          <div className="min-w-0">
            <div className="text-white text-base font-medium font-['Inter'] leading-5 truncate">
              Shift Handoff
            </div>
            <div className="text-neutral-500 text-xs font-normal font-['Inter'] leading-4 truncate">
              Manager log &amp; report
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onReviewHandoff}
          className="px-2.5 py-1.5 bg-green-500/5 hover:bg-green-500/15 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-700 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ml-2"
        >
          <span className="text-emerald-500 text-xs font-normal font-['Inter'] leading-tight">
            Review
          </span>
        </button>
      </div>

      {/* 3. Shift Note */}
      <div className="px-3 py-3.5 bg-black rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-600 flex items-center justify-between hover:border-zinc-500 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageSquarePlus className="size-4 text-amber-500" />
          </div>
          <div className="min-w-0">
            <div className="text-white text-base font-medium font-['Inter'] leading-5 truncate">
              Shift Note
            </div>
            <div className="text-neutral-500 text-xs font-normal font-['Inter'] leading-4 truncate">
              Floor broadcast
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onSendShiftNote}
          className="px-2.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-blue-500/20 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ml-2"
        >
          <span className="text-blue-400 text-xs font-normal font-['Inter'] leading-tight">
            Send
          </span>
        </button>
      </div>

      {/* 4. Elena Vance (RM) */}
      <div className="px-3 py-3.5 bg-black rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-600 flex items-center justify-between hover:border-zinc-500 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <UserCheck className="size-4 text-amber-500" />
          </div>
          <div className="min-w-0">
            <div className="text-white text-base font-medium font-['Inter'] leading-5 truncate">
              Elena Vance
            </div>
            <div className="text-neutral-500 text-xs font-normal font-['Inter'] leading-4 truncate">
              Restaurant Manager
            </div>
          </div>
        </div>
        <div
          onClick={() => toast.info('Elena Vance is currently on the floor in Zone 1 (Main Dining).')}
          className="px-2.5 py-1.5 bg-gray-400/20 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-700 flex items-center justify-center cursor-pointer flex-shrink-0 ml-2"
        >
          <span className="text-zinc-300 text-xs font-normal font-['Inter'] leading-tight">
            on-site
          </span>
        </div>
      </div>
    </div>
  );
}

export default QuickActionBar;
