'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DetailedLiveOrder, LiveOrderStatus } from '../../types';

interface LiveOrdersTableProps {
  orders: DetailedLiveOrder[];
  onSelectOrder?: (order: DetailedLiveOrder) => void;
  onViewAll?: () => void;
}

export const LiveOrdersTable: React.FC<LiveOrdersTableProps> = ({
  orders,
  onSelectOrder,
  onViewAll,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(orders.length / itemsPerPage));

  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: LiveOrderStatus) => {
    switch (status) {
      case 'Preparing':
        return (
          <span className="px-2.5 py-0.5 rounded-[5px] bg-yellow-950 text-orange-400 text-sm font-semibold font-['Inter'] border border-orange-500/20">
            Preparing
          </span>
        );
      case 'Cooking':
        return (
          <span className="px-2.5 py-0.5 rounded-[5px] bg-amber-950/70 text-amber-300 text-sm font-semibold font-['Inter'] border border-amber-500/20">
            Cooking
          </span>
        );
      case 'Waiting':
        return (
          <span className="px-2.5 py-0.5 rounded-[5px] bg-neutral-800 text-neutral-300 text-sm font-semibold font-['Inter'] border border-neutral-700">
            Waiting
          </span>
        );
      case 'Ready':
        return (
          <span className="px-2.5 py-0.5 rounded-[5px] bg-emerald-950/80 text-emerald-400 text-sm font-semibold font-['Inter'] border border-emerald-500/20">
            Ready
          </span>
        );
      case 'Served':
        return (
          <span className="px-2.5 py-0.5 rounded-[5px] bg-blue-950/80 text-blue-400 text-sm font-semibold font-['Inter'] border border-blue-500/20">
            Served
          </span>
        );
      case 'Paid':
        return (
          <span className="px-2.5 py-0.5 rounded-[5px] bg-purple-950/80 text-purple-300 text-sm font-semibold font-['Inter'] border border-purple-500/20">
            Paid
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-[5px] bg-zinc-900 text-white text-sm font-semibold font-['Inter']">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-black rounded-xl border border-white/10 overflow-hidden flex flex-col justify-between">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-base min-w-[850px]">
          <thead>
            <tr className="bg-black border-b border-white/10 text-white text-sm sm:text-base font-semibold font-['Inter']">
              <th className="py-4 px-6">Order ID</th>
              <th className="py-4 px-4">Table</th>
              <th className="py-4 px-5">Waiter</th>
              <th className="py-4 px-4">Items</th>
              <th className="py-4 px-4">Total</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">ETA</th>
              <th className="py-4 px-6 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-neutral-500 text-base">
                  No orders found matching the selected criteria.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder?.(order)}
                  className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                >
                  {/* Order ID */}
                  <td className="py-4 px-6 text-white font-medium font-['Inter'] group-hover:text-amber-400 transition-colors">
                    {order.orderNumber}
                  </td>

                  {/* Table Badge */}
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-white/15 text-white font-semibold text-sm rounded-[5px] border border-white/10 font-mono inline-block">
                      {order.table}
                    </span>
                  </td>

                  {/* Waiter */}
                  <td className="py-4 px-5 text-white font-medium font-['Inter']">
                    {order.waiter}
                  </td>

                  {/* Items count */}
                  <td className="py-4 px-4 text-neutral-300 font-['Inter']">
                    {order.itemsSummary || `${order.itemsCount} items`}
                  </td>

                  {/* Total */}
                  <td className="py-4 px-4 text-white font-medium font-mono">
                    ${order.total.toFixed(2)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4">{getStatusBadge(order.status)}</td>

                  {/* ETA */}
                  <td className="py-4 px-4 text-neutral-300 font-['Inter'] text-base">
                    {order.eta}
                  </td>

                  {/* Time */}
                  <td className="py-4 px-6 text-right text-white font-medium font-['Inter'] font-mono">
                    {order.time}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination */}
      <div className="p-4 sm:p-5 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-zinc-500 text-base font-medium font-['Inter']">
            Showing {paginatedOrders.length} of {orders.length} results
          </span>

          {/* Number pagination buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-sm border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNum) => {
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-sm text-base font-medium font-['Inter'] flex items-center justify-center transition-all ${
                    isActive
                      ? 'border border-yellow-500 text-yellow-500 shadow-[0px_0px_6px_rgba(255,185,0,0.6)] bg-yellow-500/10'
                      : 'border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 rounded-sm border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View All button */}
        <button
          type="button"
          onClick={onViewAll}
          className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-white font-semibold text-sm rounded-[5px] shadow-[0px_1px_3px_0px_rgba(255,214,168,1.00)] transition-all flex items-center gap-1.5"
        >
          <span>View All</span>
        </button>
      </div>
    </div>
  );
};
