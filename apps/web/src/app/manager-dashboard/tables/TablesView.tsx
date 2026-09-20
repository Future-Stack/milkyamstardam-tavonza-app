'use client';

import React, { useState, useMemo } from 'react';
import { RotateCw, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  FloorTable,
  TableFilterTab,
  AddTableFormData,
} from '../types';
import { initialTablesKPIStats, initialFloorTables } from '../data';
import {
  TablesKPIs,
  TableFilterBar,
  FloorTableCard,
  TableDetailsPanel,
  AddNewTableModal,
  AssignWaiterModal,
} from './components';

export const TablesView: React.FC = () => {
  const [tables, setTables] = useState<FloorTable[]>(initialFloorTables);
  const [selectedTableId, setSelectedTableId] = useState<string>(
    initialFloorTables[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<TableFilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignWaiterOpen, setIsAssignWaiterOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Selected Table
  const selectedTable = useMemo(() => {
    return tables.find((t) => t.id === selectedTableId) || tables[0] || null;
  }, [tables, selectedTableId]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: tables.length,
      occupied: tables.filter((t) => t.status === 'Occupied').length,
      available: tables.filter((t) => t.status === 'Available').length,
      reserved: tables.filter((t) => t.status === 'Reserved').length,
    };
  }, [tables]);

  // Dynamic KPI Stats based on current tables
  const stats = useMemo(() => {
    return {
      occupiedText: `${counts.occupied}/${tables.length}`,
      occupiedCount: counts.occupied,
      totalTables: tables.length,
      availableCount: counts.available,
      reservedCount: counts.reserved,
      activeRevenue: initialTablesKPIStats.activeRevenue,
    };
  }, [counts, tables.length]);

  // Filtered tables
  const filteredTables = useMemo(() => {
    return tables.filter((t) => {
      const matchesTab =
        activeTab === 'All' ||
        t.status.toLowerCase() === activeTab.toLowerCase();

      const matchesSearch =
        searchQuery.trim() === '' ||
        t.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.waiter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.section.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [tables, activeTab, searchQuery]);

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Live floor occupancy refreshed');
    }, 500);
  };

  const handleAddTable = (data: AddTableFormData) => {
    const newTable: FloorTable = {
      id: `tbl-${Date.now()}`,
      tableNumber: data.tableNumber,
      capacity: data.capacity,
      currentGuests: 0,
      status: 'Available',
      waiter: 'Unassigned',
      seatedTime: '-',
      section: data.section,
      location: data.location,
      shape: data.shape,
      notes: data.notes || undefined,
    };

    setTables((prev) => [newTable, ...prev]);
    setSelectedTableId(newTable.id);
    setIsAddModalOpen(false);
    toast.success(`Table ${data.tableNumber} added to floor plan!`);
  };

  const handleAssignWaiter = (tableId: string, waiterName: string) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, waiter: waiterName } : t))
    );
    toast.success(`Assigned ${waiterName} to ${selectedTable?.tableNumber}`);
  };

  const handleToggleStatus = (table: FloorTable) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === table.id) {
          if (t.status === 'Occupied') {
            return {
              ...t,
              status: 'Available',
              currentGuests: 0,
              seatedTime: '-',
            };
          }
          if (t.status === 'Available') {
            return {
              ...t,
              status: 'Occupied',
              currentGuests: t.capacity,
              seatedTime: 'Just now',
            };
          }
          return {
            ...t,
            status: 'Occupied',
            seatedTime: 'Just now',
          };
        }
        return t;
      })
    );
    toast.info(`Updated status for ${table.tableNumber}`);
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Top Header Section matching Figma */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-3xl sm:text-4xl font-semibold font-['Inter'] leading-tight">
            Tables
          </h1>
          <p className="text-slate-500 text-base sm:text-lg font-normal font-['Inter'] mt-1">
            Live floor plan - monitor occupancy and manage table assignments.
          </p>
        </div>

        {/* Action Buttons matching Figma: Refresh & Add Table */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRefresh}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[10.20px] flex items-center gap-1.5 text-white text-sm font-semibold font-['Inter'] transition-all cursor-pointer"
          >
            <RotateCw
              className={`w-3 h-3 text-slate-300 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-yellow-500 hover:bg-yellow-400 text-white text-sm font-semibold font-['Inter'] rounded-[10px] shadow-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-yellow-500/20 active:scale-[0.99]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Table</span>
          </button>
        </div>
      </div>

      {/* Row 1: KPI Stats Cards (Occupied, Available, Reserved, Active Revenue) */}
      <TablesKPIs stats={stats} />

      {/* Row 2: Filter Tabs Bar & Search Input */}
      <TableFilterBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        counts={counts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Row 3: Main Layout - Left Table Grid & Right Details Panel */}
      <div className="flex flex-col xl:flex-row items-start gap-6 w-full">
        {/* Left Column: Floor Tables Grid */}
        <div className="flex-1 w-full min-w-0">
          {filteredTables.length === 0 ? (
            <div className="w-full h-64 rounded-xl border border-white/10 bg-white/5 flex flex-col items-center justify-center p-6 text-center">
              <p className="text-white text-lg font-medium">No tables found</p>
              <p className="text-slate-400 text-sm mt-1">
                Try switching the occupancy filter or clear your search query.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {filteredTables.map((tbl) => (
                <FloorTableCard
                  key={tbl.id}
                  table={tbl}
                  isSelected={tbl.id === selectedTable?.id}
                  onSelect={(t) => setSelectedTableId(t.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Selected Table Details Panel */}
        <div className="w-full xl:w-80 xl:sticky xl:top-24">
          <TableDetailsPanel
            table={selectedTable}
            onAssignWaiter={() => setIsAssignWaiterOpen(true)}
            onEditTable={() => {
              toast.info(`Editing configuration for ${selectedTable?.tableNumber}`);
            }}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </div>

      {/* Add New Table Modal (Screenshot 2) */}
      <AddNewTableModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTable={handleAddTable}
      />

      {/* Assign Waiter Modal */}
      <AssignWaiterModal
        isOpen={isAssignWaiterOpen}
        onClose={() => setIsAssignWaiterOpen(false)}
        table={selectedTable}
        onAssign={handleAssignWaiter}
      />
    </div>
  );
};

export const ManagerTablesView = TablesView;
export default TablesView;
