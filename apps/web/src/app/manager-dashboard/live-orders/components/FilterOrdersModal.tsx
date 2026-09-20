'use client';

import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { FilterOrdersState } from '../../types';
import { waiterList } from '../../data';

interface FilterOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOrdersState) => void;
  onClear: () => void;
  initialFilters?: FilterOrdersState;
}

export const FilterOrdersModal: React.FC<FilterOrdersModalProps> = ({
  isOpen,
  onClose,
  onApply,
  onClear,
  initialFilters,
}) => {
  const [status, setStatus] = useState(initialFilters?.status || 'ALL');
  const [waiter, setWaiter] = useState(initialFilters?.waiter || 'ALL');
  const [tableNumber, setTableNumber] = useState(initialFilters?.tableNumber || '');
  const [dateRange, setDateRange] = useState(initialFilters?.dateRange || 'TODAY');

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      status,
      waiter,
      tableNumber,
      dateRange,
    });
    onClose();
  };

  const handleClear = () => {
    setStatus('ALL');
    setWaiter('ALL');
    setTableNumber('');
    setDateRange('TODAY');
    onClear();
    onClose();
  };

  return (
    <div className="fixed inset-0 lg:left-72 top-20 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-[380px] bg-black border border-white/15 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-white text-lg font-bold font-['Inter']">
              Filter Orders
            </h3>
            <p className="text-neutral-400 text-sm font-normal font-['Inter'] mt-1">
              Narrow down orders by status, staff, or time
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 pt-1">
          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block font-['Inter']">
              Status
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-10 px-3.5 bg-neutral-800/80 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500 appearance-none font-['Inter'] cursor-pointer"
              >
                <option value="ALL">ALL</option>
                <option value="Waiting">Waiting</option>
                <option value="Cooking">Cooking</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready">Ready</option>
                <option value="Served">Served</option>
                <option value="Paid">Paid</option>
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Waiter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block font-['Inter']">
              Waiter
            </label>
            <div className="relative">
              <select
                value={waiter}
                onChange={(e) => setWaiter(e.target.value)}
                className="w-full h-10 px-3.5 bg-neutral-800/80 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500 appearance-none font-['Inter'] cursor-pointer"
              >
                <option value="ALL">ALL</option>
                {waiterList.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Table Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block font-['Inter']">
              Table Number
            </label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g. T-08"
              className="w-full h-10 px-3.5 bg-neutral-800/80 border border-white/10 rounded-lg text-base text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-['Inter']"
            />
          </div>

          {/* Date Range */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block font-['Inter']">
              Date Range
            </label>
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full h-10 px-3.5 bg-neutral-800/80 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500 appearance-none font-['Inter'] cursor-pointer"
              >
                <option value="TODAY">TODAY</option>
                <option value="YESTERDAY">YESTERDAY</option>
                <option value="THIS WEEK">THIS WEEK</option>
                <option value="CUSTOM">CUSTOM</option>
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleApply}
            className="h-10 bg-amber-400 hover:bg-amber-300 text-white font-semibold rounded-lg text-base transition-colors cursor-pointer shadow-md"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="h-10 bg-neutral-800/80 hover:bg-neutral-750 text-neutral-300 border border-white/10 font-medium rounded-lg text-base transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};
