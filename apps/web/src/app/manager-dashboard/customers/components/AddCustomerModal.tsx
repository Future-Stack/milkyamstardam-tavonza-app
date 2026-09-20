'use client';

import React, { useState } from 'react';
import { X, Plus, Award, ChevronDown } from 'lucide-react';
import { AddCustomerFormData } from '../../types';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (data: AddCustomerFormData) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onAddCustomer,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [preferredTable, setPreferredTable] = useState('T-05 (window side)');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [notes, setNotes] = useState('');
  const [isVIP, setIsVIP] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      return;
    }
    onAddCustomer({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || '+1 (555) 000-0000',
      email: email.trim() || `${firstName.toLowerCase()}@email.com`,
      dob: dob.trim() || undefined,
      preferredTable: preferredTable.trim() || undefined,
      dietaryPreferences: dietaryPreferences.trim() || undefined,
      notes: notes.trim() || undefined,
      isVIP,
    });
    // Reset form
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setDob('');
    setPreferredTable('T-05 (window side)');
    setDietaryPreferences('');
    setNotes('');
    setIsVIP(false);
  };

  return (
    <div
      className="fixed inset-0 lg:left-72 top-20 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-neutral-800 rounded-2xl outline outline-1 outline-offset-[-1px] outline-white/25 shadow-2xl p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching screenshot */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="text-slate-200 text-base sm:text-lg font-bold font-['Plus_Jakarta_Sans'] leading-5">
              Add Customer
            </h2>
            <p className="text-slate-400 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4 mt-0.5">
              Register a new customer profile
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 font-['Plus_Jakarta_Sans']">
          {/* Row 1: First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-200 text-xs font-semibold uppercase leading-4 tracking-wide mb-1">
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Alexandra"
                className="w-full h-8 px-2.5 bg-neutral-900 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-white/10 text-white text-sm placeholder:text-neutral-500 focus:outline-amber-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-neutral-200 text-xs font-semibold uppercase leading-4 tracking-wide mb-1">
                Last Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Turner"
                className="w-full h-8 px-2.5 bg-neutral-900 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-white/10 text-white text-sm placeholder:text-neutral-500 focus:outline-amber-400 transition-all"
              />
            </div>
          </div>

          {/* Row 2: Phone Number & Email Address */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-200 text-xs font-semibold uppercase leading-4 tracking-wide mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full h-8 px-2.5 bg-neutral-900 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-white/10 text-white text-sm placeholder:text-neutral-500 focus:outline-amber-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-neutral-200 text-xs font-semibold uppercase leading-4 tracking-wide mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@email.com"
                className="w-full h-8 px-2.5 bg-neutral-900 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-white/10 text-white text-sm placeholder:text-neutral-500 focus:outline-amber-400 transition-all"
              />
            </div>
          </div>

          {/* Row 3: Date of Birth & Preferred Table */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-200 text-xs font-semibold uppercase leading-4 tracking-wide mb-1">
                Date of Birth
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full h-8 px-2.5 bg-neutral-900 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-white/10 text-white text-sm focus:outline-amber-400 transition-all scheme-dark"
                />
              </div>
            </div>
            <div>
              <label className="block text-neutral-200 text-xs font-semibold uppercase leading-4 tracking-wide mb-1">
                Preferred Table
              </label>
              <input
                type="text"
                value={preferredTable}
                onChange={(e) => setPreferredTable(e.target.value)}
                placeholder="T-05 (window side)"
                className="w-full h-8 px-2.5 bg-neutral-900 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-white/10 text-white text-sm placeholder:text-neutral-500 focus:outline-amber-400 transition-all"
              />
            </div>
          </div>

          {/* Row 4: Dietary Preferences / Allergies */}
          <div>
            <label className="block text-neutral-200 text-xs font-semibold uppercase leading-4 tracking-wide mb-1">
              Dietary Preferences / Allergies
            </label>
            <input
              type="text"
              value={dietaryPreferences}
              onChange={(e) => setDietaryPreferences(e.target.value)}
              placeholder="Vegetarian, nut allergy..."
              className="w-full h-8 px-2.5 bg-neutral-900 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-white/10 text-white text-sm placeholder:text-neutral-500 focus:outline-amber-400 transition-all"
            />
          </div>

          {/* Row 5: Notes */}
          <div>
            <label className="block text-neutral-200 text-xs font-semibold uppercase leading-4 tracking-wide mb-1">
              Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Favourite dish, special occasions, preferences..."
              className="w-full h-8 px-2.5 bg-neutral-900 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-white/10 text-white text-sm placeholder:text-neutral-500 focus:outline-amber-400 transition-all"
            />
          </div>

          {/* Row 6: VIP Member Card with Switch matching Figma screenshot */}
          <div className="p-2.5 bg-neutral-900 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-white/10 flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-slate-200 text-sm font-medium">
                  VIP Member
                </span>
              </div>
              <span className="text-neutral-400 text-xs mt-0.5">
                Receives priority seating and offers
              </span>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => setIsVIP(!isVIP)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer relative ${
                isVIP ? 'bg-amber-400' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                  isVIP ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Action Buttons: Add Customer & Cancel */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Customer</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-neutral-700/60 hover:bg-neutral-700 text-slate-300 text-sm font-medium rounded-xl outline outline-1 outline-offset-[-1px] outline-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
