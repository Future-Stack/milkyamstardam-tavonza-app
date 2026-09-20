'use client';

import React, { useState } from 'react';
import {
  Plus,
  Users,
  CheckCircle2,
  Bookmark,
  DollarSign,
  Search,
  Filter,
  Wine,
  Clock,
  AlertTriangle,
  X,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

interface BeverageQueueOrder {
  id: string;
  orderId: string;
  table: string;
  items: string;
  bartender: string;
  priority: 'High' | 'Medium' | 'Normal';
  eta: string;
  notes: string;
  status: 'Pending' | 'Preparing' | 'Ready';
}

const initialOrders: BeverageQueueOrder[] = [
  {
    id: 'bq-1',
    orderId: '#10482',
    table: 'T-08',
    items: 'Mojito ×2',
    bartender: 'James',
    priority: 'High',
    eta: '03 min',
    notes: 'Extra mint',
    status: 'Pending',
  },
  {
    id: 'bq-2',
    orderId: '#10483',
    table: 'T-08',
    items: 'Mojito ×2',
    bartender: 'James',
    priority: 'High',
    eta: '03 min',
    notes: 'Extra mint',
    status: 'Preparing',
  },
  {
    id: 'bq-3',
    orderId: '#10484',
    table: 'T-04',
    items: 'Espresso Martini ×1 · Sparkling Water ×1',
    bartender: 'James',
    priority: 'High',
    eta: '04 min',
    notes: 'Double espresso shot',
    status: 'Pending',
  },
  {
    id: 'bq-4',
    orderId: '#10485',
    table: 'Bar Counter',
    items: 'Cappuccino ×2',
    bartender: 'James',
    priority: 'High',
    eta: '03 min',
    notes: 'Oat milk for both',
    status: 'Preparing',
  },
  {
    id: 'bq-5',
    orderId: '#10486',
    table: 'T-12',
    items: 'Old Fashioned ×1 · Bourbon Neat ×1',
    bartender: 'Sarah',
    priority: 'Medium',
    eta: '05 min',
    notes: 'Large crystal cube',
    status: 'Pending',
  },
  {
    id: 'bq-6',
    orderId: '#10487',
    table: 'VIP-01',
    items: 'Signature Mocktail ×3',
    bartender: 'James',
    priority: 'High',
    eta: '02 min',
    notes: 'Spicy tajin rim on one',
    status: 'Pending',
  },
  {
    id: 'bq-7',
    orderId: '#10488',
    table: 'T-02',
    items: 'Negroni ×2',
    bartender: 'Sarah',
    priority: 'Normal',
    eta: '06 min',
    notes: 'Orange peel expressed',
    status: 'Pending',
  },
  {
    id: 'bq-8',
    orderId: '#10489',
    table: 'T-15',
    items: 'Fresh Mango Juice ×2',
    bartender: 'Michael',
    priority: 'Normal',
    eta: '04 min',
    notes: 'No added sugar',
    status: 'Pending',
  },
  {
    id: 'bq-9',
    orderId: '#10490',
    table: 'Bar Counter',
    items: 'Draft IPA ×2 · Pilsner ×1',
    bartender: 'Michael',
    priority: 'High',
    eta: '01 min',
    notes: 'Chilled pint glasses',
    status: 'Preparing',
  },
];

export default function BeverageQueueView() {
  const [orders, setOrders] = useState<BeverageQueueOrder[]>(initialOrders);
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Normal'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // Form State
  const [newTable, setNewTable] = useState('T-08');
  const [newItems, setNewItems] = useState('Signature Mojito ×2');
  const [newBartender, setNewBartender] = useState('James');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Normal'>('High');
  const [newEta, setNewEta] = useState('03 min');
  const [newNotes, setNewNotes] = useState('');

  // Filtering
  const filteredOrders = orders.filter((ord) => {
    const matchesPriority = priorityFilter === 'All' || ord.priority === priorityFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      ord.orderId.toLowerCase().includes(q) ||
      ord.table.toLowerCase().includes(q) ||
      ord.items.toLowerCase().includes(q) ||
      ord.bartender.toLowerCase().includes(q) ||
      ord.notes.toLowerCase().includes(q);
    return matchesPriority && matchesSearch;
  });

  const handlePrepare = (id: string, orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'Preparing' } : o))
    );
    toast.info(`Order ${orderId} marked as Preparing.`);
  };

  const handleReady = (id: string, orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'Ready' } : o))
    );
    toast.success(`Order ${orderId} is Ready for pickup!`);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrd: BeverageQueueOrder = {
      id: `bq-${Date.now()}`,
      orderId: `#${Math.floor(10000 + Math.random() * 90000)}`,
      table: newTable,
      items: newItems,
      bartender: newBartender,
      priority: newPriority,
      eta: newEta,
      notes: newNotes || 'Standard preparation',
      status: 'Pending',
    };
    setOrders((prev) => [newOrd, ...prev]);
    toast.success(`Drink order ${newOrd.orderId} added to Beverage Queue!`);
    setIsNewOrderModalOpen(false);
    setNewNotes('');
  };

  return (
    <div className="space-y-7 max-w-[1400px] mx-auto pb-20">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-white text-4xl font-semibold font-['Inter'] leading-tight tracking-tight">
            Beverage Queue
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg font-normal font-['Inter'] leading-6 mt-0.5">
            Active drink orders awaiting preparation
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewOrderModalOpen(true)}
          className="h-10 px-4 bg-amber-400 hover:bg-amber-300 text-white rounded-[10px] shadow-md font-semibold text-sm font-['Inter'] transition-transform transform active:scale-95 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-white stroke-[2.5]" />
          New Order
        </button>
      </div>

      {/* 2. Four Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Occupied */}
        <div className="h-20 p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/15 backdrop-blur-md flex items-center gap-3.5 shadow-sm">
          <div className="size-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <div className="text-orange-500 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">
              16/30
            </div>
            <div className="text-zinc-400 text-sm font-medium font-['Inter'] mt-0.5">
              Occupied
            </div>
          </div>
        </div>

        {/* Card 2: Available */}
        <div className="h-20 p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/15 backdrop-blur-md flex items-center gap-3.5 shadow-sm">
          <div className="size-10 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <div className="text-green-500 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">
              10
            </div>
            <div className="text-zinc-400 text-sm font-medium font-['Inter'] mt-0.5">
              Available
            </div>
          </div>
        </div>

        {/* Card 3: Reserved */}
        <div className="h-20 p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/15 backdrop-blur-md flex items-center gap-3.5 shadow-sm">
          <div className="size-10 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Bookmark className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-blue-400 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">
              4
            </div>
            <div className="text-zinc-400 text-sm font-medium font-['Inter'] mt-0.5">
              Reserved
            </div>
          </div>
        </div>

        {/* Card 4: Active Revenue */}
        <div className="h-20 p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/15 backdrop-blur-md flex items-center gap-3.5 shadow-sm">
          <div className="size-10 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="text-purple-400 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">
              $1583
            </div>
            <div className="text-zinc-400 text-sm font-medium font-['Inter'] mt-0.5">
              Active Revenue
            </div>
          </div>
        </div>
      </div>

      {/* 3. Priority Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Segmented Priority Control */}
        <div className="h-9 inline-flex rounded-lg overflow-hidden border border-white/20 bg-zinc-900/60 shadow-sm self-start">
          {(['All', 'High', 'Medium', 'Normal'] as const).map((tab) => {
            const isActive = priorityFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setPriorityFilter(tab)}
                className={`h-full px-4 text-sm font-medium font-['Inter'] transition-colors cursor-pointer border-r last:border-r-0 border-white/10 ${
                  isActive
                    ? 'bg-yellow-500 text-white font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
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
            placeholder="Search queue orders..."
            className="w-full h-9 pl-9 pr-3 bg-zinc-900 rounded-lg border border-white/10 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
      </div>

      {/* 4. Comprehensive Beverage Queue Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-zinc-900 border-b border-white/10 text-sm font-semibold text-white font-['Inter'] uppercase tracking-wider">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Table</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Bartender</th>
                <th className="py-3.5 px-4 text-center">Priority</th>
                <th className="py-3.5 px-4 text-center">ETA</th>
                <th className="py-3.5 px-4">Notes</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-base">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500 text-base">
                    No beverage orders matching the current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    className={`hover:bg-white/[0.03] transition-colors ${
                      ord.status === 'Ready'
                        ? 'opacity-60 bg-emerald-500/[0.02]'
                        : ord.status === 'Preparing'
                        ? 'bg-amber-500/[0.03]'
                        : ''
                    }`}
                  >
                    {/* Order ID */}
                    <td className="py-4 px-4 text-base font-medium text-white font-mono">
                      {ord.orderId}
                    </td>

                    {/* Table Pill */}
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-[5px] bg-white/15 text-white text-sm font-semibold font-['Inter']">
                        {ord.table}
                      </span>
                    </td>

                    {/* Items */}
                    <td className="py-4 px-4 text-base font-medium text-white font-['Inter']">
                      {ord.items}
                    </td>

                    {/* Bartender */}
                    <td className="py-4 px-4 text-base font-medium text-zinc-300 font-['Inter']">
                      {ord.bartender}
                    </td>

                    {/* Priority Badge */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-[5px] text-sm font-semibold font-['Inter'] ${
                          ord.priority === 'High'
                            ? 'bg-yellow-950 text-orange-500 border border-orange-500/30'
                            : ord.priority === 'Medium'
                            ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {ord.priority}
                      </span>
                    </td>

                    {/* ETA */}
                    <td className="py-4 px-4 text-center text-base font-medium text-zinc-300 font-mono">
                      {ord.eta}
                    </td>

                    {/* Notes */}
                    <td className="py-4 px-4 text-base font-normal text-zinc-400 font-['Inter'] italic">
                      {ord.notes}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Prepare Button */}
                        <button
                          type="button"
                          onClick={() => handlePrepare(ord.id, ord.orderId)}
                          disabled={ord.status === 'Preparing' || ord.status === 'Ready'}
                          className={`px-3 py-1 rounded-[4px] border text-sm font-medium font-mono transition-colors cursor-pointer ${
                            ord.status === 'Preparing'
                              ? 'bg-amber-500 text-white font-bold border-amber-500'
                              : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/30'
                          }`}
                        >
                          {ord.status === 'Preparing' ? 'In Prep' : 'Prepare'}
                        </button>

                        {/* Ready Button */}
                        <button
                          type="button"
                          onClick={() => handleReady(ord.id, ord.orderId)}
                          disabled={ord.status === 'Ready'}
                          className={`px-3 py-1 rounded-[4px] border text-sm font-medium font-mono transition-colors cursor-pointer ${
                            ord.status === 'Ready'
                              ? 'bg-emerald-500 text-white font-bold border-emerald-500'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30'
                          }`}
                        >
                          {ord.status === 'Ready' ? 'Completed' : 'Ready'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: NEW BEVERAGE ORDER MODAL */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Wine className="w-5 h-5 text-amber-400" />
                Create New Drink Ticket
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
                  <label className="text-sm text-gray-400 font-medium">Assigned Bartender</label>
                  <input
                    type="text"
                    value={newBartender}
                    onChange={(e) => setNewBartender(e.target.value)}
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
                  placeholder="e.g. Signature Mojito ×2"
                  className="w-full h-9 mt-1 px-3 bg-neutral-800 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-400 font-medium">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as 'High' | 'Medium' | 'Normal')}
                    className="w-full h-9 mt-1 px-3 bg-neutral-800 border border-white/10 rounded-lg text-sm text-white outline-none"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Normal">Normal Priority</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium">Target ETA</label>
                  <input
                    type="text"
                    value={newEta}
                    onChange={(e) => setNewEta(e.target.value)}
                    className="w-full h-9 mt-1 px-3 bg-neutral-800 border border-white/10 rounded-lg text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 font-medium">Preparation Notes</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Extra mint, sugar-free, spicy tajin rim..."
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
                  Dispatch Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
