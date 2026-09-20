'use client';

import React, { useState } from 'react';
import {
  Clock,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  Receipt,
  CreditCard,
  QrCode,
  DollarSign,
  User,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { BillQueueItem } from '../types';

interface BillQueueViewProps {
  queue: BillQueueItem[];
  onSelectTableForPayment?: (item: BillQueueItem) => void;
  onNewOrderClick?: () => void;
  onShowToast?: (msg: string) => void;
}

export default function BillQueueView({
  queue,
  onSelectTableForPayment,
  onNewOrderClick,
  onShowToast,
}: BillQueueViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<BillQueueItem | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);

  const filteredQueue = queue.filter(
    (item) =>
      item.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (item: BillQueueItem) => {
    setSelectedItem(item);
    setIsPaymentModalOpen(true);
  };

  const handleConfirmSettle = (method: string) => {
    if (!selectedItem) return;
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setIsPaymentModalOpen(false);
      onShowToast?.(
        `Payment of $${selectedItem.amountDue.toFixed(2)} settled for ${selectedItem.tableName} via ${method}!`
      );
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Bar (From Figma) */}
      <div className="w-full bg-black shadow-[0px_0px_4px_0px_rgba(212,212,212,0.25)] border border-zinc-800/80 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-semibold font-['Inter'] leading-8">
            Bill Queue
          </h1>
          <p className="text-slate-500 text-sm sm:text-base font-normal font-['Inter'] leading-5 mt-0.5">
            Tap a table to process existing QR or waiter bill.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* New Walk-In Order Action (From Figma: bg-amber-400 text-black) */}
          <button
            onClick={onNewOrderClick}
            className="px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4 text-black" />
            <span className="text-black text-sm sm:text-base font-medium font-['Inter']">
              New Walk-In Order
            </span>
          </button>

          {/* Live Sync Status (From Figma: bg-green-700/10 text-green-500) */}
          <div className="px-3.5 py-2.5 bg-green-700/10 rounded-lg flex items-center gap-2 border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-green-500 text-sm font-medium font-['Inter']">
              Live Sync • Active
            </span>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by table, order #, or customer name..."
            className="w-full h-9 pl-9 pr-3 bg-zinc-900 rounded-lg text-xs sm:text-sm text-white placeholder-zinc-500 border border-zinc-800 focus:outline-none focus:border-amber-400"
          />
        </div>
        <div className="text-xs text-zinc-400 hidden sm:inline">
          Showing <span className="text-white font-medium">{filteredQueue.length}</span> bills in queue
        </div>
      </div>

      {/* Grid of Bill Cards (From Figma: w-80 p-3 bg-white/5 rounded-[10px] backdrop-blur-sm) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredQueue.map((item) => {
          const isHighlight = item.isHighlighted || item.waitMinutes >= 7;
          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className={`p-4 bg-white/5 rounded-[10px] backdrop-blur-sm transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 hover:bg-white/10 hover:scale-[1.01] ${
                isHighlight
                  ? 'border border-yellow-400/40 shadow-[0px_0px_12px_rgba(250,204,21,0.15)] ring-1 ring-yellow-400/20'
                  : 'border border-white/10 hover:border-white/20'
              }`}
            >
              {/* Header Row: Table, Order # & Wait Tag */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-white text-base font-medium font-['Inter'] leading-6">
                    {item.tableName}
                  </div>
                  <div className="text-stone-300 text-xs font-normal font-['Inter'] leading-4">
                    {item.orderNumber}
                  </div>
                </div>

                {/* Wait Minutes Pill (From Figma: bg-yellow-200/10 text-white) */}
                <div className="px-2 py-0.5 bg-yellow-200/10 rounded-sm border border-yellow-400/30 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-yellow-400" />
                  <span className="text-white text-xs font-normal font-['Inter'] leading-4">
                    {item.waitMinutes}m Wait
                  </span>
                </div>
              </div>

              {/* Middle Row: Customer & Items */}
              <div className="space-y-1.5 pt-1 border-t border-neutral-700/60">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-yellow-400 border border-yellow-400/30">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium font-['Inter']">
                      {item.customerName}
                    </div>
                    <div className="text-stone-300 text-xs font-normal font-['Inter']">
                      {item.itemsCount} items Ordered
                    </div>
                  </div>
                </div>

                {item.itemsDescription && (
                  <div className="text-zinc-400 text-xs line-clamp-1 italic pt-0.5">
                    {item.itemsDescription}
                  </div>
                )}
              </div>

              {/* Bottom Row: Amount Due (From Figma: text-yellow-400 text-base) */}
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-yellow-400 text-sm sm:text-base font-medium font-['Inter']">
                  Amount Due
                </span>
                <span className="text-yellow-400 text-base sm:text-lg font-semibold font-['Inter'] font-mono">
                  ${item.amountDue.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Settlement Modal */}
      {isPaymentModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl p-6 shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="text-lg font-bold">Process Settlement</h3>
                <div className="text-xs text-zinc-400">
                  {selectedItem.tableName} · {selectedItem.orderNumber} ({selectedItem.customerName})
                </div>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="bg-black/50 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
              <span className="text-sm text-zinc-300">Total Balance</span>
              <span className="text-2xl font-bold font-mono text-yellow-400">
                ${selectedItem.amountDue.toFixed(2)}
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  disabled={paymentProcessing}
                  onClick={() => handleConfirmSettle('Credit Card')}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium flex flex-col items-center gap-1.5 transition-colors"
                >
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Card POS</span>
                </button>
                <button
                  disabled={paymentProcessing}
                  onClick={() => handleConfirmSettle('Cash')}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium flex flex-col items-center gap-1.5 transition-colors"
                >
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Cash Tender</span>
                </button>
                <button
                  disabled={paymentProcessing}
                  onClick={() => handleConfirmSettle('Guest QR Pay')}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium flex flex-col items-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-4 h-4 text-indigo-400" />
                  <span>QR Pay</span>
                </button>
              </div>
            </div>

            <button
              disabled={paymentProcessing}
              onClick={() => handleConfirmSettle('Instant Pay')}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              {paymentProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Authorizing Transaction...</span>
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4 text-black" />
                  <span>Complete Settlement &amp; Print Bill</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
