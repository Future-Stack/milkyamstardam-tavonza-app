'use client';

import React from 'react';
import { FloorTable } from '../types';

export interface TableCardProps {
  table: FloorTable;
  onViewDetails: (table: FloorTable) => void;
  onMarkReady: (tableId: string) => void;
}

export function TableCard({
  table,
  onViewDetails,
  onMarkReady,
}: TableCardProps) {
  const isBussing = table.status === 'Bussing';
  const isAttention = table.status === 'Attention';
  const hasAlert = Boolean(table.alertMessage);

  return (
    <div className="w-full min-h-[215px] p-3 relative bg-stone-950 rounded-xl outline outline-1 outline-offset-[-1px] outline-neutral-700 flex flex-col justify-between hover:outline-neutral-500 transition-all shadow-md">
      {/* Top Section */}
      <div className="space-y-2">
        {/* Table Number, Zone, Capacity */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-white text-base font-bold font-['Inter'] leading-5">
              {table.tableNumber}
            </span>
            <div className="px-2 py-0.5 bg-zinc-800 rounded-[10px] flex items-center justify-center">
              <span className="text-yellow-400 text-xs font-normal font-['Inter']">
                {table.zone}
              </span>
            </div>
          </div>
          <span className="text-white text-sm font-normal font-['DM_Sans'] leading-4">
            {table.currentGuests}/{table.capacity}
          </span>
        </div>

        {/* Status Badge & Bill Amount */}
        <div className="flex items-center justify-between gap-2">
          <div>
            {table.status === 'Dining' && (
              <div className="px-2 py-0.5 bg-green-950 rounded-[10px] inline-flex items-center">
                <span className="text-white text-xs font-normal font-['Inter']">
                  Dining
                </span>
              </div>
            )}
            {table.status === 'Attention' && (
              <div className="px-2 py-0.5 bg-red-600/10 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-red-600/40 inline-flex items-center">
                <span className="text-red-500 text-xs font-normal font-['Inter']">
                  Attention
                </span>
              </div>
            )}
            {table.status === 'Bussing' && (
              <div className="px-2 py-0.5 bg-green-950 rounded-[10px] inline-flex items-center">
                <span className="text-white text-xs font-normal font-['Inter']">
                  Bussing
                </span>
              </div>
            )}
            {table.status === 'Ready' && (
              <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-[10px] inline-flex items-center">
                <span className="text-xs font-normal font-['Inter']">
                  Ready
                </span>
              </div>
            )}
            {table.status === 'Check Out' && (
              <div className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-[10px] inline-flex items-center">
                <span className="text-xs font-normal font-['Inter']">
                  Check Out
                </span>
              </div>
            )}
            {table.status === 'Seated' && (
              <div className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-[10px] inline-flex items-center">
                <span className="text-xs font-normal font-['Inter']">
                  Seated
                </span>
              </div>
            )}
          </div>

          {table.totalAmount && (
            <span className="text-white text-sm font-normal font-['DM_Sans'] leading-4">
              {table.totalAmount}
            </span>
          )}
        </div>

        {/* Attention Alert Banner if present */}
        {hasAlert && (
          <div className="h-5 px-2 bg-red-600/20 rounded-[5px] flex items-center overflow-hidden">
            <span className="text-red-500 text-xs font-normal font-['Inter'] leading-4 truncate">
              {table.alertMessage}
            </span>
          </div>
        )}
      </div>

      {/* Middle Course / Bussing Box */}
      <div className="my-2">
        {isBussing ? (
          <div className="p-2.5 bg-zinc-900 rounded-[10px] flex items-center justify-between gap-2">
            <span className="text-white text-sm font-normal font-['Inter'] leading-4 truncate">
              Awaiting table reset
            </span>
            <button
              type="button"
              onClick={() => onMarkReady(table.id)}
              className="px-2 py-1 bg-black rounded-[10px] text-yellow-400 text-xs font-normal font-['DM_Sans'] leading-4 hover:bg-zinc-800 transition-colors cursor-pointer border border-yellow-400/20 flex-shrink-0"
            >
              Mark Ready
            </button>
          </div>
        ) : (
          <div className="p-2.5 bg-zinc-900 rounded-[10px] flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-white text-sm font-medium font-['Inter'] leading-4 truncate">
                {table.course || 'Course : In Progress'}
              </span>
              <span className="text-yellow-400 text-xs font-normal font-['DM_Sans'] leading-4 flex-shrink-0">
                {table.itemsCount || 1} items
              </span>
            </div>
            <div className="w-full h-px bg-zinc-800" />
            <div className="flex items-center justify-between gap-2">
              <span className="text-zinc-400 text-xs font-normal font-['Inter'] leading-4">
                {table.elapsedMinutes || 8}m Elapsed
              </span>
              <span className="text-zinc-400 text-xs font-normal font-['Inter'] leading-4">
                Target: {table.targetMinutes || 60}m
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Row */}
      <div className="pt-2 border-t border-neutral-700/80 flex items-center justify-between">
        <div className="text-sm font-['Inter'] leading-4 truncate pr-2">
          <span className="text-white font-medium">Server: </span>
          <span className="text-neutral-400 font-medium">{table.serverName}</span>
        </div>
        <button
          type="button"
          onClick={() => onViewDetails(table)}
          className="text-yellow-400 text-xs font-normal font-['DM_Sans'] underline leading-4 hover:text-yellow-300 transition-colors cursor-pointer flex-shrink-0"
        >
          View
        </button>
      </div>
    </div>
  );
}

export default TableCard;
