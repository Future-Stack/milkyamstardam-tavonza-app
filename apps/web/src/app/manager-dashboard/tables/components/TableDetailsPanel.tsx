'use client';

import React from 'react';
import {
  UserPlus,
  Edit,
  X,
  Clock,
  User,
  Users,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { FloorTable } from '../../types';

interface TableDetailsPanelProps {
  table: FloorTable | null;
  onClose?: () => void;
  onAssignWaiter: (table: FloorTable) => void;
  onEditTable: (table: FloorTable) => void;
  onToggleStatus?: (table: FloorTable) => void;
}

export const TableDetailsPanel: React.FC<TableDetailsPanelProps> = ({
  table,
  onClose,
  onAssignWaiter,
  onEditTable,
  onToggleStatus,
}) => {
  if (!table) {
    return (
      <div className="w-full xl:w-80 bg-black rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center text-center h-80 shrink-0">
        <span className="text-4xl mb-2 select-none">🍽️</span>
        <p className="text-white text-base font-semibold">Select a table</p>
        <p className="text-zinc-500 text-sm mt-1">
          Click any table on the floor plan to view occupancy, waiter assignment, and notes.
        </p>
      </div>
    );
  }

  const formattedGuests =
    table.currentGuests < 10 ? `0${table.currentGuests}` : `${table.currentGuests}`;

  return (
    <div className="w-full xl:w-80 bg-black rounded-xl border border-white/10 p-5 flex flex-col justify-between overflow-hidden shrink-0 space-y-4">
      {/* Header matching Figma */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h3 className="text-white text-xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">
            {table.tableNumber} Details
          </h3>
          <p className="text-zinc-500 text-sm mt-0.5">
            {table.section} · {table.location}
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-yellow-500 transition-colors cursor-pointer"
            title="Close details"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Main Table Identifier Badge matching Figma */}
      <div className="px-6 py-3 bg-zinc-950 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-1 shadow-inner">
        <span className="text-white text-base font-bold font-['Inter']">
          {table.tableNumber}
        </span>
        <span className="text-neutral-300 text-sm font-normal font-['Plus_Jakarta_Sans'] capitalize tracking-wide">
          {table.status.toLowerCase()}
        </span>
      </div>

      {/* Glassmorphic Details List matching Figma */}
      <div className="bg-zinc-950 rounded-xl border border-white/10 divide-y divide-white/5 overflow-hidden">
        {/* Guests */}
        <div className="px-4 py-2.5 flex items-center justify-between text-base font-['Inter']">
          <span className="text-zinc-400 text-sm flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            Guests
          </span>
          <span className="text-white font-medium text-base">
            {table.status === 'Available' ? '00' : formattedGuests} / {table.capacity}
          </span>
        </div>

        {/* Waiter */}
        <div className="px-4 py-2.5 flex items-center justify-between text-base font-['Inter']">
          <span className="text-zinc-400 text-sm flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            Waiter
          </span>
          <span className="text-white font-medium text-base">
            {table.waiter}
          </span>
        </div>

        {/* Seated Time */}
        <div className="px-4 py-2.5 flex items-center justify-between text-base font-['Inter']">
          <span className="text-zinc-400 text-sm flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            Seated
          </span>
          <span className="text-white font-medium text-base">
            {table.seatedTime}
          </span>
        </div>

        {/* Location & Shape */}
        <div className="px-4 py-2.5 flex items-center justify-between text-base font-['Inter']">
          <span className="text-zinc-400 text-sm flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            Position
          </span>
          <span className="text-white font-medium text-sm">
            {table.shape} · {table.location}
          </span>
        </div>
      </div>

      {/* Notes / Special Instructions */}
      {table.notes && (
        <div className="p-2.5 bg-black/40 rounded-lg border border-white/5 text-xs text-zinc-400 font-['Inter'] leading-relaxed">
          <span className="text-zinc-500 font-semibold block uppercase text-[10px] mb-0.5">
            Table Notes:
          </span>
          {table.notes}
        </div>
      )}

      {/* Action Buttons matching Figma */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          type="button"
          onClick={() => onAssignWaiter(table)}
          className="w-full h-9 px-3 bg-gradient-to-br from-amber-500 to-amber-600 hover:brightness-110 rounded-lg flex items-center justify-center gap-2 text-white font-semibold text-sm font-['Plus_Jakarta_Sans'] transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-[0.99]"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Assign Waiter</span>
        </button>

        <button
          type="button"
          onClick={() => onEditTable(table)}
          className="w-full h-9 px-3 bg-zinc-900 hover:bg-zinc-800 outline outline-1 outline-offset-[-1px] outline-white/10 rounded-lg flex items-center justify-center gap-2 text-slate-200 text-sm font-medium font-['Plus_Jakarta_Sans'] transition-colors cursor-pointer"
        >
          <Edit className="w-3.5 h-3.5 text-slate-400" />
          <span>Edit Table</span>
        </button>

        {onToggleStatus && (
          <button
            type="button"
            onClick={() => onToggleStatus(table)}
            className="w-full h-8 px-3 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center gap-1.5 text-zinc-400 hover:text-white text-xs font-normal transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>
              {table.status === 'Occupied'
                ? 'Mark as Available'
                : table.status === 'Available'
                ? 'Seat Walk-in Guests'
                : 'Confirm Guest Arrival'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
