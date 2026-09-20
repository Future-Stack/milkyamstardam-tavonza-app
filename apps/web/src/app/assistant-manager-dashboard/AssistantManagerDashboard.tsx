'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sidebar,
  assistantManagerNavItems,
  AssistantManagerHeader,
  FloorView,
  AlertsView,
  JarvisView,
  StaffView,
  ProfileView,
  SettingsView,
  StockManageModal,
  ShiftHandoffModal,
  PostShiftNoteModal,
  TableDetailModal,
  AlertsSnapshotModal,
} from './dashboard';
import { mockFloorTables, mockShiftNote } from './data';
import { FloorTable, DiningZone, StatusFilter, ShiftNoteData } from './types';
import { toast } from 'sonner';

export interface AssistantManagerDashboardProps {
  initialNav?: string;
}

const getInitialNav = (initialNav: string): string => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      const found = assistantManagerNavItems.find(
        (item) => item.name.toLowerCase() === tabParam.toLowerCase()
      );
      if (found) return found.name;
    }
    if (initialNav && initialNav !== 'Floor') {
      return initialNav;
    }
    const savedNav = localStorage.getItem('am_active_nav');
    if (savedNav && assistantManagerNavItems.some((item) => item.name === savedNav)) {
      return savedNav;
    }
  }
  return initialNav;
};

export default function AssistantManagerDashboard({
  initialNav = 'Floor',
}: AssistantManagerDashboardProps) {
  const [activeNav, setActiveNav] = useState<string>(() => getInitialNav(initialNav));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter States
  const [activeZone, setActiveZone] = useState<DiningZone>('All');
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Operational Data States
  const [tables, setTables] = useState<FloorTable[]>(mockFloorTables);
  const [shiftNote, setShiftNote] = useState<ShiftNoteData>(mockShiftNote);

  // Modals
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState(false);
  const [isShiftNoteModalOpen, setIsShiftNoteModalOpen] = useState(false);
  const [isAlertsSnapshotOpen, setIsAlertsSnapshotOpen] = useState(false);
  const [selectedTableForDetail, setSelectedTableForDetail] = useState<FloorTable | null>(null);

  // Sync tab with URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (!tabParam && activeNav) {
        const url = new URL(window.location.href);
        if (activeNav === 'Floor') {
          url.searchParams.delete('tab');
        } else {
          url.searchParams.set('tab', activeNav.toLowerCase());
        }
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [activeNav]);

  const handleSetActiveNav = (nav: string) => {
    setActiveNav(nav);
    if (typeof window !== 'undefined') {
      localStorage.setItem('am_active_nav', nav);
      const url = new URL(window.location.href);
      if (nav === 'Floor') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', nav.toLowerCase());
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Mark table ready handler
  const handleMarkReady = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          toast.success(`${t.tableNumber} in ${t.zone} marked clean & READY for seating.`);
          return {
            ...t,
            status: 'Ready',
            awaitingReset: false,
            course: undefined,
            currentGuests: 0,
          };
        }
        return t;
      })
    );
  };

  // Filtered tables logic
  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      // Zone match
      if (activeZone !== 'All' && table.zone !== activeZone) {
        return false;
      }

      // Status match
      if (activeStatus !== 'All') {
        if (activeStatus === 'Alerts') {
          if (table.status !== 'Attention' && !table.alertMessage) return false;
        } else if (table.status !== activeStatus) {
          return false;
        }
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTable = table.tableNumber.toLowerCase().includes(q);
        const matchesServer = table.serverName.toLowerCase().includes(q);
        const matchesZone = table.zone.toLowerCase().includes(q);
        const matchesCourse = table.course?.toLowerCase().includes(q) || false;
        const matchesAlert = table.alertMessage?.toLowerCase().includes(q) || false;
        const matchesItems =
          table.orderItems?.some((item) => item.name.toLowerCase().includes(q)) || false;

        if (
          !matchesTable &&
          !matchesServer &&
          !matchesZone &&
          !matchesCourse &&
          !matchesAlert &&
          !matchesItems
        ) {
          return false;
        }
      }

      return true;
    });
  }, [tables, activeZone, activeStatus, searchQuery]);

  const handleResetFilters = () => {
    setActiveZone('All');
    setActiveStatus('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Inter'] flex">
      {/* Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={handleSetActiveNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-black">
        {/* Top Header */}
        <AssistantManagerHeader
          onOpenMobileSidebar={() => setSidebarOpen(true)}
        />

        {/* Page Content Container */}
        <main className="assistant-manager-dashboard-main flex-1 overflow-y-auto custom-scrollbar px-3 sm:px-8 py-4 sm:py-6 space-y-6 w-full pb-16 font-['Inter']">
          {activeNav === 'Floor' && (
            <FloorView
              tables={filteredTables}
              activeZone={activeZone}
              setActiveZone={setActiveZone}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeStatus={activeStatus}
              setActiveStatus={setActiveStatus}
              shiftNote={shiftNote}
              onOpenAlertsSnapshot={() => setIsAlertsSnapshotOpen(true)}
              onOpenStaffView={() => handleSetActiveNav('Staff')}
              onManageStock={() => setIsStockModalOpen(true)}
              onReviewHandoff={() => setIsHandoffModalOpen(true)}
              onSendShiftNote={() => setIsShiftNoteModalOpen(true)}
              onPostNote={() => setIsShiftNoteModalOpen(true)}
              onViewDetails={(table) => setSelectedTableForDetail(table)}
              onMarkReady={handleMarkReady}
              onResetFilters={handleResetFilters}
            />
          )}

          {activeNav === 'Alerts' && <AlertsView />}

          {activeNav === 'Jarvis' && <JarvisView />}

          {activeNav === 'Staff' && <StaffView />}

          {activeNav === 'Profile' && <ProfileView />}

          {activeNav === 'Settings' && <SettingsView />}
        </main>
      </div>

      {/* Interactive Modals */}
      <StockManageModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
      />

      <ShiftHandoffModal
        isOpen={isHandoffModalOpen}
        onClose={() => setIsHandoffModalOpen(false)}
      />

      <PostShiftNoteModal
        isOpen={isShiftNoteModalOpen}
        onClose={() => setIsShiftNoteModalOpen(false)}
        currentNote={shiftNote}
        onSaveNote={(note) => setShiftNote(note)}
      />

      <TableDetailModal
        table={selectedTableForDetail}
        isOpen={Boolean(selectedTableForDetail)}
        onClose={() => setSelectedTableForDetail(null)}
        onMarkReady={handleMarkReady}
      />

      <AlertsSnapshotModal
        isOpen={isAlertsSnapshotOpen}
        onClose={() => setIsAlertsSnapshotOpen(false)}
      />
    </div>
  );
}
