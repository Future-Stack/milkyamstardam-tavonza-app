'use client';

import React, { useState } from 'react';
import { Filter, Plus, Receipt, X } from 'lucide-react';
import { toast } from 'sonner';
import { LiveOrdersKPIs } from './components/LiveOrdersKPIs';
import { LiveOrdersFilterTabs } from './components/LiveOrdersFilterTabs';
import { LiveOrdersTable } from './components/LiveOrdersTable';
import { FilterOrdersModal } from './components/FilterOrdersModal';
import { NewOrderModal } from './components/NewOrderModal';
import {
  DetailedLiveOrder,
  LiveOrderStatus,
  FilterOrdersState,
} from '../types';
import {
  initialDetailedLiveOrders,
  initialLiveOrdersKPIData,
} from '../data';

export const LiveOrdersView: React.FC = () => {
  const [orders, setOrders] = useState<DetailedLiveOrder[]>(initialDetailedLiveOrders);
  const [kpiData] = useState(initialLiveOrdersKPIData);
  const [activeTab, setActiveTab] = useState<LiveOrderStatus>('All');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DetailedLiveOrder | null>(null);
  const [activeFilterState, setActiveFilterState] = useState<FilterOrdersState | null>(null);

  // Compute status counts
  const statusCounts: Record<LiveOrderStatus, number> = {
    All: orders.length,
    Waiting: orders.filter((o) => o.status === 'Waiting').length,
    Cooking: orders.filter((o) => o.status === 'Cooking').length,
    Preparing: orders.filter((o) => o.status === 'Preparing').length,
    Ready: orders.filter((o) => o.status === 'Ready').length,
    Served: orders.filter((o) => o.status === 'Served').length,
    Paid: orders.filter((o) => o.status === 'Paid').length,
  };

  // Filter orders by active tab and active filter modal criteria
  const filteredOrders = orders.filter((order) => {
    // Tab filter
    if (activeTab !== 'All' && order.status !== activeTab) {
      return false;
    }

    // Modal filters
    if (activeFilterState) {
      if (
        activeFilterState.status !== 'ALL' &&
        order.status !== activeFilterState.status
      ) {
        return false;
      }
      if (
        activeFilterState.waiter !== 'ALL' &&
        order.waiter !== activeFilterState.waiter
      ) {
        return false;
      }
      if (
        activeFilterState.tableNumber &&
        !order.table.toLowerCase().includes(activeFilterState.tableNumber.toLowerCase())
      ) {
        return false;
      }
    }

    return true;
  });

  const handleOrderCreated = (newOrder: DetailedLiveOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    toast.success(`Order ${newOrder.orderNumber} for ${newOrder.table} created!`);
  };

  const handleApplyFilters = (filters: FilterOrdersState) => {
    setActiveFilterState(filters);
    toast.info('Order filters applied');
  };

  const handleClearFilters = () => {
    setActiveFilterState(null);
    toast.info('Order filters reset');
  };

  return (
    <div className="space-y-6">
      {/* Top Header: Title + Subtitle + Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-3xl sm:text-4xl font-semibold font-['Inter'] leading-tight">
            Live Order Center
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg font-normal font-['Inter'] mt-1">
            Real-time order tracking across all tables
          </p>
        </div>

        {/* Header Action Buttons (Filter + New Order) */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={`px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-[10px] border border-white/20 text-white text-sm font-semibold font-['Inter'] flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeFilterState ? 'border-amber-400 text-amber-300' : ''
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-white/90" />
            <span>Filter</span>
            {activeFilterState && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsNewOrderModalOpen(true)}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-white rounded-[10px] shadow-[0px_1px_3px_0px_rgba(255,214,168,1.00)] text-sm font-semibold font-['Inter'] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Stat Cards */}
      <section aria-label="Order Metrics">
        <LiveOrdersKPIs data={kpiData} />
      </section>

      {/* Status Filter Tabs */}
      <section aria-label="Status Filters" className="flex items-center justify-between gap-3">
        <LiveOrdersFilterTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={statusCounts}
        />

        {activeFilterState && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm text-amber-400 hover:text-amber-300 underline font-mono shrink-0"
          >
            Clear active filters
          </button>
        )}
      </section>

      {/* Main Orders Table */}
      <section aria-label="Orders Table">
        <LiveOrdersTable
          orders={filteredOrders}
          onSelectOrder={(order) => setSelectedOrder(order)}
          onViewAll={() => {
            setActiveTab('All');
            setActiveFilterState(null);
            toast.info('Showing all orders without filter limits');
          }}
        />
      </section>

      {/* Filter Orders Modal */}
      <FilterOrdersModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        initialFilters={activeFilterState || undefined}
      />

      {/* New Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onOrderCreated={handleOrderCreated}
      />

      {/* Order Detail Quick Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 lg:left-72 top-20 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-black border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-500" />
                <h3 className="text-white font-bold font-['Inter'] text-xl">
                  Order {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-base">
              <div className="p-3 bg-zinc-950 rounded-lg border border-white/10">
                <span className="text-sm text-neutral-400 block">Table</span>
                <span className="font-mono font-bold text-white text-lg">
                  {selectedOrder.table}
                </span>
              </div>
              <div className="p-3 bg-zinc-950 rounded-lg border border-white/10">
                <span className="text-sm text-neutral-400 block">Status</span>
                <span className="font-semibold text-amber-400 text-base">
                  {selectedOrder.status}
                </span>
              </div>
              <div className="p-3 bg-zinc-950 rounded-lg border border-white/10">
                <span className="text-sm text-neutral-400 block">Server</span>
                <span className="font-medium text-neutral-200 text-base">
                  {selectedOrder.waiter}
                </span>
              </div>
              <div className="p-3 bg-zinc-950 rounded-lg border border-white/10">
                <span className="text-sm text-neutral-400 block">Total</span>
                <span className="font-mono font-bold text-emerald-400 text-lg">
                  ${selectedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-sm text-amber-300/90">
                <strong>Kitchen Notes:</strong> {selectedOrder.notes}
              </div>
            )}

            <div className="p-3 bg-zinc-950 rounded-xl border border-white/10 text-sm space-y-1 text-neutral-300">
              <div className="flex justify-between font-medium">
                <span>Items:</span>
                <span>{selectedOrder.itemsSummary || `${selectedOrder.itemsCount} items`}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>ETA:</span>
                <span>{selectedOrder.eta}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Logged at:</span>
                <span>{selectedOrder.time}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  toast.success(`Order ${selectedOrder.orderNumber} updated to Ready!`);
                  setOrders((prev) =>
                    prev.map((o) =>
                      o.id === selectedOrder.id ? { ...o, status: 'Ready' } : o
                    )
                  );
                  setSelectedOrder(null);
                }}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl text-base transition-colors"
              >
                Mark as Ready
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.info(`Printed ticket for ${selectedOrder.orderNumber}`);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-750 text-white font-medium rounded-xl text-base border border-white/10 transition-colors"
              >
                Print Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ManagerLiveOrdersView = LiveOrdersView;
export default LiveOrdersView;
