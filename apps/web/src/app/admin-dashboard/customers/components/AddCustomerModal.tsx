'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Customer, CustomerSegment } from '../types';

export interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newCustomer: Omit<Customer, 'id'>) => void;
}

export default function AddCustomerModal({
  isOpen,
  onClose,
  onAdd,
}: AddCustomerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [segment, setSegment] = useState<CustomerSegment>('New');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@email.com`,
      phone: phone.trim() || '+1 (555) 000-0000',
      segment,
      visits: 1,
      totalSpent: 0,
      rating: 5.0,
      lastVisit: 'Today',
      memberSince: 'Aug 2026',
      notes: notes.trim() || 'New customer registration.',
    });

    // Reset
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    onClose();
  };

  const segments: CustomerSegment[] = ['New', 'Regular', 'VIP'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-[440px] bg-[#141416] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col font-['Inter'] animate-in zoom-in-95 duration-150 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header matching Screenshot 1 */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-white text-lg font-bold font-['Plus_Jakarta_Sans']">
            Add New Customer
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="size-7 rounded-lg bg-zinc-800/80 border border-zinc-700/80 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form Body matching Screenshot 1 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {/* Full Name * */}
          <div className="space-y-1.5">
            <label className="text-white text-sm font-medium">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alice Walker"
              className="w-full h-10 px-3.5 bg-zinc-800/90 rounded-xl border border-zinc-700/70 text-stone-200 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder-zinc-500"
              required
            />
          </div>

          {/* Email & Phone Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-white text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@email.com"
                className="w-full h-10 px-3.5 bg-zinc-800/90 rounded-xl border border-zinc-700/70 text-stone-200 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder-zinc-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white text-sm font-medium">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0000"
                className="w-full h-10 px-3.5 bg-zinc-800/90 rounded-xl border border-zinc-700/70 text-stone-200 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder-zinc-500"
              />
            </div>
          </div>

          {/* Customer Segment */}
          <div className="space-y-1.5">
            <label className="text-white text-sm font-medium">Customer Segment</label>
            <div className="grid grid-cols-3 gap-2">
              {segments.map((seg) => {
                const isSelected = segment === seg;

                return (
                  <button
                    key={seg}
                    type="button"
                    onClick={() => setSegment(seg)}
                    className={`h-9 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'bg-amber-950/50 text-amber-400 border border-amber-500 shadow-sm'
                        : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 hover:text-white hover:bg-zinc-700'
                    }`}
                  >
                    {seg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-white text-sm font-medium">Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any dietary restrictions or preferences..."
              className="w-full p-3 bg-zinc-800/80 rounded-xl border border-zinc-700/70 text-stone-200 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none placeholder-zinc-500"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-zinc-700/80 bg-zinc-900/60 text-slate-400 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-10 bg-[#f59e0b] hover:bg-amber-400 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center"
            >
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
