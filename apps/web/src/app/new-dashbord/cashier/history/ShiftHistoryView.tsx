'use client';

import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Receipt,
  Printer,
  Sparkles,
  Bot,
  Filter,
  Download,
  Calendar,
  CreditCard,
  DollarSign,
  ArrowUpDown,
  FileText,
} from 'lucide-react';
import { ShiftHistoryItem } from '../types';
import { initialShiftHistory } from '../data';

interface ShiftHistoryViewProps {
  onShowToast?: (msg: string) => void;
  onOpenAIModal?: () => void;
}

export default function ShiftHistoryView({
  onShowToast,
  onOpenAIModal,
}: ShiftHistoryViewProps) {
  const [history] = useState<ShiftHistoryItem[]>(initialShiftHistory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItemForReceipt, setSelectedItemForReceipt] =
    useState<ShiftHistoryItem | null>(null);

  const filteredHistory = history.filter(
    (item) =>
      item.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalShiftSales = history.reduce((acc, curr) => acc + curr.amount, 0);

  const handlePrintReceipt = (item: ShiftHistoryItem) => {
    onShowToast?.(`Printing duplicate receipt for ${item.orderNumber} (${item.tableName}).`);
  };

  return (
    <div className="space-y-6 relative animate-in fade-in duration-300">
      {/* Top Header Bar (From Figma) */}
      <div className="w-full bg-black shadow-[0px_0px_4px_0px_rgba(212,212,212,0.25)] border border-zinc-800/80 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-semibold font-['Inter'] leading-8">
            Shift History
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base font-normal font-['Inter'] leading-5 mt-0.5">
            Review previous shifts, hours worked, and activity details.
          </p>
        </div>

        {/* Shift Summary Metrics */}
        <div className="flex items-center gap-4 bg-zinc-900/90 px-4 py-2 rounded-lg border border-zinc-800">
          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-medium">Shift Total</div>
            <div className="text-lg font-bold text-amber-400 font-mono">
              ${totalShiftSales.toFixed(2)}
            </div>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-medium">Bills Closed</div>
            <div className="text-lg font-bold text-white font-mono">{history.length}</div>
          </div>
        </div>
      </div>

      {/* Search Input Bar (From Figma: w-[1104px] h-10 px-4 bg-zinc-900) */}
      <div className="w-full h-11 px-4 bg-zinc-900 rounded-[5px] border border-neutral-800 flex items-center gap-3.5">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Bill or Tables ..."
          className="w-full bg-transparent text-white text-sm sm:text-base placeholder-zinc-600 focus:outline-none"
        />
      </div>

      {/* History Rows List (From Figma: bg-white/10 rounded-[10px] outline-white/10 backdrop-blur-[9.60px]) */}
      <div className="space-y-3">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="w-full px-5 sm:px-7 py-4 bg-white/10 rounded-[10px] border border-white/10 backdrop-blur-[9.60px] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-white/15"
          >
            {/* Left Column: Icon + Table Info + Items Summary */}
            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
              {/* Status Circle (From Figma: bg-green-500/5 rounded-[40px] outline-yellow-400) */}
              <div className="w-8 h-8 rounded-full bg-green-500/10 border border-yellow-400/80 flex items-center justify-center shrink-0 text-yellow-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-white text-base font-bold font-['Inter'] leading-6">
                    {item.tableName}
                  </span>
                  <span className="text-neutral-400 text-sm font-normal font-['Inter'] font-mono">
                    {item.orderNumber}
                  </span>

                  {/* Payment Method Pill (From Figma: bg-yellow-400/25) */}
                  <div className="px-2.5 py-0.5 bg-yellow-400/25 rounded-sm border border-yellow-400/30">
                    <span className="text-white text-xs font-normal font-['Inter']">
                      {item.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="text-stone-300 text-xs sm:text-sm font-normal font-['DM_Sans'] truncate">
                  {item.itemsSummary}
                </div>
              </div>
            </div>

            {/* Right Column: Time + Amount + View Receipt (From Figma) */}
            <div className="flex md:flex-col items-center md:items-end justify-between shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
              <div className="text-neutral-400 text-xs sm:text-sm font-normal font-['Inter']">
                {item.timestamp}
              </div>
              <div className="text-white text-xl font-semibold font-['Inter'] font-mono">
                ${item.amount.toFixed(2)}
              </div>
              <button
                onClick={() => setSelectedItemForReceipt(item)}
                className="text-yellow-400 text-xs sm:text-sm font-normal font-['DM_Sans'] underline cursor-pointer hover:text-yellow-300 transition-colors"
              >
                View Receipt
              </button>
            </div>
          </div>
        ))}

        {filteredHistory.length === 0 && (
          <div className="text-center py-12 text-zinc-500 text-xs bg-zinc-950 rounded-xl border border-zinc-800">
            No shift transactions match your search.
          </div>
        )}
      </div>

      {/* Floating Ask AI Button (From Figma: w-28 h-11 bg-amber-500/80 rounded-full shadow-[0px_8px_24px_rgba(0,0,0,0.25)]) */}
      <button
        onClick={onOpenAIModal}
        className="fixed bottom-8 right-8 z-40 px-5 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 rounded-full shadow-[0px_8px_24px_0px_rgba(0,0,0,0.35)] flex items-center gap-2 cursor-pointer transition-all border border-amber-400/40 group"
      >
        <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
        <span className="text-neutral-950 text-sm font-semibold font-['DM_Sans']">
          Ask AI
        </span>
      </button>

      {/* Itemized Receipt Modal */}
      {selectedItemForReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-2xl p-6 shadow-2xl space-y-4 text-white font-mono">
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-neutral-700">
              <div className="text-sm font-bold tracking-widest text-amber-400 font-['Inter']">
                TAVONZA HOSPITALITY
              </div>
              <div className="text-[10px] text-zinc-400">Downtown Branch · Register #01</div>
              <div className="text-[11px] text-zinc-300">
                {selectedItemForReceipt.tableName} · {selectedItemForReceipt.orderNumber}
              </div>
              <div className="text-[10px] text-zinc-500">
                Settled: {selectedItemForReceipt.timestamp}
              </div>
            </div>

            <div className="space-y-2 py-2 text-xs">
              <div className="flex justify-between font-medium">
                <span>Items</span>
                <span>Sub</span>
              </div>
              <div className="text-zinc-400 text-[11px] leading-relaxed">
                {selectedItemForReceipt.itemsSummary}
              </div>
              <div className="w-full h-px border-t border-dashed border-neutral-700 my-2" />
              <div className="flex justify-between text-xs font-bold text-white">
                <span>TOTAL PAID</span>
                <span className="text-amber-400">
                  ${selectedItemForReceipt.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Payment Method</span>
                <span>{selectedItemForReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Status</span>
                <span className="text-emerald-400 uppercase">Settled Approved</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  handlePrintReceipt(selectedItemForReceipt);
                  setSelectedItemForReceipt(null);
                }}
                className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Copy</span>
              </button>
              <button
                onClick={() => setSelectedItemForReceipt(null)}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
