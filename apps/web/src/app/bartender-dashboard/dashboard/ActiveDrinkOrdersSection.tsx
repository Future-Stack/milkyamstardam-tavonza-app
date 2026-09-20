'use client';

import React from 'react';
import { mockDrinkOrders } from '../data';
import { GlassWater, Clock, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface ActiveDrinkOrdersSectionProps {
  searchQuery?: string;
}

export default function ActiveDrinkOrdersSection({ searchQuery = '' }: ActiveDrinkOrdersSectionProps) {
  const filteredOrders = mockDrinkOrders.filter((ord) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      ord.orderNumber.toLowerCase().includes(q) ||
      ord.table.toLowerCase().includes(q) ||
      ord.items.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <h2 className="text-white text-lg font-semibold font-['Inter'] leading-tight">
            Active Drink Orders
          </h2>
          <p className="text-neutral-400 text-sm font-medium font-['Inter'] mt-0.5">
            Beverage Queue · {filteredOrders.length} active tickets
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast.info('Navigating to full Beverage Queue')}
          className="text-sm text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
        >
          View All
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[480px]">
          <thead>
            <tr className="border-b border-white/10 text-sm font-medium text-white/80 font-['Inter']">
              <th className="py-2.5 px-3">Order</th>
              <th className="py-2.5 px-3">Table</th>
              <th className="py-2.5 px-3">Items</th>
              <th className="py-2.5 px-3 text-center">Priority</th>
              <th className="py-2.5 px-3 text-right">ETA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-base">
            {filteredOrders.map((ord) => (
              <tr
                key={ord.id}
                className="hover:bg-white/5 transition-colors text-white font-['Inter']"
              >
                <td className="py-3 px-3 font-medium text-white font-mono text-sm">
                  {ord.orderNumber}
                </td>
                <td className="py-3 px-3 text-sm text-zinc-300">
                  {ord.table}
                </td>
                <td className="py-3 px-3 text-sm text-zinc-200 font-medium">
                  {ord.items}
                </td>
                <td className="py-3 px-3 text-center">
                  <span
                    className={`inline-block text-sm font-medium px-2 py-0.5 rounded-full ${
                      ord.priority === 'High'
                        ? 'text-red-400 bg-red-500/10 border border-red-500/20'
                        : ord.priority === 'Medium'
                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                        : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    }`}
                  >
                    {ord.priority}
                  </span>
                </td>
                <td className="py-3 px-3 text-right text-sm text-zinc-300 font-mono">
                  {ord.eta}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
