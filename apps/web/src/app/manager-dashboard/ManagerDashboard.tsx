'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Receipt,
  AlertCircle,
} from 'lucide-react';
import {
  Sidebar,
  ManagerHeader,
  ManagerGreeting,
  OperationsSummaryBanner,
  LiveOperationsKPIs,
  QuickActionsBar,
  LiveOrderCenterCard,
  SmartAlertsCard,
  RestaurantFloorCard,
  KitchenOperationsCard,
  OperationsHealthCard,
  AskAIModal,
  ManagerPOSView,
  ManagerQROrderingView,
  ManagerTablesView,
  ManagerMenuView,
  ManagerInventoryView,
  ManagerStaffView,
  LiveOrdersView,
  CustomersView,
  ReportsView,
  AIInsightsView,
  NotificationsView,
  SettingsView,
  KitchenDisplayView,
  BarDisplayView,
} from './dashboard';
import {
  initialManagerProfile,
  initialOperationsSummary,
  initialKPICards,
  quickActionList,
  initialLiveOrders,
  initialSmartAlerts,
  initialFloorStatus,
  initialKitchenOps,
  initialHealthMetrics,
} from './data';
import { LiveOrder, SmartAlert } from './types';

interface ManagerDashboardProps {
  initialTab?: string;
}

export default function ManagerDashboard({ initialTab = 'Dashboard' }: ManagerDashboardProps) {
  const [profile] = useState(initialManagerProfile);
  const [summary] = useState(initialOperationsSummary);
  const [kpiCards] = useState(initialKPICards);
  const [quickActions] = useState(quickActionList);
  const [liveOrders] = useState(initialLiveOrders);
  const [smartAlerts] = useState(initialSmartAlerts);
  const [floorStatus] = useState(initialFloorStatus);
  const [kitchenOps] = useState(initialKitchenOps);
  const [healthMetrics] = useState(initialHealthMetrics);

  // Navigation & Search State
  const normalizeTab = (t: string) => {
    const lower = t.toLowerCase();
    if (lower === 'live-orders' || lower === 'live orders') return 'Live Orders';
    if (lower === 'pos' || lower === 'point-of-sale' || lower === 'point of sale') return 'POS';
    if (lower === 'qr-ordering' || lower === 'qr ordering' || lower === 'qr') return 'QR Ordering';
    if (lower === 'tables' || lower === 'table') return 'Tables';
    if (lower === 'menu') return 'Menu';
    if (lower === 'kitchen-display' || lower === 'kitchen display' || lower === 'kitchen' || lower === 'kds') return 'Kitchen Display';
    if (lower === 'bar-display' || lower === 'bar display' || lower === 'bar') return 'Bar Display';
    if (lower === 'inventory' || lower === 'stock') return 'Inventory';
    if (lower === 'staff' || lower === 'team') return 'Staff';
    if (lower === 'customers' || lower === 'customer') return 'Customers';
    if (lower === 'reports' || lower === 'report' || lower === 'analytics') return 'Reports';
    if (lower === 'ai-insights' || lower === 'ai insights' || lower === 'insights' || lower === 'ai') return 'AI Insights';
    if (lower === 'notifications' || lower === 'notification' || lower === 'alerts') return 'Notifications';
    if (lower === 'settings') return 'Settings';
    return t;
  };

  const [activeNav, setActiveNav] = useState(normalizeTab(initialTab));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize browser URL parameter with activeNav
  const handleSetActiveNav = (nav: string) => {
    setActiveNav(nav);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (nav === 'Dashboard') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', nav.toLowerCase().replace(/\s+/g, '-'));
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handlePopState = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam) {
          setActiveNav(normalizeTab(tabParam));
        } else {
          setActiveNav('Dashboard');
        }
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  // Modals & Triggers
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<LiveOrder | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<SmartAlert | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenAI = (prompt = '') => {
    setAiInitialPrompt(prompt);
    setIsAIModalOpen(true);
  };

  const handleRecommendationClick = (rec: string) => {
    handleOpenAI(`Execute recommendation: "${rec}". What is the step-by-step action plan?`);
  };

  const handleQuickAction = (id: string) => {
    const action = quickActions.find((a) => a.id === id);
    if (!action) return;

    if (action.id === 'qa-1') {
      handleSetActiveNav('Live Orders');
      return;
    }

    if (action.id === 'qa-2') {
      handleSetActiveNav('Tables');
      return;
    }

    if (action.id === 'qa-3') {
      handleSetActiveNav('Menu');
      return;
    }

    if (action.id === 'qa-4' || action.label.toLowerCase() === 'kitchen') {
      handleSetActiveNav('Kitchen Display');
      return;
    }

    if (action.id === 'qa-5') {
      handleSetActiveNav('Staff');
      return;
    }

    if (action.id === 'qa-6') {
      handleSetActiveNav('Customers');
      return;
    }

    if (action.id === 'qa-7') {
      handleSetActiveNav('Reports');
      return;
    }

    if (action.id === 'qa-8') {
      handleSetActiveNav('AI Insights');
      return;
    }

    showToast(`Triggered: ${action.label} action modal`);
  };

  // Check if any root modal is open
  const isAnyModalOpen = isAIModalOpen || Boolean(selectedOrder) || Boolean(selectedAlert);

  return (
    <div className="flex h-screen bg-black text-white font-['Inter'] overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* 1. Left Sidebar (Desktop 288px / Mobile Drawer) */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={handleSetActiveNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-black font-['Inter'] relative">
        {/* Top Header */}
        <ManagerHeader
          profile={profile}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notificationCount={4}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenAIModal={() => handleOpenAI()}
          onSearch={(query: string) => {
            if (query.toLowerCase().includes('ai')) {
              handleOpenAI(query);
            } else {
              showToast(`Searching for: "${query}"`);
            }
          }}
          onOpenNotifications={() => {
            handleSetActiveNav('Notifications');
          }}
          onOpenProfile={() => {
            handleSetActiveNav('Settings');
          }}
        />

        {/* Scrollable View Area */}
        <main
          className={`manager-dashboard-main flex-1 overflow-y-auto custom-scrollbar px-3 sm:px-8 py-4 sm:py-6 space-y-6 w-full pb-16 font-['Inter'] transition-all duration-200 ${
            isAnyModalOpen ? 'blur-[2px]' : ''
          }`}
        >
          {activeNav === 'Live Orders' ? (
            <LiveOrdersView />
          ) : activeNav === 'POS' ? (
            <ManagerPOSView />
          ) : activeNav === 'QR Ordering' ? (
            <ManagerQROrderingView />
          ) : activeNav === 'Tables' ? (
            <ManagerTablesView />
          ) : activeNav === 'Menu' ? (
            <ManagerMenuView />
          ) : activeNav === 'Kitchen Display' ? (
            <KitchenDisplayView />
          ) : activeNav === 'Bar Display' ? (
            <BarDisplayView />
          ) : activeNav === 'Inventory' ? (
            <ManagerInventoryView />
          ) : activeNav === 'Staff' ? (
            <ManagerStaffView />
          ) : activeNav === 'Customers' ? (
            <CustomersView />
          ) : activeNav === 'Reports' ? (
            <ReportsView onAskAI={(prompt) => handleOpenAI(prompt)} />
          ) : activeNav === 'AI Insights' ? (
            <AIInsightsView onAskAI={(prompt) => handleOpenAI(prompt)} />
          ) : activeNav === 'Notifications' ? (
            <NotificationsView />
          ) : activeNav === 'Settings' ? (
            <SettingsView />
          ) : (
            <>
              {/* Top Greeting & Live Status Header */}
              <ManagerGreeting profile={profile} />

              {/* Section 1: AI Operations Summary Banner */}
              <section aria-label="AI Operations Summary">
                <OperationsSummaryBanner
                  summary={summary}
                  onAskAI={() => handleOpenAI()}
                  onViewReport={() =>
                    handleOpenAI('Generate full AI Executive Operations Report for Downtown Branch')
                  }
                  onApplyRecommendation={handleRecommendationClick}
                />
              </section>

              {/* Section 2: Live Operations Overview (Title + 6 KPI Cards) */}
              <section aria-label="Live Operations Overview" className="space-y-3">
                <div className="flex items-center justify-between">
                   
                  
                </div>
                <LiveOperationsKPIs cards={kpiCards} />
              </section>

              {/* Section 3: Quick Actions (Title + 8 Action Buttons) */}
              <section aria-label="Quick Actions" className="space-y-3">
                <h2 className="text-white text-lg font-semibold font-['Inter']">
                  Quick Actions
                </h2>
                <QuickActionsBar actions={quickActions} onActionClick={handleQuickAction} />
              </section>

              {/* Section 4: Middle Row (Live Order Center & Smart Alerts) */}
              <section
                aria-label="Orders and Alerts"
                className="grid grid-cols-1 xl:grid-cols-12 gap-6"
              >
                {/* Smart Alerts (left on figma coordinates left-[315px], or 5 cols) */}
                <div className="xl:col-span-5 flex">
                  <SmartAlertsCard
                    alerts={smartAlerts}
                    onViewAll={() => showToast('Opening all 12 operational alerts')}
                    onSelectAlert={(alert) => {
                      setSelectedAlert(alert);
                    }}
                  />
                </div>

                {/* Live Order Center (right on figma coordinates left-[773px], or 7 cols) */}
                <div className="xl:col-span-7 flex">
                  <LiveOrderCenterCard
                    orders={liveOrders}
                    onSelectOrder={(order) => {
                      setSelectedOrder(order);
                    }}
                    onViewLiveFeed={() => handleSetActiveNav('Live Orders')}
                  />
                </div>
              </section>

              {/* Section 5: Bottom Row (Restaurant Floor + Kitchen Operations + Operations Health) */}
              <section
                aria-label="Floor, Kitchen, and Health"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {/* Restaurant Floor */}
                <div className="flex">
                  <RestaurantFloorCard
                    floorItems={floorStatus}
                    onOpenLayout={() => {
                      showToast('Opening Floor Layout Manager');
                    }}
                  />
                </div>

                {/* Kitchen Operations */}
                <div className="flex">
                  <KitchenOperationsCard
                    summary={kitchenOps}
                    onOpenKDS={() => {
                      handleSetActiveNav('Kitchen Display');
                    }}
                  />
                </div>

                {/* Operations Health */}
                <div className="flex">
                  <OperationsHealthCard
                    score={summary.score}
                    ratingText="Excellent Performance"
                    metrics={healthMetrics}
                  />
                </div>
              </section>
            </>
          )}

          {/* Footer padding for floating button */}
          <div className="h-16" />
        </main>
      </div>

      {/* Floating Action Button: Ask Tavonza AI */}
      <button
        type="button"
        onClick={() => handleOpenAI()}
        className="fixed bottom-6 right-6 z-40 h-11 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-white rounded-[10px] shadow-[0px_4px_10px_rgba(245,158,11,0.4),0px_0px_20px_rgba(255,185,0,0.6)] outline outline-1 outline-white flex items-center gap-2 font-semibold text-base font-['Inter'] transition-all transform hover:scale-105 active:scale-95"
      >
        <Sparkles className="w-4 h-4 text-white" />
        <span>Ask Tavonza AI</span>
      </button>

      {/* Ask AI Copilot Modal */}
      <AskAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        initialPrompt={aiInitialPrompt}
      />

      {/* Order Details Quick Inspector Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 lg:left-72 top-20 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
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
                <span className="text-sm text-neutral-400 block">Subtotal</span>
                <span className="font-mono font-bold text-emerald-400 text-lg">
                  ${selectedOrder.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-zinc-950 rounded-xl text-sm space-y-1 text-neutral-300 border border-white/10">
              <div className="flex justify-between font-medium">
                <span>Items:</span>
                <span>2x Truffle Pasta, 1x San Pellegrino</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Kitchen Station:</span>
                <span>Pasta / Grill Station</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Elapsed time:</span>
                <span>11 minutes</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast(`Order ${selectedOrder.orderNumber} expedited to KDS priority.`);
                  setSelectedOrder(null);
                }}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl text-base transition-colors"
              >
                Expedite Order
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Printed guest ticket for Table ${selectedOrder.table}`);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-base border border-white/10 transition-colors"
              >
                Print Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 lg:left-72 top-20 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-black border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <h3 className="text-white font-bold font-['Inter'] text-lg">
                  Operational Alert Detail
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-zinc-950 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-sm text-neutral-400">
                <span className="font-mono uppercase">{selectedAlert.severity} PRIORITY</span>
                <span>{selectedAlert.timeAgo}</span>
              </div>
              <p className="text-white text-base font-medium leading-relaxed">
                {selectedAlert.message}
              </p>
            </div>

            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-sm text-amber-300/90 leading-relaxed">
              <strong>Tavonza AI Recommendation:</strong> Dispatch team lead or reassign workstation resources to stabilize operational throughput.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Alert resolved and marked in shift log.');
                  setSelectedAlert(null);
                }}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl text-base transition-colors"
              >
                Resolve Alert
              </button>
              <button
                type="button"
                onClick={() => {
                  handleOpenAI(`Resolve alert: "${selectedAlert.message}"`);
                  setSelectedAlert(null);
                }}
                className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium rounded-xl text-base border border-amber-500/30 transition-colors"
              >
                Ask AI Fix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-neutral-900/95 border border-amber-500/40 text-amber-300 rounded-xl shadow-2xl text-sm font-medium backdrop-blur-md flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
