'use client';

import React from 'react';
import { X, Check, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { POSPaymentMethod } from '../../types';

interface PaymentCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: POSPaymentMethod;
  amount: number;
  onDone: () => void;
}

export const PaymentCompleteModal: React.FC<PaymentCompleteModalProps> = ({
  isOpen,
  onClose,
  method,
  amount,
  onDone,
}) => {
  if (!isOpen) return null;

  const handlePrintReceipt = () => {
    toast.success('Receipt sent to counter thermal printer!');
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
        {/* Header (Screenshot 2) */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-slate-200 text-lg font-bold font-['Plus_Jakarta_Sans'] leading-5">
            Payment Complete
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Center Success Badge & Text */}
        <div className="flex flex-col items-center justify-center py-3 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 mb-3">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <h4 className="text-white text-xl font-bold font-['Plus_Jakarta_Sans']">
            Payment Successful!
          </h4>
          <p className="text-slate-400 text-sm font-normal font-['Plus_Jakarta_Sans'] mt-0.5">
            Transaction completed for ${amount.toFixed(2)}
          </p>
        </div>

        {/* Transaction Summary Card */}
        <div className="p-3.5 bg-gray-900/60 rounded-xl border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-sm font-normal font-['Plus_Jakarta_Sans'] text-slate-300">
            <span>Method</span>
            <span className="font-medium text-white">{method}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-normal font-['Plus_Jakarta_Sans'] text-slate-300">
            <span>Amount</span>
            <span className="font-bold text-yellow-500 text-base">
              ${amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons: Print Receipt & Done */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handlePrintReceipt}
            className="h-10 px-4 bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white text-sm sm:text-base font-medium rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            type="button"
            onClick={onDone}
            className="h-10 px-4 bg-yellow-500 hover:bg-yellow-400 text-white text-sm sm:text-base font-semibold rounded-lg flex items-center justify-center transition-colors cursor-pointer shadow-lg shadow-yellow-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
