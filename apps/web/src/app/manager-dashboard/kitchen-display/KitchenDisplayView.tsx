'use client';

import React, { useState, useMemo } from 'react';
import {
  Clock,
  CheckCircle2,
  Flame,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  ChefHat,
  Timer,
  AlertTriangle,
  Layers,
  Utensils,
} from 'lucide-react';
import { toast } from 'sonner';

export interface KitchenTicketItem {
  name: string;
  quantity?: number;
  notes?: string;
}

export interface KitchenTicket {
  id: string;
  orderNumber: string;
  table: string;
  server: string;
  status: 'waiting' | 'cooking' | 'preparing' | 'ready';
  items: KitchenTicketItem[];
  elapsedMin: number;
  station: 'Grill' | 'Fry' | 'Pizza' | 'Salad';
  priority?: 'normal' | 'rush';
}

const initialKitchenTickets: KitchenTicket[] = [
  {
    id: 'k-1',
    orderNumber: '#10528',
    table: 'T-08',
    server: 'Emma',
    status: 'preparing',
    items: [
      { name: 'Margherita Pizza' },
      { name: 'Caesar Salad' },
      { name: 'Sparkling Water', quantity: 2 },
    ],
    elapsedMin: 8,
    station: 'Grill',
  },
  {
    id: 'k-2',
    orderNumber: '#10529',
    table: 'T-04',
    server: 'David',
    status: 'preparing',
    items: [
      { name: 'Crispy Calamari' },
      { name: 'Truffle Parmesan Fries' },
      { name: 'Draft IPA Beer', quantity: 2 },
    ],
    elapsedMin: 8,
    station: 'Fry',
  },
  {
    id: 'k-3',
    orderNumber: '#10530',
    table: 'T-12',
    server: 'Lucas',
    status: 'ready',
    items: [
      { name: 'Quattro Formaggi Pizza' },
      { name: 'Garlic Herb Bread' },
      { name: 'Classic Coca Cola' },
    ],
    elapsedMin: 8,
    station: 'Pizza',
  },
  {
    id: 'k-4',
    orderNumber: '#10531',
    table: 'T-02',
    server: 'Sarah',
    status: 'cooking',
    items: [
      { name: 'Dry-Aged Ribeye Steak', notes: 'Medium Rare' },
      { name: 'Charred Asparagus' },
      { name: 'Red Wine Sauce' },
    ],
    elapsedMin: 8,
    station: 'Grill',
  },
  {
    id: 'k-5',
    orderNumber: '#10532',
    table: 'T-07',
    server: 'Elena',
    status: 'waiting',
    items: [
      { name: 'Wagyu Beef Burger', notes: 'No pickles' },
      { name: 'Loaded Nachos Bowl' },
      { name: 'Sparkling Water', quantity: 2 },
    ],
    elapsedMin: 8,
    station: 'Grill',
  },
  {
    id: 'k-6',
    orderNumber: '#10533',
    table: 'T-15',
    server: 'Emma',
    status: 'ready',
    items: [
      { name: 'Spicy Pepperoni Pizza' },
      { name: 'Caesar Salad' },
      { name: 'Tiramisu Dessert' },
    ],
    elapsedMin: 6,
    station: 'Pizza',
  },
  {
    id: 'k-7',
    orderNumber: '#10534',
    table: 'T-09',
    server: 'Michael',
    status: 'cooking',
    items: [
      { name: 'BBQ Pulled Pork Sliders' },
      { name: 'Sweet Potato Fries' },
      { name: 'Coleslaw Dip' },
    ],
    elapsedMin: 11,
    station: 'Fry',
  },
  {
    id: 'k-8',
    orderNumber: '#10535',
    table: 'T-03',
    server: 'Lucas',
    status: 'waiting',
    items: [
      { name: 'Mediterranean Greek Salad' },
      { name: 'Caprese Burrata Bowl' },
      { name: 'Mineral Water' },
    ],
    elapsedMin: 4,
    station: 'Salad',
  },
];

export function KitchenDisplayView() {
  const [tickets, setTickets] = useState<KitchenTicket[]>(initialKitchenTickets);
  const [selectedStation, setSelectedStation] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completedCount, setCompletedCount] = useState<number>(132);

  // Stats calculation
  const queueCount = tickets.filter((t) => t.status !== 'ready').length;
  const delayedCount = tickets.filter((t) => t.elapsedMin >= 10).length;

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchStation =
        selectedStation === 'All' || t.station.toLowerCase() === selectedStation.toLowerCase();
      const matchStatus =
        selectedStatus === 'All' || t.status.toLowerCase() === selectedStatus.toLowerCase();
      const matchSearch =
        t.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.server.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchStation && matchStatus && matchSearch;
    });
  }, [tickets, selectedStation, selectedStatus, searchQuery]);

  // Mark ticket as ready
  const handleMarkReady = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'ready' as const } : t))
    );
    const target = tickets.find((t) => t.id === id);
    toast.success(
      `Order ${target?.orderNumber || ''} marked Ready for Table ${target?.table || ''}!`
    );
  };

  // Bump / Complete order
  const handleBumpOrder = (id: string) => {
    const target = tickets.find((t) => t.id === id);
    setTickets((prev) => prev.filter((t) => t.id !== id));
    setCompletedCount((prev) => prev + 1);
    toast.success(
      `Order ${target?.orderNumber || ''} bumped and sent to service!`
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header & Live Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-3xl font-semibold font-['Inter'] leading-9">
            Kitchen Display System
          </h1>
          <p className="text-slate-500 text-base font-normal font-['Inter'] leading-6 mt-1">
            Live order tickets for kitchen staff
          </p>
        </div>

        {/* Live Feed Pill */}
        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-400 text-sm font-medium font-['Plus_Jakarta_Sans'] leading-4">
            Live Feed
          </span>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards (Exact Figma specifications) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* In Queue */}
        <div className="h-24 bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-neutral-500/25 overflow-hidden p-4 flex flex-col justify-between">
          <div className="text-zinc-400 text-xs font-semibold font-['Inter'] leading-5">
            In Queue
          </div>
          <div className="text-emerald-500 text-xl font-bold font-['Inter'] leading-5">
            {queueCount.toString().padStart(2, '0')}
          </div>
          <div className="text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">
            Orders to prepare
          </div>
        </div>

        {/* Avg. Prep Time */}
        <div className="h-24 bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-neutral-500/25 overflow-hidden p-4 flex flex-col justify-between">
          <div className="text-zinc-400 text-xs font-semibold font-['Inter'] leading-5">
            Avg. Prep Time
          </div>
          <div className="text-blue-500 text-xl font-bold font-['Inter'] leading-5">
            13m
          </div>
          <div className="text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">
            Target: under 15m
          </div>
        </div>

        {/* Delayed Orders */}
        <div className="h-24 bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-neutral-500/25 overflow-hidden p-4 flex flex-col justify-between">
          <div className="text-zinc-400 text-xs font-semibold font-['Inter'] leading-5">
            Delayed Orders
          </div>
          <div className="text-yellow-500 text-xl font-bold font-['Inter'] leading-5">
            {delayedCount.toString().padStart(2, '0')}
          </div>
          <div className="text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">
            Immediate attention
          </div>
        </div>

        {/* Completed Today */}
        <div className="h-24 bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-neutral-500/25 overflow-hidden p-4 flex flex-col justify-between">
          <div className="text-zinc-400 text-xs font-semibold font-['Inter'] leading-5">
            Completed Today
          </div>
          <div className="text-violet-500 text-xl font-bold font-['Inter'] leading-5">
            {completedCount}
          </div>
          <div className="text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">
            ↑ 8% vs yesterday
          </div>
        </div>
      </div>

      {/* 3. Station Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-white/10">
        {/* Station Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
          {['All', 'Grill', 'Fry', 'Pizza', 'Salad'].map((station) => (
            <button
              key={station}
              onClick={() => setSelectedStation(station)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-['Inter'] transition-all cursor-pointer whitespace-nowrap ${
                selectedStation === station
                  ? 'bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
              }`}
            >
              {station === 'All' ? 'All Stations' : `${station} Station`}
            </button>
          ))}
        </div>

        {/* Status Filters & Search */}
        <div className="flex items-center gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-300 px-3 py-1.5 outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="waiting">Waiting</option>
            <option value="cooking">Cooking</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="bg-zinc-900 border border-white/10 rounded-lg text-xs text-white pl-8 pr-3 py-1.5 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 4. Ticket Cards Grid (Matching Figma card design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredTickets.map((ticket) => {
          const isReady = ticket.status === 'ready';
          const isCooking = ticket.status === 'cooking';
          const isPreparing = ticket.status === 'preparing';
          const isWaiting = ticket.status === 'waiting';

          return (
            <div
              key={ticket.id}
              className="w-full bg-white/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-lg flex flex-col justify-between overflow-hidden transition-all duration-200 hover:outline-white/30 hover:shadow-lg hover:shadow-black/40 relative"
            >
              {/* Card Header */}
              <div className="p-4 pb-3 flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-slate-200 text-xs font-medium font-['DM_Mono'] leading-4">
                    {ticket.orderNumber}
                  </span>
                  <span className="text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4 mt-0.5">
                    {ticket.table} · {ticket.server}
                  </span>
                </div>

                {/* Status Badge */}
                {isPreparing && (
                  <div className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-[5px] flex items-center">
                    <span className="text-amber-500 text-[10px] font-medium font-['Plus_Jakarta_Sans'] leading-4 lowercase">
                      preparing
                    </span>
                  </div>
                )}
                {isCooking && (
                  <div className="px-2 py-0.5 bg-slate-800 border border-blue-500/20 rounded-[5px] flex items-center">
                    <span className="text-blue-500 text-[10px] font-medium font-['Plus_Jakarta_Sans'] leading-4 lowercase">
                      cooking
                    </span>
                  </div>
                )}
                {isWaiting && (
                  <div className="px-2 py-0.5 bg-stone-900 border border-orange-500/20 rounded-[5px] flex items-center">
                    <span className="text-orange-600 text-[10px] font-medium font-['Plus_Jakarta_Sans'] leading-4 lowercase">
                      waiting
                    </span>
                  </div>
                )}
                {isReady && (
                  <div className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/30 rounded-[5px] flex items-center">
                    <span className="text-emerald-500 text-[10px] font-medium font-['Plus_Jakarta_Sans'] leading-4 lowercase">
                      ready
                    </span>
                  </div>
                )}
              </div>

              {/* Top Divider */}
              <div className="w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-neutral-800" />

              {/* Order Items List */}
              <div className="px-4 py-3 space-y-1.5 flex-1 min-h-[90px]">
                {ticket.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="size-1 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                    <div className="text-slate-200/80 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">
                      <span>{item.name}</span>
                      {item.quantity && item.quantity > 1 && (
                        <span className="text-amber-400/90 font-medium ml-1">
                          x{item.quantity}
                        </span>
                      )}
                      {item.notes && (
                        <span className="block text-[10px] text-amber-500/80 italic mt-0.5">
                          Note: {item.notes}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Meta (Time & Station) */}
              <div className="mx-4 pt-2.5 pb-2 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans']">
                  <Clock className="size-3 text-slate-500" />
                  <span>{ticket.elapsedMin} min</span>
                </div>
                <div className="px-2.5 py-0.5 bg-slate-500/10 rounded-[5px] text-slate-400 text-xs font-medium font-['Plus_Jakarta_Sans']">
                  {ticket.station}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-3 pt-0">
                {isReady ? (
                  <button
                    type="button"
                    onClick={() => handleBumpOrder(ticket.id)}
                    className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 active:scale-[0.99] text-black font-semibold text-xs font-['Plus_Jakarta_Sans'] leading-4 rounded-[5px] transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-yellow-500/10"
                  >
                    <span>✓ Bump Order</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleMarkReady(ticket.id)}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 active:scale-[0.99] border border-white/5 text-slate-200/70 hover:text-white font-semibold text-xs font-['Plus_Jakarta_Sans'] leading-4 rounded-[5px] transition-all cursor-pointer flex items-center justify-center"
                  >
                    <span>Mark Ready</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTickets.length === 0 && (
        <div className="p-12 text-center bg-zinc-900/40 rounded-xl border border-white/5">
          <ChefHat className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-zinc-400 text-sm font-medium">No tickets match the selected filters</p>
          <p className="text-zinc-600 text-xs mt-1">All kitchen stations are clear or no orders in queue.</p>
        </div>
      )}
    </div>
  );
}

export default KitchenDisplayView;
