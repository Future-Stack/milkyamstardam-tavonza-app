'use client';

import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { LiveOrder } from '../types';

interface LiveOrderCenterCardProps {
  orders: LiveOrder[];
  onSelectOrder?: (order: LiveOrder) => void;
  onViewLiveFeed?: () => void;
}

export const LiveOrderCenterCard: React.FC<LiveOrderCenterCardProps> = ({
  orders,
  onSelectOrder,
  onViewLiveFeed,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'Preparing' | 'Ready'>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (filter === 'ALL') return true;
    return order.status === filter;
  });

  const getStatusBadge = (status: LiveOrder['status']) => {
    if (status === 'Ready') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[5px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-sm font-medium">
          <CheckCircle2 className="w-3 h-3" />
          Ready
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[5px] bg-amber-950/70 text-amber-400 border border-amber-500/30 text-sm font-medium">
        <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
        Preparing
      </span>
    );
  };

  return (
    <div className="w-full bg-black rounded-[10px] border border-white/10 shadow-lg p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-white text-lg font-semibold font-['Inter']">
            Live Order Center
          </h2>
          <span className="text-sm px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono">
            {filteredOrders.length} active
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-black p-1 rounded-lg border border-white/10 text-sm">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === 'ALL'
                ? 'bg-amber-500 text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ALL
          </button>
          <button
            type="button"
            onClick={() => setFilter('Preparing')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === 'Preparing'
                ? 'bg-amber-500 text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Preparing
          </button>
          <button
            type="button"
            onClick={() => setFilter('Ready')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === 'Ready'
                ? 'bg-amber-500 text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Ready
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="mt-4 overflow-hidden rounded-[10px] border border-white/10 bg-black">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base min-w-[480px]">
            <thead>
              <tr className="bg-black border-b border-white/10 text-neutral-300 text-sm font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Table</th>
                <th className="py-3 px-4">Waiter</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order) => {
                const isSelected = selectedId === order.id;
                return (
                  <tr
                    key={order.id}
                    onClick={() => {
                      setSelectedId(order.id);
                      if (onSelectOrder) onSelectOrder(order);
                    }}
                    className={`cursor-pointer transition-colors duration-150 hover:bg-white/5 ${
                      isSelected ? 'bg-amber-500/10' : ''
                    }`}
                  >
                    {/* Order Number */}
                    <td className="py-3 px-4 font-mono font-medium text-white flex items-center gap-2">
                      <span className="text-amber-400">{order.orderNumber}</span>
                    </td>

                    {/* Table Badge */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-[5px] bg-white/10 text-white font-semibold text-sm border border-white/10 font-mono">
                        {order.table}
                      </span>
                    </td>

                    {/* Waiter */}
                    <td className="py-3 px-4 text-neutral-300 font-['Inter'] text-base">
                      {order.waiter}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">{getStatusBadge(order.status)}</td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right font-mono font-medium text-neutral-200">
                      ${order.amount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-3 flex items-center justify-between text-sm text-neutral-400 pt-2 border-t border-white/5">
        <span className="flex items-center gap-1 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          Syncing automatically with POS terminal
        </span>
        <button
          type="button"
          onClick={() => {
            if (onViewLiveFeed) {
              onViewLiveFeed();
            } else if (filteredOrders[0] && onSelectOrder) {
              onSelectOrder(filteredOrders[0]);
            }
          }}
          className="text-amber-500 hover:text-amber-400 font-medium inline-flex items-center gap-1 transition-colors group cursor-pointer"
        >
          View Live Feed
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
