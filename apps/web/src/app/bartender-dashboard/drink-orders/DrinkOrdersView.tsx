'use client';

import React, { useState } from 'react';
import {
  Download,
  Plus,
  Search,
  Eye,
  X,
  Send,
  Wine,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Printer,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export interface DrinkOrderRecord {
  id: string;
  orderId: string;
  table: string;
  items: string;
  waiter: string;
  time: string;
  amount: string;
  status: 'preparing' | 'ready' | 'completed' | 'delayed';
  notes?: string;
}

const mockOrdersData: DrinkOrderRecord[] = [
  {
    id: 'do-1',
    orderId: '#10482',
    table: 'T-08',
    items: 'Mojito ×2',
    waiter: 'James',
    time: '03 min',
    amount: '$18.00',
    status: 'preparing',
    notes: 'Extra mint, crushed ice',
  },
  {
    id: 'do-2',
    orderId: '#10483',
    table: 'T-08',
    items: 'Signature Mojito ×2',
    waiter: 'James',
    time: '03 min',
    amount: '$18.00',
    status: 'preparing',
    notes: 'Double lime wedge',
  },
  {
    id: 'do-3',
    orderId: '#10484',
    table: 'T-04',
    items: 'Espresso Martini ×1 · Sparkling Water',
    waiter: 'James',
    time: '04 min',
    amount: '$22.50',
    status: 'preparing',
    notes: 'Fresh espresso crema on top',
  },
  {
    id: 'do-4',
    orderId: '#10485',
    table: 'T-08',
    items: 'Negroni ×2',
    waiter: 'James',
    time: '12 min',
    amount: '$28.00',
    status: 'delayed',
    notes: 'Requires fresh orange peel peelers',
  },
  {
    id: 'do-5',
    orderId: '#10486',
    table: 'Bar Counter',
    items: 'Draft IPA ×2 · Craft Cider ×1',
    waiter: 'James',
    time: '02 min',
    amount: '$24.00',
    status: 'preparing',
    notes: 'Chilled glassware',
  },
  {
    id: 'do-6',
    orderId: '#10487',
    table: 'VIP-01',
    items: 'Old Fashioned ×2 · Macallan 12 Neat',
    waiter: 'James',
    time: '06 min',
    amount: '$64.00',
    status: 'ready',
    notes: 'Large clear ice spheres',
  },
  {
    id: 'do-7',
    orderId: '#10488',
    table: 'T-12',
    items: 'Virgin Mojito ×2 · Mango Lassi ×1',
    waiter: 'Sarah',
    time: '08 min',
    amount: '$21.00',
    status: 'preparing',
    notes: 'Less sugar syrup',
  },
  {
    id: 'do-8',
    orderId: '#10489',
    table: 'T-02',
    items: 'Aperol Spritz ×3',
    waiter: 'Michael',
    time: '15 min',
    amount: '$39.00',
    status: 'completed',
    notes: 'Delivered to patio table',
  },
  {
    id: 'do-9',
    orderId: '#10490',
    table: 'T-15',
    items: 'Gin & Tonic ×2 · Club Soda ×1',
    waiter: 'Michael',
    time: '16 min',
    amount: '$26.00',
    status: 'completed',
    notes: 'Cucumber ribbon garnish',
  },
  {
    id: 'do-10',
    orderId: '#10491',
    table: 'T-08',
    items: 'Spicy Mezcalita ×2',
    waiter: 'James',
    time: '14 min',
    amount: '$32.00',
    status: 'delayed',
    notes: 'Tajin salt rim requested',
  },
];

export default function DrinkOrdersView() {
  const [orders, setOrders] = useState<DrinkOrderRecord[]>(mockOrdersData);
  const [statusFilter, setStatusFilter] = useState<'All' | 'preparing' | 'ready' | 'completed' | 'delayed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Order for Inspect Modal
  const [selectedOrder, setSelectedOrder] = useState<DrinkOrderRecord | null>(null);

  // New Order Modal
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newTable, setNewTable] = useState('T-08');
  const [newItems, setNewItems] = useState('Mojito ×2');
  const [newWaiter, setNewWaiter] = useState('James');
  const [newAmount, setNewAmount] = useState('$18.00');
  const [newNotes, setNewNotes] = useState('');

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus =
      statusFilter === 'All' || ord.status.toLowerCase() === statusFilter.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      ord.orderId.toLowerCase().includes(q) ||
      ord.table.toLowerCase().includes(q) ||
      ord.items.toLowerCase().includes(q) ||
      ord.waiter.toLowerCase().includes(q) ||
      ord.amount.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Order ID,Table,Items,Waiter,Time,Amount,Status']
        .concat(
          filteredOrders.map(
            (o) =>
              `"${o.orderId}","${o.table}","${o.items}","${o.waiter}","${o.time}","${o.amount}","${o.status}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `drink_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Drink orders CSV exported successfully!');
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrd: DrinkOrderRecord = {
      id: `do-${Date.now()}`,
      orderId: `#${Math.floor(10000 + Math.random() * 90000)}`,
      table: newTable,
      items: newItems,
      waiter: newWaiter,
      time: '01 min',
      amount: newAmount,
      status: 'preparing',
      notes: newNotes || 'Standard mixology',
    };
    setOrders([newOrd, ...orders]);
    toast.success(`Drink order ${newOrd.orderId} dispatched to bar stations!`);
    setIsNewOrderModalOpen(false);
    setNewNotes('');
  };

  const updateOrderStatus = (orderId: string, newStatus: DrinkOrderRecord['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    toast.info(`Order ${orderId} updated to ${newStatus}`);
  };

  return (
    <div className="space-y-7 max-w-[1400px] mx-auto pb-20">
      {/* 1. Top Header Row with Export & New Order buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-white text-4xl font-semibold font-['Inter'] leading-tight tracking-tight">
            Drink Orders
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg font-normal font-['Inter'] leading-6 mt-0.5">
            Full order history and status tracking
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-10 px-4 bg-zinc-900 hover:bg-zinc-800 border border-white/20 text-white rounded-[10px] font-semibold text-sm font-['Inter'] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            Export
          </button>

          {/* New Order Button */}
          <button
            type="button"
            onClick={() => setIsNewOrderModalOpen(true)}
            className="h-10 px-4 bg-amber-400 hover:bg-amber-300 text-white rounded-[10px] shadow-md font-semibold text-sm font-['Inter'] transition-transform transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white stroke-[2.5]" />
            New Order
          </button>
        </div>
      </div>

      {/* 2. Four Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Today */}
        <div className="h-20 p-4 sm:p-5 bg-white/5 rounded-xl border border-white/20 backdrop-blur-[10.20px] flex items-center justify-start shadow-sm">
          <div>
            <div className="text-orange-500 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">
              142
            </div>
            <div className="text-zinc-400 text-sm font-medium font-['Inter'] mt-0.5">
              Total Today
            </div>
          </div>
        </div>

        {/* Card 2: Preparing */}
        <div className="h-20 p-4 sm:p-5 bg-white/5 rounded-xl border border-white/20 backdrop-blur-[10.20px] flex items-center justify-start shadow-sm">
          <div>
            <div className="text-green-500 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">
              03
            </div>
            <div className="text-zinc-400 text-sm font-medium font-['Inter'] mt-0.5">
              Preparing
            </div>
          </div>
        </div>

        {/* Card 3: Ready */}
        <div className="h-20 p-4 sm:p-5 bg-white/5 rounded-xl border border-white/20 backdrop-blur-[10.20px] flex items-center justify-start shadow-sm">
          <div>
            <div className="text-blue-400 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">
              01
            </div>
            <div className="text-zinc-400 text-sm font-medium font-['Inter'] mt-0.5">
              Ready
            </div>
          </div>
        </div>

        {/* Card 4: Delayed */}
        <div className="h-20 p-4 sm:p-5 bg-white/5 rounded-xl border border-white/20 backdrop-blur-[10.20px] flex items-center justify-start shadow-sm">
          <div>
            <div className="text-purple-400 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">
              02
            </div>
            <div className="text-zinc-400 text-sm font-medium font-['Inter'] mt-0.5">
              Delayed
            </div>
          </div>
        </div>
      </div>

      {/* 3. Segmented Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Segmented Status Tabs */}
        <div className="h-9 inline-flex rounded-lg overflow-hidden border border-white/20 bg-zinc-900/60 shadow-sm self-start">
          {(['All', 'preparing', 'ready', 'completed', 'delayed'] as const).map((st) => {
            const isActive = statusFilter.toLowerCase() === st.toLowerCase();
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`h-full px-4 text-sm font-medium font-['Inter'] capitalize transition-colors cursor-pointer border-r last:border-r-0 border-white/10 ${
                  isActive
                    ? 'bg-yellow-500 text-white font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders, table, waiter..."
            className="w-full h-9 pl-9 pr-3 bg-zinc-900 rounded-lg border border-white/10 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
      </div>

      {/* 4. Comprehensive Drink Orders Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-zinc-900 border-b border-white/10 text-sm font-semibold text-white font-['Inter'] uppercase tracking-wider">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Table</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Waiter</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-base">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500 text-base">
                    No drink orders matching current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    className={`hover:bg-white/[0.03] transition-colors ${
                      ord.status === 'delayed'
                        ? 'bg-red-500/[0.02]'
                        : ord.status === 'ready'
                        ? 'bg-emerald-500/[0.02]'
                        : ''
                    }`}
                  >
                    {/* Order ID */}
                    <td className="py-4 px-4 text-base font-medium text-white font-mono">
                      {ord.orderId}
                    </td>

                    {/* Table Pill */}
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-[5px] bg-white/20 text-white text-sm font-semibold font-['Inter']">
                        {ord.table}
                      </span>
                    </td>

                    {/* Items */}
                    <td className="py-4 px-4 text-base font-medium text-white font-['Inter']">
                      {ord.items}
                    </td>

                    {/* Waiter */}
                    <td className="py-4 px-4 text-base font-medium text-zinc-300 font-['Inter']">
                      {ord.waiter}
                    </td>

                    {/* Time */}
                    <td className="py-4 px-4 text-base font-normal text-zinc-300 font-mono">
                      {ord.time}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 text-base font-semibold text-white font-mono">
                      {ord.amount}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-sm text-sm font-medium font-mono capitalize ${
                          ord.status === 'preparing'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : ord.status === 'ready'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : ord.status === 'delayed'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-zinc-800 text-zinc-300 border border-white/10'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(ord)}
                        className="size-7 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white inline-flex items-center justify-center transition-colors cursor-pointer"
                        title="View Order Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ORDER DETAILS INSPECTION MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-amber-400 font-mono">
                    {selectedOrder.orderId}
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-white font-semibold">
                    {selectedOrder.table}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white font-['Inter']">
                  {selectedOrder.items}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Details Body */}
            <div className="space-y-3 text-sm text-zinc-300">
              <div className="grid grid-cols-2 gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-zinc-500 block">Server / Waiter</span>
                  <span className="text-white font-medium">{selectedOrder.waiter}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Ticket Age</span>
                  <span className="text-white font-medium font-mono">{selectedOrder.time}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Order Total</span>
                  <span className="text-white font-bold font-mono text-base">{selectedOrder.amount}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Current Status</span>
                  <span className="capitalize text-amber-400 font-semibold">{selectedOrder.status}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="p-3 bg-neutral-800/80 rounded-xl border border-white/5">
                  <span className="text-zinc-400 font-medium block mb-0.5">Special Instructions:</span>
                  <p className="text-white italic">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Status Update Actions */}
              <div className="pt-2">
                <span className="text-zinc-400 font-medium block mb-1.5">Change Order Status:</span>
                <div className="grid grid-cols-4 gap-2">
                  {(['preparing', 'ready', 'completed', 'delayed'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateOrderStatus(selectedOrder.orderId, st)}
                      className={`py-1.5 rounded-lg border text-center text-sm font-mono capitalize transition-colors cursor-pointer ${
                        selectedOrder.status === st
                          ? 'bg-amber-500 text-white font-bold border-amber-500'
                          : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => toast.success(`Receipt printed for ${selectedOrder.orderId}`)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-zinc-200 rounded-lg text-sm font-medium flex items-center gap-1.5 cursor-pointer border border-white/10"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Ticket
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-white font-bold rounded-lg text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: NEW ORDER CREATION MODAL */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Wine className="w-5 h-5 text-amber-400" />
                Dispatch Drink Ticket
              </h3>
              <button
                type="button"
                onClick={() => setIsNewOrderModalOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-400 font-medium">Table / Area</label>
                  <input
                    type="text"
                    value={newTable}
                    onChange={(e) => setNewTable(e.target.value)}
                    className="w-full h-9 mt-1 px-3 bg-neutral-800 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium">Server / Waiter</label>
                  <input
                    type="text"
                    value={newWaiter}
                    onChange={(e) => setNewWaiter(e.target.value)}
                    className="w-full h-9 mt-1 px-3 bg-neutral-800 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 font-medium">Drink Items</label>
                <input
                  type="text"
                  value={newItems}
                  onChange={(e) => setNewItems(e.target.value)}
                  className="w-full h-9 mt-1 px-3 bg-neutral-800 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 font-medium">Amount ($)</label>
                <input
                  type="text"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full h-9 mt-1 px-3 bg-neutral-800 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 font-medium">Preparation Notes</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Extra ice, gluten-free beer..."
                  className="w-full h-9 mt-1 px-3 bg-neutral-800 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-white font-bold rounded-lg text-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
