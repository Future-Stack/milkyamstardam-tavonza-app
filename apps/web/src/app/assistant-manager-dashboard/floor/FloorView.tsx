'use client';

import React from 'react';
import {
  FloorKPICards,
  QuickActionBar,
  ZoneAndStatusFilters,
  FloorTableGrid,
  ShiftNoteBanner,
} from '../dashboard';
import { FloorTable, DiningZone, StatusFilter, ShiftNoteData } from '../types';

export interface FloorViewProps {
  tables: FloorTable[];
  activeZone: DiningZone;
  setActiveZone: (zone: DiningZone) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeStatus: StatusFilter;
  setActiveStatus: (status: StatusFilter) => void;
  shiftNote: ShiftNoteData;
  onOpenAlertsSnapshot: () => void;
  onOpenStaffView: () => void;
  onManageStock: () => void;
  onReviewHandoff: () => void;
  onSendShiftNote: () => void;
  onPostNote: () => void;
  onViewDetails: (table: FloorTable) => void;
  onMarkReady: (tableId: string) => void;
  onResetFilters: () => void;
}

export function FloorView({
  tables,
  activeZone,
  setActiveZone,
  searchQuery,
  setSearchQuery,
  activeStatus,
  setActiveStatus,
  shiftNote,
  onOpenAlertsSnapshot,
  onOpenStaffView,
  onManageStock,
  onReviewHandoff,
  onSendShiftNote,
  onPostNote,
  onViewDetails,
  onMarkReady,
  onResetFilters,
}: FloorViewProps) {
  return (
    <div className="w-full space-y-6">
      {/* 4 Summary KPI Cards */}
      <FloorKPICards
        onOpenAlertsSnapshot={onOpenAlertsSnapshot}
        onOpenStaffView={onOpenStaffView}
      />

      {/* 4 Quick Action Cards */}
      <QuickActionBar
        onManageStock={onManageStock}
        onReviewHandoff={onReviewHandoff}
        onSendShiftNote={onSendShiftNote}
      />

      {/* Zone Segmented Tabs, Search Bar, & Status Filter Pills */}
      <ZoneAndStatusFilters
        activeZone={activeZone}
        setActiveZone={setActiveZone}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
      />

      {/* Table Status Cards Grid */}
      <FloorTableGrid
        tables={tables}
        onViewDetails={onViewDetails}
        onMarkReady={onMarkReady}
        onResetFilters={onResetFilters}
      />

      {/* Shift Note Banner at bottom */}
      <ShiftNoteBanner
        shiftNote={shiftNote}
        onPostNote={onPostNote}
      />
    </div>
  );
}

export default FloorView;
