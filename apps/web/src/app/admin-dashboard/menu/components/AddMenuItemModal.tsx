'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { MenuItem } from '../types';
import { toast } from 'sonner';

export interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: MenuItem) => void;
}

const CATEGORY_OPTIONS = [
  { label: 'Burgers', icon: '🍔' },
  { label: 'Pizza', icon: '🍕' },
  { label: 'Pasta', icon: '🍝' },
  { label: 'Salads', icon: '🥗' },
  { label: 'Desserts', icon: '🍰' },
  { label: 'Drinks', icon: '🍹' },
];

export default function AddMenuItemModal({
  isOpen,
  onClose,
  onAddItem,
}: AddMenuItemModalProps) {
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Burgers');
  const [sellingPrice, setSellingPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter an item name');
      return;
    }

    const sell = parseFloat(sellingPrice) || 0;
    const cost = parseFloat(costPrice) || 0;

    if (sell <= 0) {
      toast.error('Please enter a valid selling price greater than 0');
      return;
    }

    const marginPercent =
      sell > 0 ? Math.round(((sell - cost) / sell) * 100) : 66;

    // Pick a relevant image based on category
    const sampleImages: Record<string, string> = {
      Burgers: '/assets/costomerpages/ribeye-steak-butter.png',
      Pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      Pasta: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=600&q=80',
      Salads: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      Desserts: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
      Drinks: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    };

    const newItem: MenuItem = {
      id: `m-${Date.now()}`,
      name: name.trim(),
      category: selectedCategory,
      categoryLabel: selectedCategory,
      price: sell,
      costPrice: cost,
      marginPercent: Math.max(0, marginPercent),
      soldToday: 0,
      isActive: true,
      image:
        sampleImages[selectedCategory] ||
        '/assets/costomerpages/steak-rating-card.png',
      description: description.trim(),
    };

    onAddItem(newItem);
    toast.success(`Added "${newItem.name}" to the menu!`);

    // Reset & close
    setName('');
    setSelectedCategory('Burgers');
    setSellingPrice('');
    setCostPrice('');
    setDescription('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#18181b] border border-zinc-800 rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl space-y-5 text-white animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight font-['Inter']">
              Add Menu Item
            </h3>
            <p className="text-sm text-zinc-400 font-normal font-['Inter'] mt-1">
              New item will be active and visible to guests immediately.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition cursor-pointer"
          >
            <X className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-300 font-['Inter']">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Truffle Mushroom Burger"
              className="w-full h-11 px-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 focus:border-amber-400 text-base text-white placeholder:text-zinc-600 focus:outline-none transition font-['Inter']"
              autoFocus
            />
          </div>

          {/* Category Pill Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-300 font-['Inter']">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = selectedCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setSelectedCategory(cat.label)}
                    className={`h-9 px-3.5 rounded-xl text-sm font-medium font-['Inter'] inline-flex items-center gap-1.5 transition cursor-pointer ${
                      isSelected
                        ? 'bg-yellow-500 text-white font-semibold shadow-md shadow-yellow-500/20'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two-Column Price Fields */}
          <div className="grid grid-cols-2 gap-3">
            {/* Selling Price */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-300 font-['Inter']">
                Selling Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="0.00"
                className="w-full h-11 px-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 focus:border-amber-400 text-base text-white placeholder:text-zinc-600 focus:outline-none transition font-['Inter']"
              />
            </div>

            {/* Cost Price */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-300 font-['Inter']">
                Cost Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="0.00"
                className="w-full h-11 px-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 focus:border-amber-400 text-base text-white placeholder:text-zinc-600 focus:outline-none transition font-['Inter']"
              />
            </div>
          </div>

          {/* Description Textarea */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-300 font-['Inter']">
              Description <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the dish for guests..."
              className="w-full p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 focus:border-amber-400 text-base text-white placeholder:text-zinc-600 focus:outline-none transition font-['Inter'] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-semibold text-zinc-300 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-3 bg-yellow-500 hover:bg-yellow-400 rounded-xl text-sm font-bold text-white shadow-lg shadow-yellow-500/20 transition cursor-pointer"
            >
              Add to Menu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
