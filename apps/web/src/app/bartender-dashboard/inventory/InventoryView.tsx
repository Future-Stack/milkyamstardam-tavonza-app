'use client';

import React, { useState, useMemo } from 'react';
import {
  Download,
  Plus,
  Search,
  Pencil,
  X,
  Package,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Boxes,
  TrendingDown,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';

export interface InventorySupplyItem {
  id: string;
  name: string;
  category: 'Garnish' | 'Produce' | 'Liquor' | 'Mixer' | 'Coffee' | 'Juice' | 'Beverage' | 'Syrup';
  currentStock: number;
  unit: string;
  minStock: number;
  maxStock: number;
  lastRestocked: string;
  status: 'In Stock' | 'Running Low' | 'Low Stock';
}

const initialSupplies: InventorySupplyItem[] = [
  {
    id: 'inv-1',
    name: 'Fresh Mint',
    category: 'Garnish',
    currentStock: 3,
    unit: 'bunches',
    minStock: 10,
    maxStock: 30,
    lastRestocked: 'Yesterday',
    status: 'Low Stock',
  },
  {
    id: 'inv-2',
    name: 'Tahitian Limes',
    category: 'Produce',
    currentStock: 8.5,
    unit: 'kg',
    minStock: 3,
    maxStock: 15,
    lastRestocked: 'Yesterday',
    status: 'In Stock',
  },
  {
    id: 'inv-3',
    name: 'White Rum Reserve',
    category: 'Liquor',
    currentStock: 4,
    unit: 'bottles',
    minStock: 5,
    maxStock: 20,
    lastRestocked: '2 days ago',
    status: 'Running Low',
  },
  {
    id: 'inv-4',
    name: 'Artisanal Mezcal',
    category: 'Liquor',
    currentStock: 2,
    unit: 'bottles',
    minStock: 4,
    maxStock: 12,
    lastRestocked: '3 days ago',
    status: 'Low Stock',
  },
  {
    id: 'inv-5',
    name: 'Angostura Bitters',
    category: 'Mixer',
    currentStock: 6,
    unit: 'bottles',
    minStock: 2,
    maxStock: 10,
    lastRestocked: 'Today',
    status: 'In Stock',
  },
  {
    id: 'inv-6',
    name: 'Espresso Beans Roast',
    category: 'Coffee',
    currentStock: 12,
    unit: 'kg',
    minStock: 4,
    maxStock: 25,
    lastRestocked: 'Yesterday',
    status: 'In Stock',
  },
  {
    id: 'inv-7',
    name: 'Cane Sugar Syrup',
    category: 'Syrup',
    currentStock: 5,
    unit: 'liters',
    minStock: 6,
    maxStock: 20,
    lastRestocked: 'Yesterday',
    status: 'Running Low',
  },
  {
    id: 'inv-8',
    name: 'Artisanal Tonic Cans',
    category: 'Beverage',
    currentStock: 48,
    unit: 'cans',
    minStock: 24,
    maxStock: 96,
    lastRestocked: '2 days ago',
    status: 'In Stock',
  },
  {
    id: 'inv-9',
    name: 'Pink Grapefruits',
    category: 'Produce',
    currentStock: 8,
    unit: 'pcs',
    minStock: 12,
    maxStock: 40,
    lastRestocked: 'Yesterday',
    status: 'Running Low',
  },
  {
    id: 'inv-10',
    name: 'Alphonso Mango Puree',
    category: 'Juice',
    currentStock: 8,
    unit: 'cartons',
    minStock: 4,
    maxStock: 20,
    lastRestocked: 'Today',
    status: 'In Stock',
  },
  {
    id: 'inv-11',
    name: 'Fresh Rosemary',
    category: 'Garnish',
    currentStock: 2,
    unit: 'bunches',
    minStock: 5,
    maxStock: 15,
    lastRestocked: 'Yesterday',
    status: 'Low Stock',
  },
  {
    id: 'inv-12',
    name: 'Bourbon Whiskey',
    category: 'Liquor',
    currentStock: 9,
    unit: 'bottles',
    minStock: 4,
    maxStock: 15,
    lastRestocked: 'Yesterday',
    status: 'In Stock',
  },
  {
    id: 'inv-13',
    name: 'Blue Curacao Liqueur',
    category: 'Liquor',
    currentStock: 3,
    unit: 'bottles',
    minStock: 4,
    maxStock: 10,
    lastRestocked: '4 days ago',
    status: 'Running Low',
  },
  {
    id: 'inv-14',
    name: 'Cranberry Juice Reserve',
    category: 'Juice',
    currentStock: 3,
    unit: 'cartons',
    minStock: 6,
    maxStock: 24,
    lastRestocked: '5 days ago',
    status: 'Low Stock',
  },
  {
    id: 'inv-15',
    name: 'Sparkling Mineral Water',
    category: 'Beverage',
    currentStock: 60,
    unit: 'bottles',
    minStock: 20,
    maxStock: 100,
    lastRestocked: 'Today',
    status: 'In Stock',
  },
];

export default function InventoryView() {
  const [supplies, setSupplies] = useState<InventorySupplyItem[]>(initialSupplies);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Modals state
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<InventorySupplyItem | null>(null);

  // Restock form state
  const [restockAmount, setRestockAmount] = useState<number>(10);
  const [restockNotes, setRestockNotes] = useState<string>('');

  // Add / Edit form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<InventorySupplyItem['category']>('Liquor');
  const [formStock, setFormStock] = useState<number>(10);
  const [formUnit, setFormUnit] = useState('bottles');
  const [formMin, setFormMin] = useState<number>(5);
  const [formMax, setFormMax] = useState<number>(20);

  // Dynamic statistics calculations
  const totalCount = supplies.length;
  const inStockCount = supplies.filter((s) => s.status === 'In Stock').length;
  const runningLowCount = supplies.filter((s) => s.status === 'Running Low').length;
  const lowStockCount = supplies.filter((s) => s.status === 'Low Stock').length;

  // Filter items
  const filteredItems = useMemo(() => {
    return supplies.filter((item) => {
      const matchCategory =
        selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [supplies, selectedCategory, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  // Adjust page if out of bounds after filtering
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Open Restock Modal
  const handleOpenRestock = (item: InventorySupplyItem) => {
    setActiveItem(item);
    setRestockAmount(Math.max(1, item.maxStock - item.currentStock));
    setRestockNotes('');
    setIsRestockModalOpen(true);
  };

  // Submit Restock
  const handleConfirmRestock = () => {
    if (!activeItem) return;

    setSupplies((prev) =>
      prev.map((item) => {
        if (item.id === activeItem.id) {
          const updatedStock = item.currentStock + restockAmount;
          let nextStatus: InventorySupplyItem['status'] = 'In Stock';
          if (updatedStock <= item.minStock) {
            nextStatus = 'Low Stock';
          } else if (updatedStock < item.minStock * 1.5) {
            nextStatus = 'Running Low';
          }

          return {
            ...item,
            currentStock: updatedStock,
            lastRestocked: 'Just now',
            status: nextStatus,
          };
        }
        return item;
      })
    );

    setIsRestockModalOpen(false);
    toast.success(`Restocked ${restockAmount} ${activeItem.unit} of ${activeItem.name}`);
  };

  // Open Add Item Modal
  const handleOpenAdd = () => {
    setActiveItem(null);
    setFormName('');
    setFormCategory('Liquor');
    setFormStock(10);
    setFormUnit('bottles');
    setFormMin(5);
    setFormMax(20);
    setIsAddModalOpen(true);
  };

  // Open Edit Item Modal
  const handleOpenEdit = (item: InventorySupplyItem) => {
    setActiveItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormStock(item.currentStock);
    setFormUnit(item.unit);
    setFormMin(item.minStock);
    setFormMax(item.maxStock);
    setIsAddModalOpen(true);
  };

  // Save Add / Edit
  const handleSaveSupply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Please enter supply item name');
      return;
    }

    let nextStatus: InventorySupplyItem['status'] = 'In Stock';
    if (formStock <= formMin) {
      nextStatus = 'Low Stock';
    } else if (formStock < formMin * 1.5) {
      nextStatus = 'Running Low';
    }

    if (activeItem) {
      setSupplies((prev) =>
        prev.map((item) =>
          item.id === activeItem.id
            ? {
                ...item,
                name: formName,
                category: formCategory,
                currentStock: formStock,
                unit: formUnit,
                minStock: formMin,
                maxStock: formMax,
                status: nextStatus,
              }
            : item
        )
      );
      toast.success(`Updated ${formName}`);
    } else {
      const newItem: InventorySupplyItem = {
        id: `inv-${Date.now()}`,
        name: formName,
        category: formCategory,
        currentStock: formStock,
        unit: formUnit,
        minStock: formMin,
        maxStock: formMax,
        lastRestocked: 'Just now',
        status: nextStatus,
      };
      setSupplies((prev) => [newItem, ...prev]);
      toast.success(`Added ${formName} to inventory`);
    }

    setIsAddModalOpen(false);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Item Name',
      'Category',
      'Stock Level',
      'Unit',
      'Min Stock',
      'Max Stock',
      'Last Restocked',
      'Status',
    ];
    const rows = filteredItems.map((item) => [
      item.id,
      `"${item.name.replace(/"/g, '""')}"`,
      item.category,
      item.currentStock,
      item.unit,
      item.minStock,
      item.maxStock,
      item.lastRestocked,
      item.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bar-inventory-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredItems.length} inventory records to CSV`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-4xl font-semibold font-['Inter'] leading-9 tracking-tight">
            Inventory
          </h1>
          <p className="text-zinc-500 text-lg font-normal font-['Inter'] leading-6 mt-1">
            Track stock levels and manage beverage supplies
          </p>
        </div>

        {/* Action Buttons: Export & Add Item */}
        <div className="flex items-center gap-2">
          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-200/20 flex items-center gap-1.5 text-white text-sm font-semibold font-['Inter'] leading-5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Export</span>
          </button>

          {/* Add Item Button */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-[10px] shadow-[0px_1px_2px_-1px_rgba(255,214,168,1.00)] shadow-[0px_1px_3px_0px_rgba(255,214,168,1.00)] flex items-center gap-1.5 text-white font-semibold text-sm font-['Inter'] leading-5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Items */}
        <div className="h-20 p-5 bg-white/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-[10.20px] flex flex-col justify-center">
          <div className="text-white text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-5">
            {totalCount < 10 ? `0${totalCount}` : totalCount}
          </div>
          <div className="text-zinc-500 text-sm font-medium font-['Inter'] leading-4 mt-1">
            Total Items
          </div>
        </div>

        {/* Card 2: In Stock */}
        <div className="h-20 p-5 bg-white/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-[10.20px] flex flex-col justify-center">
          <div className="text-green-500 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-5">
            {inStockCount < 10 ? `0${inStockCount}` : inStockCount}
          </div>
          <div className="text-zinc-500 text-sm font-medium font-['Inter'] leading-4 mt-1">
            In Stock
          </div>
        </div>

        {/* Card 3: Running Low */}
        <div className="h-20 p-5 bg-white/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-[10.20px] flex flex-col justify-center">
          <div className="text-blue-500 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-5">
            {runningLowCount < 10 ? `0${runningLowCount}` : runningLowCount}
          </div>
          <div className="text-zinc-500 text-sm font-medium font-['Inter'] leading-4 mt-1">
            Running Low
          </div>
        </div>

        {/* Card 4: Low Stock */}
        <div className="h-20 p-5 bg-white/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-[10.20px] flex flex-col justify-center">
          <div className="text-purple-500 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-5">
            {lowStockCount < 10 ? `0${lowStockCount}` : lowStockCount}
          </div>
          <div className="text-zinc-500 text-sm font-medium font-['Inter'] leading-4 mt-1">
            Low Stock
          </div>
        </div>
      </div>

      {/* 3. Stock Status Container */}
      <div className="bg-white/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-lg overflow-hidden flex flex-col">
        {/* Table Container Header */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5">
          <div className="flex items-center gap-4">
            <h2 className="text-white text-2xl font-bold font-['Inter'] leading-5">
              Stock Status
            </h2>

            {/* Category Quick Filter */}
            <div className="hidden lg:flex items-center gap-1 bg-zinc-900/60 p-1 rounded-lg border border-white/5 text-sm">
              {['All', 'Garnish', 'Produce', 'Liquor', 'Mixer', 'Coffee', 'Juice'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-white font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <div className="w-4 h-4 left-3 top-1/2 -translate-y-1/2 absolute overflow-hidden pointer-events-none">
              <Search className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Item..."
              className="w-full h-9 pl-9 pr-8 bg-zinc-900 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/10 text-white placeholder-neutral-500 text-base font-normal font-['Inter'] focus:outline-none focus:outline-amber-500/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Table View */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            {/* Table Column Headers */}
            <thead>
              <tr className="bg-zinc-900 h-16 border-b border-zinc-800">
                <th className="px-6 text-white text-lg font-semibold font-['Inter'] leading-5">Items</th>
                <th className="px-6 text-white text-lg font-semibold font-['Inter'] leading-5">Category</th>
                <th className="px-6 text-white text-lg font-semibold font-['Inter'] leading-5">Stock Level</th>
                <th className="px-6 text-white text-lg font-semibold font-['Inter'] leading-5">Min / Max</th>
                <th className="px-6 text-white text-lg font-semibold font-['Inter'] leading-5">Last Restocked</th>
                <th className="px-6 text-white text-lg font-semibold font-['Inter'] leading-5">Status</th>
                <th className="px-6 text-white text-lg font-semibold font-['Inter'] leading-5 text-right">Action</th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="divide-y divide-zinc-800/80">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-zinc-500 font-['Inter'] text-base">
                    <Package className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
                    No inventory items found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const stockRatio = Math.min(100, Math.round((item.currentStock / item.maxStock) * 100));

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-white/[0.03] transition-colors h-[58px]"
                    >
                      {/* 1. Items */}
                      <td className="px-6 text-white text-lg font-medium font-['Inter'] leading-5 whitespace-nowrap">
                        {item.name}
                      </td>

                      {/* 2. Category */}
                      <td className="px-6 text-white text-lg font-medium font-['Inter'] leading-5 whitespace-nowrap">
                        {item.category}
                      </td>

                      {/* 3. Stock Level: Progress bar + Quantity label */}
                      <td className="px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-1.5 bg-gray-800 rounded-full inline-flex flex-col justify-start items-start overflow-hidden">
                            <div
                              className={`h-1.5 rounded-[5px] transition-all duration-300 ${
                                item.status === 'Low Stock'
                                  ? 'bg-red-500'
                                  : item.status === 'Running Low'
                                  ? 'bg-yellow-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.max(15, stockRatio)}%` }}
                            />
                          </div>
                          <span className="text-gray-200 text-xs font-normal font-['Inter'] leading-4">
                            {item.currentStock} {item.unit}
                          </span>
                        </div>
                      </td>

                      {/* 4. Min / Max */}
                      <td className="px-6 text-white text-lg font-medium font-['Inter'] leading-5 whitespace-nowrap">
                        {item.minStock < 10 ? `0${item.minStock}` : item.minStock} /{' '}
                        {item.maxStock < 10 ? `0${item.maxStock}` : item.maxStock}
                      </td>

                      {/* 5. Last Restocked */}
                      <td className="px-6 text-white text-lg font-medium font-['Inter'] leading-5 whitespace-nowrap">
                        {item.lastRestocked}
                      </td>

                      {/* 6. Status Badge */}
                      <td className="px-6 whitespace-nowrap">
                        {item.status === 'Low Stock' ? (
                          <div className="w-20 px-2 py-1 bg-yellow-950/80 border border-red-500/30 rounded-[5px] inline-flex items-center justify-center">
                            <span className="text-orange-500 text-sm font-semibold font-['Inter'] leading-4">
                              Low Stock
                            </span>
                          </div>
                        ) : item.status === 'Running Low' ? (
                          <div className="px-2.5 py-1 bg-yellow-500/10 rounded-sm outline outline-1 outline-offset-[-1px] outline-yellow-500/20 inline-flex items-center justify-center">
                            <span className="text-yellow-500 text-sm font-medium font-['JetBrains_Mono'] leading-4">
                              Running Low
                            </span>
                          </div>
                        ) : (
                          <div className="px-2.5 py-1 bg-emerald-500/10 rounded-sm outline outline-1 outline-offset-[-1px] outline-emerald-500/20 inline-flex items-center justify-center">
                            <span className="text-emerald-500 text-sm font-medium font-['JetBrains_Mono'] leading-4">
                              In Stock
                            </span>
                          </div>
                        )}
                      </td>

                      {/* 7. Action: Restock & Edit */}
                      <td className="px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenRestock(item)}
                            className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/30 rounded-sm outline outline-1 outline-offset-[-1px] outline-amber-500/20 inline-flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <span className="text-center text-amber-500 text-sm font-medium font-['JetBrains_Mono'] leading-4">
                              Restock
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit supply item"
                            className="w-6 h-6 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 hover:outline-white/25 bg-zinc-900 hover:bg-zinc-800 inline-flex justify-center items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Pencil className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Complete Pagination Controls */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-zinc-400 font-['Inter']">
          <div>
            Showing{' '}
            <span className="font-semibold text-white">
              {filteredItems.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-white">
              {Math.min(currentPage * itemsPerPage, filteredItems.length)}
            </span>{' '}
            of <span className="font-semibold text-white">{filteredItems.length}</span> supplies
          </div>

          <div className="flex items-center gap-1.5">
            {/* Previous Button */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-amber-400 text-white font-bold shadow-md shadow-amber-400/20'
                    : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Button */}
            <button
              type="button"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Restock Modal */}
      {isRestockModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white font-['Inter']">
                  Restock {activeItem.name}
                </h3>
                <p className="text-sm text-zinc-400 font-['Inter'] mt-0.5">
                  Update inventory levels for this beverage supply item.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRestockModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-zinc-900/80 border border-white/5 text-sm">
                <div>
                  <span className="text-zinc-500">Current Stock:</span>
                  <div className="text-white font-semibold mt-0.5">
                    {activeItem.currentStock} {activeItem.unit}
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500">Target Max:</span>
                  <div className="text-amber-400 font-semibold mt-0.5">
                    {activeItem.maxStock} {activeItem.unit}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Quantity to Add ({activeItem.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Batch / Supplier Note (Optional)
                </label>
                <input
                  type="text"
                  value={restockNotes}
                  onChange={(e) => setRestockNotes(e.target.value)}
                  placeholder="e.g. Daily market produce delivery"
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3 bg-zinc-900/40">
              <button
                type="button"
                onClick={() => setIsRestockModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRestock}
                className="px-4 py-2 text-sm font-semibold text-white bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg transition-colors cursor-pointer shadow-lg shadow-amber-400/20"
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Add / Edit Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white font-['Inter']">
                  {activeItem ? 'Edit Supply Item' : 'Add New Supply Item'}
                </h3>
                <p className="text-sm text-zinc-400 font-['Inter'] mt-0.5">
                  Set ingredient name, threshold targets, and storage unit.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupply} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Fresh Spearmint"
                  required
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as InventorySupplyItem['category'])}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Liquor">Liquor</option>
                    <option value="Garnish">Garnish</option>
                    <option value="Produce">Produce</option>
                    <option value="Mixer">Mixer</option>
                    <option value="Coffee">Coffee</option>
                    <option value="Juice">Juice</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Syrup">Syrup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="e.g. bottles, bunches, kg"
                    required
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formStock}
                    onChange={(e) => setFormStock(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Min Alert
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formMin}
                    onChange={(e) => setFormMin(parseInt(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Max Target
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formMax}
                    onChange={(e) => setFormMax(parseInt(e.target.value) || 1)}
                    required
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg transition-colors cursor-pointer shadow-lg shadow-amber-400/20"
                >
                  {activeItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
