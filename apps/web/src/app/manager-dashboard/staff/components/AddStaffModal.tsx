'use client';

import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { StaffMember, StaffRole, AddStaffFormData } from '../../types';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStaff: (newStaff: StaffMember) => void;
}

const roleList: StaffRole[] = ['Waiter', 'Chef', 'Bartender', 'Host', 'Manager', 'Busser'];
const shiftList = [
  '8am - 4pm',
  '9am - 5pm',
  '12pm - 8pm',
  '7am - 3pm',
  '11am - 7pm',
  '4pm - 12am',
];

export const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  onAddStaff,
}) => {
  const [formData, setFormData] = useState<AddStaffFormData>({
    firstName: '',
    lastName: '',
    role: 'Waiter',
    shift: '8am - 4pm',
    phone: '',
    email: '',
    startDate: new Date().toISOString().split('T')[0],
    hourlyRate: '18.00',
    emergencyContact: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const initials = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      initials,
      role: formData.role,
      status: 'Active',
      shift: formData.shift,
      tablesCount: formData.role === 'Waiter' ? 2 : 0,
      ordersCount: 0,
      rating: 5.0,
      phone: formData.phone.trim() || '+1 (555) 000-0000',
      email: formData.email.trim(),
      hourlyRate: parseFloat(formData.hourlyRate) || 18.0,
      startDate: formData.startDate,
      emergencyContact: formData.emergencyContact.trim(),
    };

    onAddStaff(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 lg:left-72 top-20 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-black border border-white/15 rounded-2xl p-6 shadow-2xl space-y-6 font-['Inter']">
        {/* Header matching Screenshot 2 */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-white text-xl font-bold font-['Inter']">
              Add Staff Member
            </h2>
            <p className="text-zinc-400 text-sm font-normal font-['Inter'] mt-0.5">
              Register a new team member to the system
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="Emma"
                className={`w-full h-10 px-3.5 bg-zinc-800/80 border ${
                  errors.firstName ? 'border-red-500' : 'border-white/10'
                } rounded-xl text-base text-white placeholder:text-zinc-600 focus:outline-amber-500/50 transition-colors`}
              />
              {errors.firstName && (
                <span className="text-xs text-red-400 mt-1 block">
                  {errors.firstName}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Wilson"
                className={`w-full h-10 px-3.5 bg-zinc-800/80 border ${
                  errors.lastName ? 'border-red-500' : 'border-white/10'
                } rounded-xl text-base text-white placeholder:text-zinc-600 focus:outline-amber-500/50 transition-colors`}
              />
              {errors.lastName && (
                <span className="text-xs text-red-400 mt-1 block">
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Role / Position & Shift */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Role / Position
              </label>
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as StaffRole })
                  }
                  className="w-full h-10 px-3.5 bg-zinc-800/80 border border-white/10 rounded-xl text-base text-white appearance-none cursor-pointer focus:outline-amber-500/50 pr-9"
                >
                  {roleList.map((r) => (
                    <option key={r} value={r} className="bg-zinc-900 text-white">
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Shift
              </label>
              <div className="relative">
                <select
                  value={formData.shift}
                  onChange={(e) =>
                    setFormData({ ...formData, shift: e.target.value })
                  }
                  className="w-full h-10 px-3.5 bg-zinc-800/80 border border-white/10 rounded-xl text-base text-white appearance-none cursor-pointer focus:outline-amber-500/50 pr-9"
                >
                  {shiftList.map((s) => (
                    <option key={s} value={s} className="bg-zinc-900 text-white">
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 3: Phone Number & Email Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+1 (555) 000-0000"
                className="w-full h-10 px-3.5 bg-zinc-800/80 border border-white/10 rounded-xl text-base text-white placeholder:text-zinc-600 focus:outline-amber-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="emma@restaurant.com"
                className={`w-full h-10 px-3.5 bg-zinc-800/80 border ${
                  errors.email ? 'border-red-500' : 'border-white/10'
                } rounded-xl text-base text-white placeholder:text-zinc-600 focus:outline-amber-500/50 transition-colors`}
              />
              {errors.email && (
                <span className="text-xs text-red-400 mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          {/* Row 4: Start Date & Hourly Rate ($) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full h-10 px-3.5 bg-zinc-800/80 border border-white/10 rounded-xl text-base text-white focus:outline-amber-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                step="0.50"
                value={formData.hourlyRate}
                onChange={(e) =>
                  setFormData({ ...formData, hourlyRate: e.target.value })
                }
                placeholder="18.00"
                className="w-full h-10 px-3.5 bg-zinc-800/80 border border-white/10 rounded-xl text-base text-white placeholder:text-zinc-600 focus:outline-amber-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Row 5: Emergency Contact */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Emergency Contact
            </label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) =>
                setFormData({ ...formData, emergencyContact: e.target.value })
              }
              placeholder="Phone number"
              className="w-full h-10 px-3.5 bg-zinc-800/80 border border-white/10 rounded-xl text-base text-white placeholder:text-zinc-600 focus:outline-amber-500/50 transition-colors"
            />
          </div>

          {/* Action Buttons matching Screenshot 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            <button
              type="submit"
              className="h-11 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl text-base flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-amber-500/25"
            >
              <span>+ Add Staff Member</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-11 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl text-base transition-colors border border-white/10 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
