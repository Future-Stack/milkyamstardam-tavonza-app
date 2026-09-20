'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  InventoryItem,
  InventoryCategoryFilter,
  InventoryStockStatus,
  InventoryKPIsData,
} from '../types';
import {
  initialInventoryItems,
  initialInventoryKPIs,
} from '../data';
import {
  InventoryKPIs,
  InventoryAISuggestionBanner,
  InventoryFilterBar,
  InventoryTable,
  QuickRestockModal,
  AdjustStockModal,
} from './components';

export const ManagerInventoryView: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [kpis, setKpis] = useState<InventoryKPIsData>(initialInventoryKPIs);
  const [activeCategory, setActiveCategory] = useState<InventoryCategoryFilter>('All');
  const [selectedStockStatus, setSelectedStockStatus] = useState<InventoryStockStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);

  // Recalculate KPIs when items change
  const updateKPIs = (currentItems: InventoryItem[]) => {
    const critical = currentItems.filter((i) => i.stockStatus === 'Critical').length;
    const low = currentItems.filter((i) => i.stockStatus === 'Low').length;
    const healthy = currentItems.filter((i) => i.stockStatus === 'Healthy').length;

    setKpis({
      criticalCount: critical,
      criticalSubtitle: critical > 0 ? 'Immediate reorder needed' : 'All critical resolved',
      lowStockCount: low,
      lowSubtitle: 'Reorder this week',
      healthyCount: healthy,
      healthySubtitle: 'Within safe levels',
      totalCount: currentItems.length,
      totalSubtitle: 'Tracked categories',
    });
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category.toLowerCase() === activeCategory.toLowerCase();

      const matchesStatus =
        selectedStockStatus === 'All' || item.stockStatus === selectedStockStatus;

      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [items, activeCategory, selectedStockStatus, searchQuery]);

  // Handlers
  const handleToggleStatus = (item: InventoryItem) => {
    const newStatus = item.status === 'Available' ? 'Unavailable' : 'Available';
    const updated = items.map((i) =>
      i.id === item.id ? { ...i, status: newStatus as 'Available' | 'Unavailable' } : i
    );
    setItems(updated);
    toast.info(`${item.name} marked as ${newStatus}`);
  };

  const handleConfirmRestock = (itemId: string, addedQty: number, supplier: string) => {
    const target = items.find((i) => i.id === itemId);
    if (!target) return;

    const newStock = Number((target.currentStock + addedQty).toFixed(1));
    const newPct = Math.round((newStock / target.minLevelValue) * 100);

    let newStockStatus: InventoryStockStatus = 'Healthy';
    let progressColor = 'bg-emerald-500';
    let textColor = 'text-emerald-500';

    if (newPct < 30) {
      newStockStatus = 'Critical';
      progressColor = 'bg-red-500';
      textColor = 'text-red-500';
    } else if (newPct < 85) {
      newStockStatus = 'Low';
      progressColor = 'bg-orange-500';
      textColor = 'text-orange-500';
    }

    const updatedItems = items.map((i) =>
      i.id === itemId
        ? {
            ...i,
            currentStock: newStock,
            currentStockText: `${newStock} ${i.unit}`,
            stockPercentage: newPct,
            stockStatus: newStockStatus,
            progressColor,
            textColor,
            status: 'Available' as const,
            supplier: supplier || i.supplier,
          }
        : i
    );

    setItems(updatedItems);
    updateKPIs(updatedItems);
    toast.success(`Restocked +${addedQty} ${target.unit} of ${target.name} from ${supplier}`);
  };

  const handleConfirmAdjustment = (
    itemId: string,
    adjustmentType: 'add' | 'remove' | 'set',
    amount: number,
    reason: string
  ) => {
    const target = items.find((i) => i.id === itemId);
    if (!target) return;

    let newStock = target.currentStock;
    if (adjustmentType === 'add') newStock += amount;
    else if (adjustmentType === 'remove') newStock = Math.max(0, newStock - amount);
    else if (adjustmentType === 'set') newStock = Math.max(0, amount);

    newStock = Number(newStock.toFixed(1));
    const newPct = Math.round((newStock / target.minLevelValue) * 100);

    let newStockStatus: InventoryStockStatus = 'Healthy';
    let progressColor = 'bg-emerald-500';
    let textColor = 'text-emerald-500';

    if (newPct < 30) {
      newStockStatus = 'Critical';
      progressColor = 'bg-red-500';
      textColor = 'text-red-500';
    } else if (newPct < 85) {
      newStockStatus = 'Low';
      progressColor = 'bg-orange-500';
      textColor = 'text-orange-500';
    }

    const updatedItems = items.map((i) =>
      i.id === itemId
        ? {
            ...i,
            currentStock: newStock,
            currentStockText: `${newStock} ${i.unit}`,
            stockPercentage: newPct,
            stockStatus: newStockStatus,
            progressColor,
            textColor,
          }
        : i
    );

    setItems(updatedItems);
    updateKPIs(updatedItems);
    toast.success(`Adjusted ${target.name} stock to ${newStock} ${target.unit} (${reason})`);
  };

  const handleAutoRestockAI = () => {
    // Restock the items recommended by AI: Margherita Pizza (Dairy mozzarella) & Classic Cheeseburger (Pantry olive oil)
    const updatedItems = items.map((i) => {
      if (i.id === 'inv-1' || i.id === 'inv-4') {
        const added = i.id === 'inv-1' ? 8 : 10;
        const newStock = Number((i.currentStock + added).toFixed(1));
        return {
          ...i,
          currentStock: newStock,
          currentStockText: `${newStock} ${i.unit}`,
          stockPercentage: 100,
          stockStatus: 'Healthy' as const,
          progressColor: 'bg-emerald-500',
          textColor: 'text-emerald-500',
          status: 'Available' as const,
        };
      }
      return i;
    });

    setItems(updatedItems);
    updateKPIs(updatedItems);
    toast.success('AI Auto-Restock: Mozzarella cheese & Olive oil orders placed with Express priority!');
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Item,Category,Stock,Min Level,Status,Health,Supplier']
        .concat(
          items.map(
            (i) =>
              `"${i.name}","${i.category}","${i.currentStockText}","${i.minLevel}","${i.status}","${i.stockStatus}","${i.supplier || ''}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'inventory-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported inventory report to CSV');
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Header matching Figma */}
      <div>
        <h1 className="text-white text-3xl sm:text-4xl font-semibold font-['Inter'] leading-tight">
          Inventory Management
        </h1>
        <p className="text-slate-500 text-base sm:text-lg font-normal font-['Inter'] mt-1">
          Track stock levels and manage reorders
        </p>
      </div>

      {/* KPI Cards Row (4 cards matching Figma) */}
      <InventoryKPIs
        kpis={kpis}
        onFilterStatus={(status) => setSelectedStockStatus(status)}
      />

      {/* AI Suggestion Banner matching Figma */}
      <InventoryAISuggestionBanner onAutoRestock={handleAutoRestockAI} />

      {/* Filter Bar */}
      <InventoryFilterBar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        selectedStockStatus={selectedStockStatus}
        onSelectStockStatus={setSelectedStockStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExport={handleExportCSV}
        onOpenAddModal={() => setRestockItem(items[0])}
      />

      {/* Inventory Table matching Figma */}
      <InventoryTable
        items={filteredItems}
        onRestockItem={setRestockItem}
        onAdjustItem={setAdjustItem}
        onToggleStatus={handleToggleStatus}
      />

      {/* Quick Restock PO Modal */}
      <QuickRestockModal
        isOpen={Boolean(restockItem)}
        onClose={() => setRestockItem(null)}
        item={restockItem}
        onConfirmRestock={handleConfirmRestock}
      />

      {/* Adjust Stock / Waste Modal */}
      <AdjustStockModal
        isOpen={Boolean(adjustItem)}
        onClose={() => setAdjustItem(null)}
        item={adjustItem}
        onConfirmAdjustment={handleConfirmAdjustment}
      />
    </div>
  );
};

export const InventoryView = ManagerInventoryView;
export default InventoryView;
