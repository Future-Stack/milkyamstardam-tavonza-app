'use client';

import React, { useState, useMemo } from 'react';
import { Download, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  MenuCategoryFilter,
  ManagerMenuItem,
  AddMenuItemFormData,
} from '../types';
import { initialManagerMenuItems } from '../data';
import {
  MenuFilterTabs,
  MenuItemsTable,
  AddMenuItemModal,
  EditMenuItemModal,
} from './components';

export const MenuView: React.FC = () => {
  const [items, setItems] = useState<ManagerMenuItem[]>(initialManagerMenuItems);
  const [activeTab, setActiveTab] = useState<MenuCategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ManagerMenuItem | null>(null);

  // Filter items by category and search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category mapping matching Figma tabs: All, Sweet, Savory, Pancake, Coffee, Drinks
      let matchesCategory = true;
      if (activeTab === 'Sweet') {
        matchesCategory =
          item.category === 'Desserts' ||
          item.category === 'Pancake' ||
          item.category === 'Sweet';
      } else if (activeTab === 'Savory') {
        matchesCategory =
          item.category === 'Pizza' ||
          item.category === 'Burgers' ||
          item.category === 'Salads' ||
          item.category === 'Mains' ||
          item.category === 'Savory';
      } else if (activeTab === 'Pancake') {
        matchesCategory = item.category === 'Pancake';
      } else if (activeTab === 'Coffee') {
        matchesCategory = item.category === 'Coffee';
      } else if (activeTab === 'Drinks') {
        matchesCategory = item.category === 'Drinks' || item.category === 'Coffee';
      }

      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [items, activeTab, searchQuery]);

  // Handlers
  const handleToggleStatus = (item: ManagerMenuItem) => {
    const newStatus = item.status === 'Available' ? 'Unavailable' : 'Available';
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
    );
    toast.info(`${item.name} marked as ${newStatus}`);
  };

  const handleAddItem = (data: AddMenuItemFormData) => {
    const newItem: ManagerMenuItem = {
      id: `m-${Date.now()}`,
      name: data.name,
      category: data.category,
      price: data.price,
      status: data.isAvailable ? 'Available' : 'Unavailable',
      isPopular: data.isPopular || false,
      description: data.description || undefined,
      prepTimeMinutes: data.prepTimeMinutes,
      calories: data.calories,
      allergens: data.allergens || undefined,
    };

    setItems((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    toast.success(`Added ${data.name} to menu!`);
  };

  const handleUpdateItem = (updated: ManagerMenuItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setEditingItem(null);
    toast.success(`Updated ${updated.name}`);
  };

  const handleDeleteItem = (itemId: string) => {
    const target = items.find((i) => i.id === itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    toast.success(`Deleted ${target?.name || 'item'} from menu`);
  };

  const handleExportMenu = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Name,Category,Price,Status,Popular']
        .concat(
          items.map(
            (i) =>
              `"${i.name}","${i.category}",${i.price},"${i.status}",${i.isPopular}`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'restaurant-menu.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported restaurant menu to CSV');
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Header matching Figma: Title, Subtitle, Export & Add Item buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-3xl sm:text-4xl font-semibold font-['Inter'] leading-tight">
            Menu Management
          </h1>
          <p className="text-zinc-500 text-base sm:text-lg font-normal font-['Inter'] mt-1">
            Update item availability, prices, and categories
          </p>
        </div>

        {/* Action Buttons: Export & Add Item */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportMenu}
            className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-200/20 flex items-center gap-1.5 text-white text-sm font-semibold font-['Inter'] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-white text-sm font-semibold font-['Inter'] rounded-[10px] shadow-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-amber-500/20 active:scale-[0.99]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar & Search Input */}
      <MenuFilterTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Menu Items Table matching Figma */}
      <MenuItemsTable
        items={filteredItems}
        onEditItem={setEditingItem}
        onDeleteItem={handleDeleteItem}
        onToggleStatus={handleToggleStatus}
      />

      {/* Add Menu Item Modal (Screenshot 1) */}
      <AddMenuItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMenuItem={handleAddItem}
      />

      {/* Edit Menu Item Modal */}
      <EditMenuItemModal
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        item={editingItem}
        onUpdateItem={handleUpdateItem}
      />
    </div>
  );
};

export const ManagerMenuView = MenuView;
export default MenuView;
