'use client';

import React, { useState, useMemo } from 'react';
import {
  Download,
  Plus,
  Search,
  Clock,
  Pencil,
  X,
  Sparkles,
  Check,
  Flame,
  Filter,
  Wine,
  Coffee,
  CupSoda,
  Citrus,
  GlassWater
} from 'lucide-react';
import { toast } from 'sonner';

export interface DrinkMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'cocktails' | 'mocktails' | 'coffee' | 'Soft Drinks' | 'juice';
  prepTime: string;
  isPopular?: boolean;
  isAvailable: boolean;
}

const initialMenuItems: DrinkMenuItem[] = [
  {
    id: 'dm-1',
    name: 'Signature Mojito',
    description: 'Fresh mint, lime, rum, soda water',
    price: 9.0,
    category: 'cocktails',
    prepTime: '5 min',
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'dm-2',
    name: 'Fresh Berry Juice',
    description: 'Fresh mint, lime, rum, soda water',
    price: 9.0,
    category: 'juice',
    prepTime: '5 min',
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'dm-3',
    name: 'Virgin Mojito Spritz',
    description: 'Fresh mint, lime, rum, soda water',
    price: 9.0,
    category: 'mocktails',
    prepTime: '5 min',
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'dm-4',
    name: 'Classic Old Fashioned',
    description: 'Fresh mint, lime, rum, soda water',
    price: 9.0,
    category: 'cocktails',
    prepTime: '5 min',
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'dm-5',
    name: 'Espresso Martini',
    description: 'Fresh mint, lime, rum, soda water',
    price: 9.0,
    category: 'cocktails',
    prepTime: '5 min',
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'dm-6',
    name: 'Smoked Paloma',
    description: 'Fresh mint, lime, rum, soda water',
    price: 9.0,
    category: 'cocktails',
    prepTime: '5 min',
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'dm-7',
    name: 'Cold-Pressed Orange',
    description: 'Fresh mint, lime, rum, soda water',
    price: 9.0,
    category: 'juice',
    prepTime: '5 min',
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'dm-8',
    name: 'Spiced Ginger Ale',
    description: 'Fresh mint, lime, rum, soda water',
    price: 9.0,
    category: 'cocktails',
    prepTime: '5 min',
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'dm-9',
    name: 'Matcha Iced Latte',
    description: 'Fresh mint, lime, rum, soda water',
    price: 9.0,
    category: 'coffee',
    prepTime: '5 min',
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'dm-10',
    name: 'Green Detox Cleanser',
    description: 'Fresh mint, lime, rum, soda water',
    price: 9.0,
    category: 'juice',
    prepTime: '5 min',
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'dm-11',
    name: 'Vanilla Oat Flat White',
    description: 'Fresh mint, lime, rum, soda water',
    price: 9.0,
    category: 'coffee',
    prepTime: '5 min',
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'dm-12',
    name: 'Artisanal Tonic & Citrus',
    description: 'Fresh mint, lime, rum, soda water',
    price: 9.0,
    category: 'juice',
    prepTime: '5 min',
    isPopular: false,
    isAvailable: true,
  },
];

export default function DrinkMenuView() {
  const [items, setItems] = useState<DrinkMenuItem[]>(initialMenuItems);
  const [activeCategory, setActiveCategory] = useState<
    'All' | 'cocktails' | 'mocktails' | 'coffee' | 'Soft Drinks' | 'juice'
  >('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DrinkMenuItem | null>(null);

  // Add / Edit form fields
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('9.00');
  const [formCategory, setFormCategory] = useState<
    'cocktails' | 'mocktails' | 'coffee' | 'Soft Drinks' | 'juice'
  >('cocktails');
  const [formPrepTime, setFormPrepTime] = useState('5 min');
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formIsAvailable, setFormIsAvailable] = useState(true);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  // Toggle availability
  const handleToggleAvailability = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isAvailable;
          toast.success(
            `${item.name} is now ${nextState ? 'Available (ON)' : 'Unavailable (OFF)'}`
          );
          return { ...item, isAvailable: nextState };
        }
        return item;
      })
    );
  };

  // Open Edit Modal
  const handleOpenEdit = (item: DrinkMenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDescription(item.description);
    setFormPrice(item.price.toFixed(2));
    setFormCategory(item.category);
    setFormPrepTime(item.prepTime);
    setFormIsPopular(!!item.isPopular);
    setFormIsAvailable(item.isAvailable);
    setIsAddModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormDescription('Fresh ingredients, signature garnish');
    setFormPrice('9.00');
    setFormCategory('cocktails');
    setFormPrepTime('5 min');
    setFormIsPopular(false);
    setFormIsAvailable(true);
    setIsAddModalOpen(true);
  };

  // Submit Add / Edit Form
  const handleSaveDrink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Please enter beverage name');
      return;
    }

    const priceNumber = parseFloat(formPrice) || 9.0;

    if (editingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: formName,
                description: formDescription,
                price: priceNumber,
                category: formCategory,
                prepTime: formPrepTime,
                isPopular: formIsPopular,
                isAvailable: formIsAvailable,
              }
            : item
        )
      );
      toast.success(`Updated ${formName}`);
    } else {
      const newItem: DrinkMenuItem = {
        id: `dm-${Date.now()}`,
        name: formName,
        description: formDescription,
        price: priceNumber,
        category: formCategory,
        prepTime: formPrepTime,
        isPopular: formIsPopular,
        isAvailable: formIsAvailable,
      };
      setItems((prev) => [newItem, ...prev]);
      toast.success(`Added ${formName} to drink menu`);
    }

    setIsAddModalOpen(false);
  };

  // Export Menu to CSV
  const handleExportMenu = () => {
    const headers = ['ID', 'Name', 'Category', 'Price', 'Prep Time', 'Popular', 'Status'];
    const rows = filteredItems.map((item) => [
      item.id,
      `"${item.name.replace(/"/g, '""')}"`,
      item.category,
      `$${item.price.toFixed(2)}`,
      item.prepTime,
      item.isPopular ? 'YES' : 'NO',
      item.isAvailable ? 'AVAILABLE' : 'OFF MENU',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `drink-menu-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredItems.length} drinks to CSV`);
  };

  // Badge styles according to category
  const getCategoryBadgeClass = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cocktails':
        return 'bg-yellow-500/10 text-yellow-500 outline-yellow-500/20';
      case 'mocktails':
        return 'bg-emerald-500/10 text-emerald-500 outline-emerald-500/20';
      case 'coffee':
        return 'bg-amber-500/10 text-amber-500 outline-amber-500/20';
      case 'soft drinks':
        return 'bg-cyan-500/10 text-cyan-400 outline-cyan-500/20';
      case 'juice':
        return 'bg-emerald-500/10 text-emerald-500 outline-emerald-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 outline-zinc-500/20';
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* 1. Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-4xl font-semibold font-['Inter'] leading-9 tracking-tight">
            Drink Menu
          </h1>
          <p className="text-zinc-500 text-lg font-normal font-['Inter'] leading-6 mt-1">
            Manage and view all available beverages
          </p>
        </div>

        {/* Action Buttons: Export Menu & Add Item */}
        <div className="flex items-center gap-2">
          {/* Export Menu Button */}
          <button
            type="button"
            onClick={handleExportMenu}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-200/20 flex items-center gap-1.5 text-white text-sm font-semibold font-['Inter'] leading-5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Export Menu</span>
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

      {/* 2. Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        {/* Segmented Filter Control */}
        <div className="h-9 inline-flex items-center rounded-lg overflow-hidden border border-white/20 bg-zinc-950 flex-wrap">
          {(
            ['All', 'cocktails', 'mocktails', 'coffee', 'Soft Drinks', 'juice'] as const
          ).map((tab, idx, arr) => {
            const isActive = activeCategory === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveCategory(tab)}
                className={`h-9 px-3.5 py-1.5 text-base font-['Inter'] transition-colors flex items-center justify-center cursor-pointer ${
                  isActive
                    ? 'bg-yellow-500 text-white font-medium shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5 font-normal'
                } ${idx !== arr.length - 1 ? 'border-r border-white/20' : ''}`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drink menu..."
            className="w-full h-9 pl-9 pr-8 bg-zinc-900/90 border border-white/10 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
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

      {/* Quick Summary Pill */}
      <div className="flex items-center justify-between text-sm text-zinc-500 font-['Inter'] px-1">
        <span>
          Showing <strong className="text-zinc-200">{filteredItems.length}</strong> items in{' '}
          <strong className="text-amber-400">{activeCategory}</strong>
        </span>
        <span>
          Active:{' '}
          <strong className="text-emerald-400">
            {filteredItems.filter((i) => i.isAvailable).length}
          </strong>{' '}
          · Off-Menu:{' '}
          <strong className="text-rose-400">
            {filteredItems.filter((i) => !i.isAvailable).length}
          </strong>
        </span>
      </div>

      {/* 3. Three-Column Responsive Grid of Beverage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white/5 border border-white/10 rounded-xl p-8">
            <Wine className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <div className="text-lg font-medium text-zinc-300">No beverages match your filter</div>
            <p className="text-sm text-zinc-500 mt-1">
              Try adjusting your category selection or clear search.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-1.5 text-sm bg-zinc-800 text-zinc-200 rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white/5 hover:bg-white/[0.08] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[30px] flex flex-col justify-between transition-all duration-150 group min-h-[112px]"
            >
              {/* Top Row: Name, Popular Tag, and Price */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gray-200 text-base font-semibold font-['Outfit'] leading-5 truncate">
                      {item.name}
                    </span>
                    {item.isPopular && (
                      <span className="px-1.5 py-0.5 bg-amber-500/10 rounded-sm outline outline-1 outline-offset-[-1px] outline-amber-500/20 text-amber-500 text-sm font-normal font-['Inter'] leading-4">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm font-normal font-['Inter'] leading-4 mt-1 truncate">
                    {item.description}
                  </p>
                </div>

                <div className="text-gray-200 text-base font-bold font-['Inter'] leading-5 whitespace-nowrap">
                  ${item.price.toFixed(2)}
                </div>
              </div>

              {/* Bottom Row: Prep time, Category pill, Edit and Availability toggle buttons */}
              <div className="pt-3 flex items-center justify-between mt-auto">
                {/* Left: Prep time and Category badge */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-gray-500 text-sm font-normal font-['Inter'] leading-4">
                    <Clock className="w-2.5 h-2.5 text-gray-500" />
                    <span>{item.prepTime}</span>
                  </div>

                  <div
                    className={`px-2 py-0.5 rounded-sm outline outline-1 outline-offset-[-1px] text-sm font-medium font-['Inter'] capitalize leading-4 ${getCategoryBadgeClass(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </div>
                </div>

                {/* Right: Pencil Edit and ON/OFF Button matching screenshot */}
                <div className="flex items-center gap-1.5">
                  {/* Edit Pencil Icon Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    title="Edit item"
                    className="w-7 h-7 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/5 hover:outline-white/20 bg-zinc-900/60 hover:bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3 h-3 text-gray-400 group-hover:text-gray-200" />
                  </button>

                  {/* Availability ON / OFF Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleAvailability(item.id)}
                    title={
                      item.isAvailable
                        ? 'Click to turn OFF (Out of Stock)'
                        : 'Click to turn ON (Available)'
                    }
                    className={`w-7 h-7 rounded-sm outline outline-1 outline-offset-[-1px] flex items-center justify-center text-sm font-medium font-['Inter'] leading-4 transition-colors cursor-pointer select-none ${
                      item.isAvailable
                        ? 'bg-emerald-500/10 outline-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                        : 'bg-rose-500/10 outline-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                    }`}
                  >
                    {item.isAvailable ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Add / Edit Beverage Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white font-['Inter']">
                  {editingItem ? 'Edit Beverage' : 'Add New Beverage'}
                </h3>
                <p className="text-sm text-zinc-400 font-['Inter'] mt-0.5">
                  Update drink details, pricing, ingredients, and station category.
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

            {/* Modal Form */}
            <form onSubmit={handleSaveDrink} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Beverage Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Signature Mojito"
                  required
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Ingredients / Description
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Fresh mint, lime, rum, soda water"
                  required
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Prep Time
                  </label>
                  <input
                    type="text"
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(e.target.value)}
                    placeholder="e.g. 5 min"
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) =>
                    setFormCategory(
                      e.target.value as
                        | 'cocktails'
                        | 'mocktails'
                        | 'coffee'
                        | 'Soft Drinks'
                        | 'juice'
                    )
                  }
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-base text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="cocktails">Cocktails</option>
                  <option value="mocktails">Mocktails</option>
                  <option value="coffee">Coffee</option>
                  <option value="Soft Drinks">Soft Drinks</option>
                  <option value="juice">Juice</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="pt-2 flex items-center justify-between border-t border-white/10">
                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPopular}
                    onChange={(e) => setFormIsPopular(e.target.checked)}
                    className="accent-amber-400 w-4 h-4 rounded cursor-pointer"
                  />
                  <span>Tag as Popular / Featured</span>
                </label>

                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsAvailable}
                    onChange={(e) => setFormIsAvailable(e.target.checked)}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                  <span>In Stock (Available)</span>
                </label>
              </div>

              {/* Modal Footer */}
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
                  {editingItem ? 'Save Changes' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
