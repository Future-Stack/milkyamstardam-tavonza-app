'use client';

import React from 'react';
import { Send } from 'lucide-react';
import { ShiftNoteData } from '../types';

export interface ShiftNoteBannerProps {
  shiftNote: ShiftNoteData;
  onPostNote: () => void;
}

export function ShiftNoteBanner({
  shiftNote,
  onPostNote,
}: ShiftNoteBannerProps) {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-2 pt-2">
      <div className="text-white text-xl font-medium font-['Inter'] leading-8">
        Shift Note
      </div>
      <div className="w-full p-3.5 bg-slate-900 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-neutral-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 pr-0 md:pr-4">
          <p className="text-gray-400 text-sm sm:text-base font-normal font-['Inter'] leading-relaxed">
            &ldquo;{shiftNote.content}&rdquo;
          </p>
        </div>

        <button
          type="button"
          onClick={onPostNote}
          className="w-full sm:w-auto px-4 py-2.5 bg-amber-400 hover:bg-amber-300 rounded-lg flex justify-center items-center gap-2 cursor-pointer transition-colors flex-shrink-0"
        >
          <Send className="w-4 h-4 text-white" />
          <span className="text-white text-sm sm:text-base font-normal font-['Inter'] leading-6 whitespace-nowrap">
            Post Note to Floor
          </span>
        </button>
      </div>
    </div>
  );
}

export default ShiftNoteBanner;
