'use client';

import React, { useState } from 'react';
import { X, Plus, ChevronDown } from 'lucide-react';
import { AddTableFormData } from '../../types';

interface AddNewTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTable: (data: AddTableFormData) => void;
}

export const AddNewTableModal: React.FC<AddNewTableModalProps> = ({
  isOpen,
  onClose,
  onAddTable,
}) => {
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState<number>(4);
  const [shape, setShape] = useState('Square');
  const [section, setSection] = useState('Floor 1');
  const [location, setLocation] = useState('Indoor');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber.trim()) return;

    onAddTable({
      tableNumber: tableNumber.trim().toUpperCase(),
      capacity,
      shape,
      section,
      location,
      notes: notes.trim(),
    });

    // Reset fields
    setTableNumber('');
    setCapacity(4);
    setShape('Square');
    setSection('Floor 1');
    setLocation('Indoor');
    setNotes('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 lg:left-72 top-20 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-sm sm:max-w-md bg-black border border-white/15 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Screenshot 2 */}
        <div className="flex items-start justify-between border-b border-white/5 pb-3">
          <div>
            <h3 className="text-slate-200 text-base font-bold font-['Plus_Jakarta_Sans'] leading-5">
              Add New Table
            </h3>
            <p className="text-slate-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4 mt-0.5">
              Configure a new table for the restaurant floor
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-amber-500 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Form Fields matching Screenshot 2 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Table ID / Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
              Table ID / Name
            </label>
            <input
              type="text"
              required
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g. T-25"
              className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/20 text-white placeholder-zinc-500 text-sm font-normal uppercase tracking-wide focus:outline-yellow-500 transition-all"
            />
          </div>

          {/* Row 2: Seating Capacity & Table Shape */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
                Seating Capacity
              </label>
              <div className="relative">
                <select
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/20 text-white text-sm font-normal appearance-none focus:outline-yellow-500 cursor-pointer"
                >
                  <option value={2}>2 Persons</option>
                  <option value={4}>4 Persons</option>
                  <option value={6}>6 Persons</option>
                  <option value={8}>8 Persons</option>
                  <option value={10}>10 Persons</option>
                  <option value={12}>12 Persons</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-white/70 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
                Table Shape
              </label>
              <div className="relative">
                <select
                  value={shape}
                  onChange={(e) => setShape(e.target.value)}
                  className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/20 text-white text-sm font-normal appearance-none focus:outline-yellow-500 cursor-pointer"
                >
                  <option value="Square">Square</option>
                  <option value="Round">Round</option>
                  <option value="Rectangle">Rectangle</option>
                  <option value="Booth">Booth</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-white/70 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 3: Section / Floor & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
                Section / Floor
              </label>
              <div className="relative">
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/20 text-white text-sm font-normal appearance-none focus:outline-yellow-500 cursor-pointer"
                >
                  <option value="Floor 1">Floor 1</option>
                  <option value="Floor 2">Floor 2</option>
                  <option value="Mezzanine">Mezzanine</option>
                  <option value="Rooftop">Rooftop</option>
                  <option value="VIP Area">VIP Area</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-white/70 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
                Location
              </label>
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/20 text-white text-sm font-normal appearance-none focus:outline-yellow-500 cursor-pointer"
                >
                  <option value="Indoor">Indoor</option>
                  <option value="Window">Window</option>
                  <option value="Terrace">Terrace</option>
                  <option value="Bar Area">Bar Area</option>
                  <option value="Outdoor">Outdoor</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-white/70 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 4: Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
              Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Wheelchair Accessible, Near Entrance..."
              className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/20 text-white placeholder-zinc-500 text-sm font-normal focus:outline-yellow-500 transition-all"
            />
          </div>

          {/* Action Buttons matching Screenshot 2 */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              type="submit"
              className="h-9 px-4 bg-yellow-500 hover:bg-yellow-400 text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] rounded-[5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-yellow-500/20 active:scale-[0.99]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Table</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 bg-neutral-800 hover:bg-neutral-700 outline outline-1 outline-offset-[-1px] outline-white/5 text-slate-200 text-sm font-medium font-['Plus_Jakarta_Sans'] rounded-[5px] flex items-center justify-center transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
