'use client';

import React, { useState } from 'react';
import { X, Plus, ChevronDown } from 'lucide-react';
import { AddMenuItemFormData } from '../../types';

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMenuItem: (data: AddMenuItemFormData) => void;
}

export const AddMenuItemModal: React.FC<AddMenuItemModalProps> = ({
  isOpen,
  onClose,
  onAddMenuItem,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Pizza');
  const [price, setPrice] = useState<number | string>('15.00');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState<number | string>('12');
  const [calories, setCalories] = useState<number | string>('650');
  const [allergens, setAllergens] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddMenuItem({
      name: name.trim(),
      category,
      price: Number(price) || 0,
      description: description.trim(),
      prepTimeMinutes: Number(prepTime) || 10,
      calories: Number(calories) || 500,
      allergens: allergens.trim(),
      isAvailable,
      isPopular: false,
    });

    // Reset fields
    setName('');
    setCategory('Pizza');
    setPrice('15.00');
    setDescription('');
    setPrepTime('12');
    setCalories('650');
    setAllergens('');
    setIsAvailable(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 lg:left-72 top-20 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-sm sm:max-w-md bg-black border border-white/15 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Screenshot 1 */}
        <div className="flex items-start justify-between border-b border-white/5 pb-3">
          <div>
            <h3 className="text-slate-200 text-base font-bold font-['Plus_Jakarta_Sans'] leading-5">
              Add Menu Item
            </h3>
            <p className="text-slate-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4 mt-0.5">
              Add a new item to the restaurant menu
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-amber-500 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Form Fields matching Screenshot 1 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Item Name */}
          <div className="flex flex-col gap-1">
            <label className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
              Item Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.G. BBQ PULLED PORK PIZZA"
              className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/20 text-white placeholder-zinc-500 text-sm font-normal uppercase tracking-wide focus:outline-yellow-500 transition-all"
            />
          </div>

          {/* Row 2: Category & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/20 text-white text-sm font-normal appearance-none focus:outline-yellow-500 cursor-pointer"
                >
                  <option value="Pizza">Pizza</option>
                  <option value="Burgers">Burgers</option>
                  <option value="Salads">Salads</option>
                  <option value="Mains">Mains</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Pancake">Pancake</option>
                  <option value="Coffee">Coffee</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Sweet">Sweet</option>
                  <option value="Savory">Savory</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-white/70 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
                Price ($)
              </label>
              <input
                type="number"
                step="0.50"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15.00"
                className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/20 text-white placeholder-zinc-500 text-sm font-normal focus:outline-yellow-500 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief Description Of The Dish, Key Ingredients..."
              className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/20 text-white placeholder-zinc-500 text-sm font-normal focus:outline-yellow-500 transition-all"
            />
          </div>

          {/* Row 4: Preparation Time & Calories */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
                Preparation Time (min)
              </label>
              <input
                type="number"
                min="1"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="12"
                className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/20 text-white placeholder-zinc-500 text-sm font-normal focus:outline-yellow-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
                Calories (kcal)
              </label>
              <input
                type="number"
                min="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="650"
                className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/20 text-white placeholder-zinc-500 text-sm font-normal focus:outline-yellow-500 transition-all"
              />
            </div>
          </div>

          {/* Allergens */}
          <div className="flex flex-col gap-1">
            <label className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
              Allergens
            </label>
            <input
              type="text"
              value={allergens}
              onChange={(e) => setAllergens(e.target.value)}
              placeholder="Gluten, Dairy, Nuts..."
              className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/20 text-white placeholder-zinc-500 text-sm font-normal focus:outline-yellow-500 transition-all"
            />
          </div>

          {/* Available on Menu Toggle matching Screenshot 1 */}
          <div className="p-3 bg-white/5 rounded-[8px] outline outline-[0.5px] outline-white/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-slate-200 text-sm font-medium font-['Plus_Jakarta_Sans']">
                Available on Menu
              </span>
              <span className="text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans']">
                Customers can order this item
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isAvailable}
              onClick={() => setIsAvailable(!isAvailable)}
              className={`w-9 h-5 relative rounded-full transition-colors cursor-pointer ${
                isAvailable ? 'bg-amber-500' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 absolute top-[3px] bg-white rounded-full shadow-sm transition-transform ${
                  isAvailable ? 'right-[3px]' : 'left-[3px]'
                }`}
              />
            </button>
          </div>

          {/* Action Buttons matching Screenshot 1 */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              type="submit"
              className="h-9 px-4 bg-yellow-500 hover:bg-yellow-400 text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] rounded-[5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-yellow-500/20 active:scale-[0.99]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add to Menu</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 bg-neutral-800 hover:bg-neutral-700 outline outline-1 outline-offset-[-1px] outline-white/5 text-slate-200 text-sm font-medium font-['Plus_Jakarta_Sans'] rounded-[5px] flex items-center justify-center transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
