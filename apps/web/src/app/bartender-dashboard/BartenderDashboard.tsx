'use client';

import React, { useState, useEffect } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import Sidebar, { bartenderNavItems } from './Sidebar';
import {
  BartenderHeader,
  WelcomeBartenderHeader,
  AIBeverageSummarySection,
  BartenderStatCardsSection,
  BartenderQuickActions,
  ActiveDrinkOrdersSection,
  BarStationStatusSection,
  AIBeverageInsightsSection,
  BeverageInventorySection,
  LiveBarAlertsSection,
  TodayBarPerformanceSection,
  AskBartenderAIModal,
} from './dashboard';
import BeverageQueueView from './beverage-queue/BeverageQueueView';
import DrinkOrdersView from './drink-orders/DrinkOrdersView';
import BarStationsView from './bar-stations/BarStationsView';
import DrinkMenuView from './drink-menu/DrinkMenuView';
import InventoryView from './inventory/InventoryView';
import AIInsightsView from './ai-insights/AIInsightsView';
import ShiftReportView from './shift-report/ShiftReportView';
import SettingsView from './settings/SettingsView';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export interface BartenderDashboardProps {
  initialNav?: string;
}

const getInitialNav = (initialNav: string): string => {
  if (initialNav && initialNav !== 'Dashboard') {
    if (initialNav.toLowerCase() === 'settings') return 'Settings';
    const found = bartenderNavItems.find(
      (item) =>
        item.name.toLowerCase().replace(/\s+/g, '-') === initialNav.toLowerCase() ||
        item.name.toLowerCase() === initialNav.toLowerCase()
    );
    if (found) return found.name;
    return initialNav;
  }

  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      if (tabParam.toLowerCase() === 'settings') return 'Settings';
      const found = bartenderNavItems.find(
        (item) => item.name.toLowerCase().replace(/\s+/g, '-') === tabParam.toLowerCase()
      );
      if (found) return found.name;
    }
  }
  return initialNav || 'Dashboard';
};

export default function BartenderDashboard({ initialNav = 'Dashboard' }: BartenderDashboardProps) {
  const [activeNav, setActiveNav] = useState<string>(() => getInitialNav(initialNav));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Sync active tab from browser back/forward buttons
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handlePopState = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam) {
          if (tabParam.toLowerCase() === 'settings') {
            setActiveNav('Settings');
            return;
          }
          const found = bartenderNavItems.find(
            (item) => item.name.toLowerCase().replace(/\s+/g, '-') === tabParam.toLowerCase()
          );
          if (found) {
            setActiveNav(found.name);
            return;
          }
        }
        setActiveNav('Dashboard');
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

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

  return (
    <AuthGuard
      allowedRoles={[
        'BARTENDER',
        'BRANCH_MANAGER',
        'REGIONAL_MANAGER',
        'RESTAURANT_OWNER',
        'SUPER_ADMIN',
        'ADMIN',
      ]}
    >
      <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
        {/* 1. Fixed Left Sidebar */}
        <Sidebar
        activeNav={activeNav}
        setActiveNav={handleSetActiveNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-black">
        {/* Top Header */}
        <BartenderHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onOpenAIModal={() => setIsAIModalOpen(true)}
        />

        {/* Scrollable Main Area */}
        <main className="bartender-dashboard-main flex-1 overflow-y-auto px-3 sm:px-8 py-4 sm:py-6 space-y-6 custom-scrollbar">
          {activeNav === 'Beverage Queue' ? (
            <BeverageQueueView />
          ) : activeNav === 'Drink Orders' ? (
            <DrinkOrdersView />
          ) : activeNav === 'Bar Stations' ? (
            <BarStationsView />
          ) : activeNav === 'Drink Menu' ? (
            <DrinkMenuView />
          ) : activeNav === 'Inventory' ? (
            <InventoryView />
          ) : activeNav === 'AI Insights' ? (
            <AIInsightsView />
          ) : activeNav === 'Shift Report' ? (
            <ShiftReportView />
          ) : activeNav === 'Settings' ? (
            <SettingsView />
          ) : (
            <>
              {/* Welcome Banner */}
              <WelcomeBartenderHeader />

              {/* AI Bar Summary & Capacity */}
              <AIBeverageSummarySection
                onOpenAIModal={() => setIsAIModalOpen(true)}
                onOpenReportModal={() => {
                  toast.info('Opening AI Mixology Report');
                }}
              />

              {/* 6 Stat Cards */}
              <BartenderStatCardsSection />

              {/* Quick Actions Grid */}
              <BartenderQuickActions
                onActionClick={(act) => {
                  toast.success(`Action initiated: ${act}`);
                }}
              />

              {/* Active Orders & Bar Stations */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7">
                  <ActiveDrinkOrdersSection searchQuery={searchQuery} />
                </div>
                <div className="lg:col-span-5">
                  <BarStationStatusSection />
                </div>
              </div>

              {/* AI Insights & Beverage Inventory */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-6">
                  <AIBeverageInsightsSection onOpenAIModal={() => setIsAIModalOpen(true)} />
                </div>
                <div className="lg:col-span-6">
                  <BeverageInventorySection
                    onOpenInventory={() => {
                      toast.info('Viewing Bar Inventory details');
                    }}
                  />
                </div>
              </div>

              {/* Live Bar Alerts & Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-16">
                <div className="lg:col-span-5">
                  <LiveBarAlertsSection />
                </div>
                <div className="lg:col-span-7">
                  <TodayBarPerformanceSection />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Floating "Ask Tavonza AI" Button */}
      <button
        type="button"
        onClick={() => setIsAIModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-11 px-4 bg-yellow-500 hover:bg-yellow-400 text-white rounded-xl shadow-[0px_4px_12px_rgba(255,185,0,0.50)] outline outline-1 outline-offset-[-1px] outline-white flex items-center gap-2 font-bold text-sm tracking-tight transition-transform transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-white" />
        <span>Ask Tavonza AI</span>
      </button>

      {/* Interactive AI Chat Modal */}
      <AskBartenderAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
    </div>
    </AuthGuard>
  );
}
