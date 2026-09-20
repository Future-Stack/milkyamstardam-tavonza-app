'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { ManagerMenuItem } from '../../types';

interface EditMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ManagerMenuItem | null;
  onUpdateItem: (updated: ManagerMenuItem) => void;
}

interface EditMenuItemFormProps {
  item: ManagerMenuItem;
  onClose: () => void;
  onUpdateItem: (updated: ManagerMenuItem) => void;
}

const EditMenuItemForm: React.FC<EditMenuItemFormProps> = ({
  item,
  onClose,
  onUpdateItem,
}) => {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [price, setPrice] = useState<number | string>(item.price.toFixed(2));
  const [description, setDescription] = useState(item.description || '');
  const [isAvailable, setIsAvailable] = useState(item.status === 'Available');
  const [isPopular, setIsPopular] = useState(item.isPopular);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onUpdateItem({
      ...item,
      name: name.trim(),
      category,
      price: Number(price) || item.price,
      description: description.trim(),
      status: isAvailable ? 'Available' : 'Unavailable',
      isPopular,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="text-white text-xs font-semibold uppercase tracking-wide">
          Item Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-white/20 text-white text-sm focus:outline-yellow-500 transition-all"
        />
      </div>

      {/* Category & Price */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-white text-xs font-semibold uppercase tracking-wide">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-white/20 text-white text-sm focus:outline-yellow-500 cursor-pointer"
          >
            <option value="Pizza">Pizza</option>
            <option value="Burgers">Burgers</option>
            <option value="Salads">Salads</option>
            <option value="Mains">Mains</option>
            <option value="Desserts">Desserts</option>
            <option value="Pancake">Pancake</option>
            <option value="Coffee">Coffee</option>
            <option value="Drinks">Drinks</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white text-xs font-semibold uppercase tracking-wide">
            Price ($)
          </label>
          <input
            type="number"
            step="0.50"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-white/20 text-white text-sm focus:outline-yellow-500 transition-all"
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-white text-xs font-semibold uppercase tracking-wide">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-white/20 text-white text-sm focus:outline-yellow-500 transition-all"
        />
      </div>

      {/* Toggles: Available & Popular */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-2.5 bg-white/5 rounded-[6px] border border-white/5 flex items-center justify-between">
          <span className="text-sm text-slate-300 font-medium">Available</span>
          <button
            type="button"
            onClick={() => setIsAvailable(!isAvailable)}
            className={`w-8 h-4 relative rounded-full transition-colors cursor-pointer ${
              isAvailable ? 'bg-amber-500' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 absolute top-[1px] bg-white rounded-full shadow-sm transition-transform ${
                isAvailable ? 'right-[2px]' : 'left-[2px]'
              }`}
            />
          </button>
        </div>

        <div className="p-2.5 bg-white/5 rounded-[6px] border border-white/5 flex items-center justify-between">
          <span className="text-sm text-slate-300 font-medium">Popular</span>
          <button
            type="button"
            onClick={() => setIsPopular(!isPopular)}
            className={`w-8 h-4 relative rounded-full transition-colors cursor-pointer ${
              isPopular ? 'bg-amber-500' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 absolute top-[1px] bg-white rounded-full shadow-sm transition-transform ${
                isPopular ? 'right-[2px]' : 'left-[2px]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2.5 pt-2">
        <button
          type="submit"
          className="h-9 px-4 bg-yellow-500 hover:bg-yellow-400 text-white text-sm font-semibold rounded-[5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-yellow-500/20"
        >
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Save Changes</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="h-9 px-4 bg-neutral-800 hover:bg-neutral-700 text-slate-200 text-sm font-medium rounded-[5px] flex items-center justify-center transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export const EditMenuItemModal: React.FC<EditMenuItemModalProps> = ({
  isOpen,
  onClose,
  item,
  onUpdateItem,
}) => {
  if (!isOpen || !item) return null;

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
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/5 pb-3">
          <div>
            <h3 className="text-slate-200 text-base font-bold font-['Plus_Jakarta_Sans'] leading-5">
              Edit Menu Item
            </h3>
            <p className="text-slate-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4 mt-0.5">
              Update pricing, category, and availability
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-amber-500 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Form using key to re-mount when item changes, eliminating setState in useEffect */}
        <EditMenuItemForm
          key={item.id}
          item={item}
          onClose={onClose}
          onUpdateItem={onUpdateItem}
        />
      </div>
    </div>
  );
};
