'use client';

import React from 'react';
import { X, Award, Star, Mail, Phone, Calendar, MapPin, AlertCircle, Heart, DollarSign } from 'lucide-react';
import { ManagerCustomer } from '../../types';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: ManagerCustomer | null;
  onSendEmail?: (email: string) => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  customer,
  onSendEmail,
}) => {
  if (!isOpen || !customer) return null;

  return (
    <div
      className="fixed inset-0 lg:left-72 top-20 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-neutral-800 rounded-2xl outline outline-1 outline-offset-[-1px] outline-white/25 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/5 outline outline-1 outline-white/10 flex items-center justify-center text-white text-lg font-bold font-['Plus_Jakarta_Sans']">
              {customer.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white text-xl font-bold font-['Inter']">
                  {customer.name}
                </h2>
                {customer.isVIP && (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    VIP Member
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < customer.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-zinc-600'
                    }`}
                  />
                ))}
                <span className="text-sm text-zinc-400 ml-1.5">
                  5.0 customer loyalty score
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-neutral-900 rounded-xl border border-white/10 text-center">
            <div className="text-blue-400 text-lg font-bold font-['Inter']">
              {customer.visits}
            </div>
            <div className="text-zinc-500 text-sm mt-0.5 font-['Plus_Jakarta_Sans']">
              Total Visits
            </div>
          </div>
          <div className="p-3 bg-neutral-900 rounded-xl border border-white/10 text-center">
            <div className="text-amber-400 text-lg font-bold font-['Inter']">
              ${customer.spent.toLocaleString()}
            </div>
            <div className="text-zinc-500 text-sm mt-0.5 font-['Plus_Jakarta_Sans']">
              Lifetime Spent
            </div>
          </div>
          <div className="p-3 bg-neutral-900 rounded-xl border border-white/10 text-center">
            <div className="text-emerald-400 text-lg font-bold font-['Inter']">
              {customer.lastVisit}
            </div>
            <div className="text-zinc-500 text-sm mt-0.5 font-['Plus_Jakarta_Sans']">
              Last Visited
            </div>
          </div>
        </div>

        {/* Contact & Table Info */}
        <div className="bg-neutral-900/70 rounded-xl p-3.5 border border-white/10 space-y-2 text-sm font-['Plus_Jakarta_Sans']">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-2 text-zinc-400">
              <Mail className="w-3.5 h-3.5 text-zinc-500" />
              Email:
            </span>
            <span className="font-mono text-white">{customer.email}</span>
          </div>
          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-2 text-zinc-400">
              <Phone className="w-3.5 h-3.5 text-zinc-500" />
              Phone:
            </span>
            <span className="font-mono text-white">{customer.phone}</span>
          </div>
          {customer.preferredTable && (
            <div className="flex items-center justify-between text-zinc-300">
              <span className="flex items-center gap-2 text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                Preferred Table:
              </span>
              <span className="text-amber-400 font-medium">
                {customer.preferredTable}
              </span>
            </div>
          )}
          {customer.dob && (
            <div className="flex items-center justify-between text-zinc-300">
              <span className="flex items-center gap-2 text-zinc-400">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Birthday:
              </span>
              <span className="text-white">{customer.dob}</span>
            </div>
          )}
        </div>

        {/* Preferences & Allergies */}
        {customer.dietaryPreferences && (
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-sm text-amber-300/90 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-400">Dietary Preferences:</strong>{' '}
              {customer.dietaryPreferences}
            </div>
          </div>
        )}

        {/* Notes */}
        {customer.notes && (
          <div className="p-3 bg-neutral-900 rounded-xl border border-white/10 text-sm text-zinc-300 space-y-1">
            <div className="text-zinc-400 font-semibold uppercase text-xs tracking-wider">
              Manager & Hospitality Notes:
            </div>
            <p className="text-zinc-200">{customer.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              if (onSendEmail) onSendEmail(customer.email);
            }}
            className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Send Email</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-neutral-700/60 hover:bg-neutral-700 text-slate-300 text-sm font-medium rounded-xl outline outline-1 outline-white/10 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfileModal;
