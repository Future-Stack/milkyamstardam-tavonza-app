'use client';

import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Supplier, SupplierCategory } from '../types';
import { toast } from 'sonner';

export interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSupplier: (supplier: Supplier) => void;
}

export default function AddSupplierModal({
  isOpen,
  onClose,
  onAddSupplier,
}: AddSupplierModalProps) {
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [category, setCategory] = useState<SupplierCategory>('Produce');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a supplier name');
      return;
    }

    const newSupplier: Supplier = {
      id: `SUP-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      contactPerson: contactPerson.trim() || 'Account Representative',
      category,
      phone: phone.trim() || '+1 555-0199',
      email: email.trim() || `orders@${name.toLowerCase().replace(/\s+/g, '')}.com`,
      location: location.trim() || 'United States',
      reliabilityPercent: 95,
      lastOrder: 'Never',
      nextDelivery: '__',
      productsCount: 10,
      status: 'Active',
      products: [],
      orderHistory: [],
    };

    onAddSupplier(newSupplier);
    toast.success(`Supplier "${newSupplier.name}" added successfully!`);

    // Reset and close
    setName('');
    setContactPerson('');
    setCategory('Produce');
    setPhone('');
    setEmail('');
    setLocation('');
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
              Add Supplier
            </h3>
            <p className="text-sm text-zinc-400 font-normal font-['Inter'] mt-1">
              Add vendor contacts, delivery schedules, and product lines.
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
          {/* Supplier Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-300 font-['Inter']">
              Supplier / Company Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Artisanal Bread Co."
              className="w-full h-11 px-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 focus:border-amber-400 text-base text-white placeholder:text-zinc-600 focus:outline-none transition font-['Inter']"
              autoFocus
            />
          </div>

          {/* Row: Contact Person & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-300 font-['Inter']">
                Contact Person
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full h-11 px-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 focus:border-amber-400 text-sm text-white placeholder:text-zinc-600 focus:outline-none font-['Inter']"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-300 font-['Inter']">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SupplierCategory)}
                  className="w-full h-11 px-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 focus:border-amber-400 text-sm text-white appearance-none focus:outline-none cursor-pointer"
                >
                  <option value="Produce">Produce</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Seafood">Seafood</option>
                  <option value="Meat">Meat</option>
                  <option value="Dry Goods">Dry Goods</option>
                  <option value="Beverages">Beverages</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row: Phone & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-300 font-['Inter']">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0192"
                className="w-full h-11 px-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 focus:border-amber-400 text-sm text-white placeholder:text-zinc-600 focus:outline-none font-['Inter']"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-300 font-['Inter']">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="orders@vendor.com"
                className="w-full h-11 px-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 focus:border-amber-400 text-sm text-white placeholder:text-zinc-600 focus:outline-none font-['Inter']"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-300 font-['Inter']">
              Location / Warehouse Address
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Chicago, IL, USA"
              className="w-full h-11 px-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 focus:border-amber-400 text-sm text-white placeholder:text-zinc-600 focus:outline-none font-['Inter']"
            />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-3">
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
              Add Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
