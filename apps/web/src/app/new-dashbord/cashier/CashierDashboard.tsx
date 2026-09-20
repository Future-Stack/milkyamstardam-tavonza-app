'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Receipt,
  ShoppingBag,
  History,
  BellRing,
  User,
  LayoutGrid,
  Menu,
} from 'lucide-react';
import CashierSidebar from './Sidebar';
import BillQueueView from './queue/BillQueueView';
import NewOrderView from './order/NewOrderView';
import ShiftHistoryView from './history/ShiftHistoryView';
import CashierAlertsView from './alerts/CashierAlertsView';
import { initialBillQueue } from './data';
import { BillQueueItem } from './types';

export interface CashierDashboardProps {
  initialTab?: string;
}

export default function CashierDashboard({
  initialTab = 'queue',
}: CashierDashboardProps) {
  const [activeNav, setActiveNav] = useState<string>(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [billQueue, setBillQueue] = useState<BillQueueItem[]>(initialBillQueue);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSelectNav = (tabId: string) => {
    setActiveNav(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.pushState({}, '', url.toString());
    }
  };

  const handleAskAI = (promptText?: string) => {
    const query = promptText || aiPrompt;
    if (!query.trim()) return;
    setAiResponse('Analyzing register transactions & sales metrics with Tavonza AI...');
    setTimeout(() => {
      setAiResponse(
        `Analysis complete for Register #01: 5 orders settled today totaling $408.01. Table 12 has an active pending bill ($104.52) waiting 4 minutes. Recommendation: Prioritize Table 12 card tap handoff.`
      );
    }, 600);
  };

  return (
    <div className="min-h-screen bg-black text-white relative font-['Inter'] flex flex-col">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-amber-400/50 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium font-['DM_Sans']">{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar (w-72) */}
      <CashierSidebar
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Container beside Sidebar */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <div className="lg:hidden h-16 px-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm tracking-wide">Tavonza Cashier</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] w-full mx-auto">
          {/* Multi-View Tab Switcher */}
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleSelectNav('queue')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeNav === 'queue'
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Bill Queue</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeNav === 'queue'
                    ? 'bg-black text-amber-400'
                    : 'bg-stone-900 text-amber-400 border border-amber-400/20'
                }`}
              >
                0{billQueue.length}
              </span>
            </button>

            <button
              onClick={() => handleSelectNav('new-order')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeNav === 'new-order'
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Create Walk-In Order</span>
            </button>

            <button
              onClick={() => handleSelectNav('history')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeNav === 'history'
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Shift History</span>
            </button>

            <button
              onClick={() => handleSelectNav('alerts')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeNav === 'alerts'
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <BellRing className="w-4 h-4" />
              <span>Notifications &amp; Alerts</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeNav === 'alerts'
                    ? 'bg-black text-amber-400'
                    : 'bg-stone-900 text-amber-400 border border-amber-400/20'
                }`}
              >
                03
              </span>
            </button>
          </div>

          {/* Views Routing */}
          {activeNav === 'queue' ? (
            <BillQueueView
              queue={billQueue}
              onNewOrderClick={() => handleSelectNav('new-order')}
              onShowToast={showToast}
            />
          ) : activeNav === 'new-order' ? (
            <NewOrderView
              onShowToast={showToast}
              onOrderCompleted={(ordId, amt) => {
                showToast(`New order #${ordId} ($${amt.toFixed(2)}) processed!`);
                handleSelectNav('queue');
              }}
            />
          ) : activeNav === 'history' ? (
            <ShiftHistoryView
              onShowToast={showToast}
              onOpenAIModal={() => setIsAIModalOpen(true)}
            />
          ) : activeNav === 'alerts' ? (
            <CashierAlertsView
              onShowToast={showToast}
              onNavigateToQueue={() => handleSelectNav('queue')}
              onOpenAIModal={() => setIsAIModalOpen(true)}
            />
          ) : (
            /* Profile View Fallback */
            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-black font-bold flex items-center justify-center text-lg">
                  JD
                </div>
                <div>
                  <h2 className="text-lg font-bold">John Doe</h2>
                  <div className="text-xs text-zinc-400">Cashier &amp; Register Supervisor · Shift Active</div>
                </div>
              </div>
              <div className="text-xs text-zinc-400">
                Logged into POS Terminal #01 (Downtown Branch). Connected to live KDS, BDS, and Thermal Receipt Station.
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Ask AI Modal */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-2xl p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold">Tavonza AI Cashier Assistant</h3>
              </div>
              <button
                onClick={() => {
                  setIsAIModalOpen(false);
                  setAiResponse(null);
                }}
                className="text-zinc-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-zinc-300">
                Ask about current shift totals, void policies, tax breakdowns, or high-wait tables:
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Summarize current shift balance and pending bills..."
                  className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => handleAskAI()}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Analyze
                </button>
              </div>

              {aiResponse && (
                <div className="p-4 bg-black/60 rounded-xl border border-neutral-800 text-xs text-zinc-200 leading-relaxed">
                  {aiResponse}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
