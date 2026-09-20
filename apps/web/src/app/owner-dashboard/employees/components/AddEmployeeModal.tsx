'use client';

import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Employee, EmployeeRole, EmployeeShiftType } from '../types';

export interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newEmployee: Omit<Employee, 'id'>) => void;
}

export default function AddEmployeeModal({
  isOpen,
  onClose,
  onAdd,
}: AddEmployeeModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<EmployeeRole>('Waiter');
  const [shiftType, setShiftType] = useState<EmployeeShiftType>('Morning');
  const [phone, setPhone] = useState('+1 555-0000');
  const [email, setEmail] = useState('employee@tavonza.com');
  const [salary, setSalary] = useState('3500');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let shiftHours = '10:00 AM – 6:00 PM';
    if (shiftType === 'Evening') shiftHours = '3:00 PM – 11:00 PM';
    else if (shiftType === 'Night') shiftHours = '5:00 PM – 1:00 AM';
    else if (shiftType === 'Full Day') shiftHours = '9:00 AM – 9:00 PM';

    onAdd({
      name: name.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role,
      status: 'On Shift',
      shiftHours,
      shiftType,
      rating: 5.0,
      tablesToday: 0,
      accuracy: 100,
      phone: phone.trim(),
      email: email.trim(),
      bio: `${role} at Tavonza Downtown Branch.`,
      notes: 'New team member onboarded.',
      hireDate: 'Aug 2026',
      salary: Number(salary) || 3500,
    });

    setName('');
    onClose();
  };

  const roles: EmployeeRole[] = [
    'Waiter',
    'Head Waiter',
    'Chef',
    'Head Chef',
    'Bartender',
    'Barista',
    'Hostess',
    'Manager',
  ];

  const shifts: EmployeeShiftType[] = ['Morning', 'Evening', 'Night', 'Full Day'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-[440px] bg-[#141416] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col font-['Inter'] animate-in zoom-in-95 duration-150 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header matching Screenshot 2 */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-white text-lg font-bold font-['Plus_Jakarta_Sans']">
            Add New Employee
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body matching Screenshot 2 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {/* Full Name * */}
          <div className="space-y-1.5">
            <label className="text-white text-sm font-medium">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Lee"
              className="w-full h-10 px-3.5 bg-zinc-800/90 rounded-xl border border-zinc-700/70 text-stone-200 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder-zinc-500"
              required
            />
          </div>

          {/* Role & Shift Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-white text-sm font-medium">Role</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as EmployeeRole)}
                  className="w-full h-10 px-3.5 pr-8 bg-zinc-800/90 rounded-xl border border-zinc-700/70 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r} value={r} className="bg-zinc-900 text-white">
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-white text-sm font-medium">Shift</label>
              <div className="relative">
                <select
                  value={shiftType}
                  onChange={(e) => setShiftType(e.target.value as EmployeeShiftType)}
                  className="w-full h-10 px-3.5 pr-8 bg-zinc-800/90 rounded-xl border border-zinc-700/70 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
                >
                  {shifts.map((s) => (
                    <option key={s} value={s} className="bg-zinc-900 text-white">
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Phone & Email Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-white text-sm font-medium">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0000"
                className="w-full h-10 px-3.5 bg-zinc-800/90 rounded-xl border border-zinc-700/70 text-stone-200 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder-zinc-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="employee@tavonza.com"
                className="w-full h-10 px-3.5 bg-zinc-800/90 rounded-xl border border-zinc-700/70 text-stone-200 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder-zinc-500"
              />
            </div>
          </div>

          {/* Monthly Salary ($) */}
          <div className="space-y-1.5">
            <label className="text-white text-sm font-medium">Monthly Salary ($)</label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 3500"
              className="w-full h-10 px-3.5 bg-zinc-800/90 rounded-xl border border-zinc-700/70 text-stone-200 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder-zinc-500"
            />
          </div>

          {/* Footer Action Buttons matching Screenshot 2 */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-zinc-700/80 bg-zinc-900/60 text-slate-400 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-10 bg-[#f59e0b] hover:bg-amber-400 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center"
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
