'use client';

import React, { useState } from 'react';
import {
  Wine,
  Coffee,
  CupSoda,
  Citrus,
  SlidersHorizontal,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Search,
  X,
  User,
  Activity,
  ArrowRightLeft,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

export interface StationOrder {
  id: string;
  orderNumber: string;
  item: string;
  table: string;
  time: string;
  priority: 'High' | 'Medium' | 'Normal';
  status: 'preparing' | 'ready' | 'completed' | 'delayed';
  notes?: string;
}

export interface BarStationDetail {
  id: string;
  name: string;
  iconType: 'cocktail' | 'coffee' | 'soft-drinks' | 'juice';
  activeOrders: number;
  capacity: number;
  status: 'Busy' | 'Normal' | 'Available';
  statusColor: string;
  dotColor: string;
  barColor: string;
  iconBg: string;
  bartender: string;
  uptime: string;
  orders: StationOrder[];
}

const initialStations: BarStationDetail[] = [
  {
    id: 'cocktail-station',
    name: 'Cocktail Station',
    iconType: 'cocktail',
    activeOrders: 8,
    capacity: 10,
    status: 'Busy',
    statusColor: 'text-red-400',
    dotColor: 'bg-red-500',
    barColor: 'bg-red-500',
    iconBg: 'bg-blue-500/10',
    bartender: 'James Carter',
    uptime: '98.2%',
    orders: [
      { id: 'cs-1', orderNumber: '#20581', item: 'Mojito ×2', table: 'T-08', time: '3 min', priority: 'High', status: 'preparing' },
      { id: 'cs-2', orderNumber: '#20581', item: 'Mojito ×2', table: 'T-08', time: '3 min', priority: 'Medium', status: 'preparing' },
      { id: 'cs-3', orderNumber: '#20581', item: 'Mojito ×2', table: 'T-08', time: '3 min', priority: 'Normal', status: 'ready' },
      { id: 'cs-4', orderNumber: '#20581', item: 'Mojito ×2', table: 'T-08', time: '3 min', priority: 'High', status: 'delayed' },
      { id: 'cs-5', orderNumber: '#20581', item: 'Mojito ×2', table: 'T-08', time: '3 min', priority: 'Normal', status: 'completed' },
      { id: 'cs-6', orderNumber: '#20581', item: 'Mojito ×2', table: 'T-08', time: '3 min', priority: 'Medium', status: 'preparing' },
      { id: 'cs-7', orderNumber: '#20581', item: 'Mojito ×2', table: 'T-08', time: '3 min', priority: 'Normal', status: 'preparing' },
    ],
  },
  {
    id: 'coffee-station',
    name: 'Coffee Station',
    iconType: 'coffee',
    activeOrders: 6,
    capacity: 10,
    status: 'Normal',
    statusColor: 'text-amber-500',
    dotColor: 'bg-amber-500',
    barColor: 'bg-yellow-500',
    iconBg: 'bg-gray-800',
    bartender: 'Maria Vance',
    uptime: '99.1%',
    orders: [
      { id: 'cf-1', orderNumber: '#20584', item: 'Espresso Double ×2', table: 'T-03', time: '2 min', priority: 'Medium', status: 'preparing' },
      { id: 'cf-2', orderNumber: '#20585', item: 'Oat Milk Flat White ×1', table: 'T-11', time: '4 min', priority: 'Normal', status: 'ready' },
      { id: 'cf-3', orderNumber: '#20586', item: 'Iced Vanilla Latte ×2', table: 'T-05', time: '1 min', priority: 'High', status: 'preparing' },
      { id: 'cf-4', orderNumber: '#20587', item: 'Cold Brew Reserve ×1', table: 'Bar Counter', time: '3 min', priority: 'Normal', status: 'completed' },
    ],
  },
  {
    id: 'soft-drinks-station',
    name: 'Soft Drinks Station',
    iconType: 'soft-drinks',
    activeOrders: 3,
    capacity: 10,
    status: 'Available',
    statusColor: 'text-emerald-500',
    dotColor: 'bg-emerald-500',
    barColor: 'bg-emerald-500',
    iconBg: 'bg-gray-800',
    bartender: 'Leo Chang',
    uptime: '99.8%',
    orders: [
      { id: 'sd-1', orderNumber: '#20588', item: 'Craft Ginger Beer ×2', table: 'T-09', time: '1 min', priority: 'Normal', status: 'ready' },
      { id: 'sd-2', orderNumber: '#20589', item: 'Sparkling Mineral Water ×2', table: 'T-14', time: '2 min', priority: 'Normal', status: 'preparing' },
      { id: 'sd-3', orderNumber: '#20590', item: 'Artisanal Tonic & Lime ×1', table: 'T-02', time: '5 min', priority: 'Medium', status: 'completed' },
    ],
  },
  {
    id: 'juice-station',
    name: 'Juice Station',
    iconType: 'juice',
    activeOrders: 3,
    capacity: 10,
    status: 'Available',
    statusColor: 'text-emerald-500',
    dotColor: 'bg-emerald-500',
    barColor: 'bg-emerald-500',
    iconBg: 'bg-gray-800',
    bartender: 'Chloe Bennett',
    uptime: '97.5%',
    orders: [
      { id: 'js-1', orderNumber: '#20591', item: 'Fresh Cold-Pressed Mango ×2', table: 'T-12', time: '2 min', priority: 'Normal', status: 'ready' },
      { id: 'js-2', orderNumber: '#20592', item: 'Green Detox Apple-Celery ×1', table: 'T-07', time: '3 min', priority: 'High', status: 'preparing' },
      { id: 'js-3', orderNumber: '#20593', item: 'Ruby Grapefruit Spritz ×2', table: 'T-16', time: '4 min', priority: 'Normal', status: 'delayed' },
    ],
  },
];

const pendingQueueOrders: StationOrder[] = [
  { id: 'pq-1', orderNumber: '#20594', item: 'Smoked Mezcal Paloma ×2', table: 'T-04', time: 'Just now', priority: 'High', status: 'preparing' },
  { id: 'pq-2', orderNumber: '#20595', item: 'Passionfruit Martini ×1', table: 'T-15', time: '1 min ago', priority: 'Medium', status: 'preparing' },
  { id: 'pq-3', orderNumber: '#20596', item: 'Matcha Iced Latte ×2', table: 'T-01', time: '2 min ago', priority: 'Normal', status: 'preparing' },
  { id: 'pq-4', orderNumber: '#20597', item: 'Fresh Yuzu Sparkling Cider ×2', table: 'T-10', time: '3 min ago', priority: 'Normal', status: 'preparing' },
];

export default function BarStationsView() {
  const [stations, setStations] = useState<BarStationDetail[]>(initialStations);
  const [selectedStationId, setSelectedStationId] = useState<string>('cocktail-station');
  const [activeFilter, setActiveFilter] = useState<'All' | 'preparing' | 'ready' | 'completed' | 'Delayed'>('All');

  // Modals state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<StationOrder | null>(null);

  // New assign order form state
  const [selectedPendingOrder, setSelectedPendingOrder] = useState<StationOrder>(pendingQueueOrders[0]);
  const [assignPriority, setAssignPriority] = useState<'High' | 'Medium' | 'Normal'>('High');

  // Station settings state
  const [editCapacity, setEditCapacity] = useState<number>(10);
  const [editBartender, setEditBartender] = useState<string>('');

  const currentStation = stations.find((s) => s.id === selectedStationId) || stations[0];

  // Filter orders
  const filteredOrders = currentStation.orders.filter((order) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'preparing') return order.status === 'preparing';
    if (activeFilter === 'ready') return order.status === 'ready';
    if (activeFilter === 'completed') return order.status === 'completed';
    if (activeFilter === 'Delayed') return order.status === 'delayed';
    return true;
  });

  // Calculate load percentage
  const loadPercentage = Math.round((currentStation.activeOrders / currentStation.capacity) * 100);

  // Render station icon
  const renderStationIcon = (type: string) => {
    switch (type) {
      case 'cocktail':
        return <Wine className="w-4 h-4 text-white" />;
      case 'coffee':
        return <Coffee className="w-4 h-4 text-white" />;
      case 'soft-drinks':
        return <CupSoda className="w-4 h-4 text-white" />;
      case 'juice':
        return <Citrus className="w-4 h-4 text-white" />;
      default:
        return <Wine className="w-4 h-4 text-white" />;
    }
  };

  // Handle Assigning an order to current station
  const handleAssignOrder = () => {
    if (!selectedPendingOrder) return;

    const newOrder: StationOrder = {
      ...selectedPendingOrder,
      id: `assigned-${Date.now()}`,
      priority: assignPriority,
      status: 'preparing',
      time: 'Just now',
    };

    setStations((prev) =>
      prev.map((s) => {
        if (s.id === currentStation.id) {
          const newOrders = [newOrder, ...s.orders];
          const newCount = newOrders.filter((o) => o.status !== 'completed').length;
          return {
            ...s,
            orders: newOrders,
            activeOrders: newCount,
            status: newCount >= s.capacity ? 'Busy' : newCount > 4 ? 'Normal' : 'Available',
            dotColor: newCount >= s.capacity ? 'bg-red-500' : newCount > 4 ? 'bg-amber-500' : 'bg-emerald-500',
            statusColor: newCount >= s.capacity ? 'text-red-400' : newCount > 4 ? 'text-amber-500' : 'text-emerald-500',
            barColor: newCount >= s.capacity ? 'bg-red-500' : newCount > 4 ? 'bg-yellow-500' : 'bg-emerald-500',
          };
        }
        return s;
      })
    );

    setIsAssignModalOpen(false);
    toast.success(`Assigned ${newOrder.item} (${newOrder.orderNumber}) to ${currentStation.name}`);
  };

  // Save station settings
  const handleSaveSettings = () => {
    setStations((prev) =>
      prev.map((s) => {
        if (s.id === currentStation.id) {
          return {
            ...s,
            capacity: editCapacity,
            bartender: editBartender || s.bartender,
          };
        }
        return s;
      })
    );
    setIsSettingsModalOpen(false);
    toast.success(`${currentStation.name} configuration updated.`);
  };

  // Quick order status transition
  const handleUpdateOrderStatus = (orderId: string, newStatus: 'preparing' | 'ready' | 'completed') => {
    setStations((prev) =>
      prev.map((s) => {
        if (s.id === currentStation.id) {
          const updatedOrders = s.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
          const newCount = updatedOrders.filter((o) => o.status !== 'completed').length;
          return {
            ...s,
            orders: updatedOrders,
            activeOrders: newCount,
            status: newCount >= s.capacity ? 'Busy' : newCount > 4 ? 'Normal' : 'Available',
            dotColor: newCount >= s.capacity ? 'bg-red-500' : newCount > 4 ? 'bg-amber-500' : 'bg-emerald-500',
            statusColor: newCount >= s.capacity ? 'text-red-400' : newCount > 4 ? 'text-amber-500' : 'text-emerald-500',
            barColor: newCount >= s.capacity ? 'bg-red-500' : newCount > 4 ? 'bg-yellow-500' : 'bg-emerald-500',
          };
        }
        return s;
      })
    );
    setSelectedOrderDetails(null);
    toast.success(`Order status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-4xl font-semibold font-['Inter'] leading-9 tracking-tight">
            Bar Stations
          </h1>
          <p className="text-zinc-500 text-lg font-normal font-['Inter'] leading-6 mt-1">
            Real-time station monitoring and management
          </p>
        </div>

        {/* Quick Station Stats Badge */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-sm text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-zinc-200">4 Active Stations Online</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">Total Load: {Math.round(stations.reduce((acc, s) => acc + s.activeOrders, 0) / stations.reduce((acc, s) => acc + s.capacity, 0) * 100)}%</span>
        </div>
      </div>

      {/* 2. Top 4 Station Capacity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stations.map((station) => {
          const isSelected = station.id === selectedStationId;
          const currentLoad = Math.min(100, Math.round((station.activeOrders / station.capacity) * 100));

          return (
            <div
              key={station.id}
              onClick={() => setSelectedStationId(station.id)}
              className={`h-28 p-4 relative rounded-[10px] outline outline-1 outline-offset-[-1px] transition-all duration-200 cursor-pointer select-none backdrop-blur-[10.20px] ${
                isSelected
                  ? 'bg-amber-500/10 outline-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/30'
                  : 'bg-white/5 outline-white/20 hover:bg-white/[0.08] hover:outline-white/30'
              }`}
            >
              {/* Top Row: Icon and Status */}
              <div className="flex items-center justify-between">
                {/* Station Icon */}
                <div
                  className={`w-7 h-7 rounded-[20px] inline-flex justify-center items-center ${station.iconBg}`}
                >
                  {renderStationIcon(station.iconType)}
                </div>

                {/* Status Indicator */}
                <div className="inline-flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 relative rounded-full ${station.dotColor}`} />
                  <span className={`text-xs font-medium font-['Inter'] leading-4 ${station.statusColor}`}>
                    {station.status}
                  </span>
                </div>
              </div>

              {/* Station Name */}
              <div className="mt-2 text-gray-200 text-base font-medium font-['Outfit'] leading-5 truncate">
                {station.name}
              </div>

              {/* Order Count Subtitle */}
              <div className="text-gray-500 text-sm font-medium font-['Inter'] leading-4">
                {station.activeOrders} / {station.capacity} orders
              </div>

              {/* Capacity Progress Bar */}
              <div className="w-full h-1 mt-2.5 bg-gray-800 rounded-full inline-flex flex-col justify-start items-start overflow-hidden">
                <div
                  className={`h-1 relative rounded-full transition-all duration-300 ${station.barColor}`}
                  style={{ width: `${currentLoad}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Filter Tabs (Segmented Control matching Figma) */}
      <div className="flex items-center pt-2">
        <div className="h-9 inline-flex items-center rounded-lg overflow-hidden border border-white/20 bg-zinc-950">
          {(['All', 'preparing', 'ready', 'completed', 'Delayed'] as const).map((tab, idx, arr) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`h-9 px-3.5 py-1.5 text-base font-['Inter'] transition-colors flex items-center justify-center cursor-pointer ${
                  isActive
                    ? 'bg-yellow-500 text-white font-medium shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5 font-normal'
                } ${idx !== arr.length - 1 ? 'border-r border-white/20' : ''}`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Two-Column Layout: Orders List & Station Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Active Orders at Selected Station */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white/10 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-md overflow-hidden flex flex-col min-h-[483px]">
          {/* Card Header */}
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="text-gray-200 text-base font-semibold font-['Inter'] leading-5">
              Active Orders at {currentStation.name}
            </div>
            <div className="text-sm text-zinc-500 font-['Inter']">
              Showing {filteredOrders.length} of {currentStation.orders.length} tickets
            </div>
          </div>

          {/* Orders Ticket List */}
          <div className="p-4 space-y-2.5 flex-1 overflow-y-auto max-h-[580px] custom-scrollbar">
            {filteredOrders.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6 text-zinc-500" />
                </div>
                <div className="text-base font-medium text-zinc-300">No {activeFilter !== 'All' ? activeFilter : ''} orders</div>
                <p className="text-sm text-zinc-500 mt-1">This station queue is currently clear for this filter.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderDetails(order)}
                  className="p-3  hover:bg-white/[0.09] rounded-[5px] outline outline-1 outline-offset-[-1px]  flex items-center gap-3 transition-colors cursor-pointer group"
                >
                  {/* Status Indicator Dot */}
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      order.status === 'delayed'
                        ? 'bg-red-500 animate-pulse'
                        : order.status === 'ready'
                        ? 'bg-emerald-500'
                        : order.status === 'completed'
                        ? 'bg-zinc-500'
                        : 'bg-red-500'
                    }`}
                  />

                  {/* Order Number */}
                  <div className="w-20 text-white text-base font-medium font-['Inter'] leading-5 flex-shrink-0">
                    {order.orderNumber}
                  </div>

                  {/* Drink Items */}
                  <div className="flex-1 text-gray-200 text-base font-normal font-['Inter'] leading-5 truncate">
                    {order.item}
                  </div>

                  {/* Table */}
                  <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-4 px-2 whitespace-nowrap">
                    {order.table}
                  </div>

                  {/* Elapsed Time */}
                  <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-4 px-2 whitespace-nowrap">
                    {order.time}
                  </div>

                  {/* Priority Badge */}
                  <div
                    className={`px-2 py-0.5 rounded-sm outline outline-1 outline-offset-[-1px] text-sm font-medium flex-shrink-0 ${
                      order.priority === 'High'
                        ? 'bg-red-500/10 text-red-400 outline-red-500/20 font-["Inter"]'
                        : order.priority === 'Medium'
                        ? 'bg-yellow-500/10 text-yellow-500 outline-yellow-500/20 font-["JetBrains_Mono"]'
                        : 'bg-emerald-500/10 text-emerald-500 outline-emerald-500/20 font-["JetBrains_Mono"]'
                    }`}
                  >
                    {order.priority}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Station Detail Inspector Card (Figma w-96 card) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white/10 rounded-2xl outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-xl p-5 flex flex-col justify-between min-h-[483px] shadow-2xl">
          <div className="space-y-4">
            {/* Station Title */}
            <div>
              <div className="text-slate-200 text-base font-bold font-['Plus_Jakarta_Sans'] leading-5">
                {currentStation.name}
              </div>
              <div className="text-slate-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4 mt-0.5">
                Real-time station monitoring and management
              </div>
            </div>

            {/* Load Stats Row */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-sm font-normal font-['Plus_Jakarta_Sans'] text-gray-200 mb-2">
                <span>Load</span>
                <span>{loadPercentage}%</span>
              </div>

              {/* Load Progress Bar */}
              <div className="w-full h-1 bg-gray-800 rounded-full inline-flex flex-col justify-start items-start overflow-hidden">
                <div
                  className={`h-1 relative rounded-full transition-all duration-300 ${
                    loadPercentage >= 80 ? 'bg-red-500' : loadPercentage >= 50 ? 'bg-yellow-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, loadPercentage)}%` }}
                />
              </div>
            </div>

            {/* Specs Table with Dividers */}
            <div className="pt-4 space-y-0 text-base font-['Inter']">
              {/* Row: Active Orders */}
              <div className="py-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-gray-500 font-medium">Active Orders</span>
                <span className="text-gray-300 font-medium">
                  {currentStation.activeOrders < 10 ? `0${currentStation.activeOrders}` : currentStation.activeOrders}
                </span>
              </div>

              {/* Row: Capacity */}
              <div className="py-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-gray-500 font-medium">Capacity</span>
                <span className="text-gray-300 font-medium">
                  {currentStation.capacity < 10 ? `0${currentStation.capacity}` : currentStation.capacity}
                </span>
              </div>

              {/* Row: Bartender */}
              <div className="py-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-gray-500 font-medium">Bartender</span>
                <span className="text-gray-300 font-medium">{currentStation.bartender}</span>
              </div>

              {/* Row: Uptime */}
              <div className="py-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-gray-500 font-medium">Uptime</span>
                <span className="text-gray-300 font-medium">{currentStation.uptime}</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions Row: Assign Order Button & Settings Icon */}
          <div className="pt-6 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedPendingOrder(pendingQueueOrders[0]);
                setIsAssignModalOpen(true);
              }}
              className="flex-1 h-9 px-3.5 py-2 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 rounded-sm inline-flex justify-center items-center gap-2 text-white text-base font-medium font-['Outfit'] leading-5 transition-colors cursor-pointer shadow-lg shadow-yellow-500/20"
            >
              <Plus className="w-4 h-4 text-white" />
              Assign Order
            </button>

            <button
              type="button"
              onClick={() => {
                setEditCapacity(currentStation.capacity);
                setEditBartender(currentStation.bartender);
                setIsSettingsModalOpen(true);
              }}
              title="Station Configuration"
              className="h-9 w-9 px-2 bg-gray-800 hover:bg-zinc-700 active:bg-zinc-800 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/5 inline-flex justify-center items-center transition-colors cursor-pointer text-gray-200"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Modal: Assign Order to Station */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white font-['Inter']">
                  Assign Ticket to {currentStation.name}
                </h3>
                <p className="text-sm text-zinc-400 font-['Inter'] mt-0.5">
                  Select a queued ticket to dispatch directly to this station.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Select Pending Ticket
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {pendingQueueOrders.map((ticket) => {
                    const isPicked = selectedPendingOrder.id === ticket.id;
                    return (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedPendingOrder(ticket)}
                        className={`p-3 rounded-lg border text-sm cursor-pointer flex items-center justify-between transition-all ${
                          isPicked
                            ? 'bg-amber-500/15 border-amber-500/50 text-white'
                            : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:border-white/20'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span>{ticket.orderNumber}</span>
                            <span className="text-amber-400">· {ticket.table}</span>
                          </div>
                          <div className="text-zinc-300 mt-0.5">{ticket.item}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-zinc-500">{ticket.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Priority Selector */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Priority Override
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Normal', 'Medium', 'High'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAssignPriority(p)}
                      className={`py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                        assignPriority === p
                          ? p === 'High'
                            ? 'bg-red-500/20 border-red-500 text-red-400'
                            : p === 'Medium'
                            ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                            : 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-zinc-900 border-white/10 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3 bg-zinc-900/40">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignOrder}
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-lg shadow-yellow-500/20"
              >
                <Plus className="w-4 h-4" />
                Dispatch to {currentStation.name}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal: Station Configuration Settings */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white font-['Inter']">
                  Configure {currentStation.name}
                </h3>
                <p className="text-sm text-zinc-400 font-['Inter'] mt-0.5">
                  Adjust station capacity and lead mixologist.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Lead Mixologist / Bartender
                </label>
                <input
                  type="text"
                  value={editBartender}
                  onChange={(e) => setEditBartender(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500"
                  placeholder="Bartender name"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm font-medium text-zinc-300 mb-1">
                  <span>Max Station Order Capacity</span>
                  <span className="text-amber-400 font-bold">{editCapacity} orders</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={editCapacity}
                  onChange={(e) => setEditCapacity(Number(e.target.value))}
                  className="w-full accent-yellow-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-1">
                  <span>5 (Light)</span>
                  <span>10 (Default)</span>
                  <span>20 (Peak)</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3 bg-zinc-900/40">
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 rounded-lg transition-colors cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal: Order Quick Actions */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-sm text-amber-400 font-semibold font-mono">
                  {selectedOrderDetails.orderNumber}
                </span>
                <h4 className="text-base font-semibold text-white">{selectedOrderDetails.item}</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-sm">
              <div className="flex items-center justify-between py-1 border-b border-white/5 text-zinc-400">
                <span>Table:</span>
                <span className="text-white font-medium">{selectedOrderDetails.table}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5 text-zinc-400">
                <span>Elapsed:</span>
                <span className="text-white font-medium">{selectedOrderDetails.time}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5 text-zinc-400">
                <span>Current Status:</span>
                <span className="text-amber-400 capitalize font-medium">{selectedOrderDetails.status}</span>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => handleUpdateOrderStatus(selectedOrderDetails.id, 'ready')}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark as Ready for Server
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateOrderStatus(selectedOrderDetails.id, 'completed')}
                  className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Mark as Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
