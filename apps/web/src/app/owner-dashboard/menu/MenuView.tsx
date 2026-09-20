'use client';

import React, { useState, useMemo } from 'react';
import {
  MenuHeader,
  MenuFilterBar,
  MenuItemCard,
  AddMenuItemModal,
  EditMenuItemModal,
} from './components';
import { INITIAL_MENU_ITEMS } from './menuData';
import { MenuItem, MenuCategory } from './types';
import { toast } from 'sonner';

const CATEGORIES: MenuCategory[] = [
  'All',
  'Sweet',
  'Savory',
  'Pancake',
  'Coffee',
  'Drinks',
];

export default function MenuView() {
  const [items, setItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Filter items based on active category and search
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === 'All' ||
        item.category.toLowerCase() === activeCategory.toLowerCase() ||
        item.categoryLabel?.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [items, activeCategory, searchQuery]);

  // Toggle active / hidden status
  const handleToggleActive = (targetItem: MenuItem) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === targetItem.id
          ? { ...item, isActive: !item.isActive }
          : item
      )
    );
    toast.success(
      targetItem.isActive
        ? `"${targetItem.name}" is now hidden from customer menu.`
        : `"${targetItem.name}" is now active and visible to guests.`
    );
  };

  // Add new item
  const handleAddItem = (newItem: MenuItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  // Update item
  const handleUpdateItem = (updatedItem: MenuItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  // Delete item
  const handleDeleteItem = (targetItem: MenuItem) => {
    if (confirm(`Are you sure you want to delete "${targetItem.name}"?`)) {
      setItems((prev) => prev.filter((item) => item.id !== targetItem.id));
      toast.success(`Deleted "${targetItem.name}" from menu.`);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 pb-12">
      {/* 1. Header with Stats & Add CTA */}
      <MenuHeader
        items={items}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* 2. Filter Bar & Search */}
      <MenuFilterBar
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 3. Responsive Menu Grid (4 cols matching Figma) */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center text-zinc-500 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-base">No menu items match your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onToggleActive={handleToggleActive}
              onEdit={(itm) => setEditingItem(itm)}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      )}

      {/* 4. Modals */}
      <AddMenuItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={handleAddItem}
      />

      <EditMenuItemModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onUpdateItem={handleUpdateItem}
      />
    </div>
  );
}
