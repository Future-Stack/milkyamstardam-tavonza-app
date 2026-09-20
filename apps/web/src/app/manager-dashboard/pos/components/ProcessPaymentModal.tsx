'use client';

import React, { useState } from 'react';
import {
  X,
  CreditCard,
  DollarSign,
  QrCode,
  CheckCircle2,
} from 'lucide-react';
import { POSPaymentMethod } from '../../types';

interface ProcessPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  tax: number;
  total: number;
  initialMethod?: POSPaymentMethod;
  onConfirmPayment: (method: POSPaymentMethod, amount: number) => void;
}

export const ProcessPaymentModal: React.FC<ProcessPaymentModalProps> = ({
  isOpen,
  onClose,
  subtotal,
  tax,
  total,
  initialMethod = 'Card',
  onConfirmPayment,
}) => {
  const [method, setMethod] = useState<POSPaymentMethod>(initialMethod);
  const [cashReceived, setCashReceived] = useState<number>(Math.ceil(total));
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const changeDue = Math.max(0, cashReceived - total);

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmPayment(method, total);
    }, 600);
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
        {/* Header (Matching Figma & Screenshot 1) */}
        <div className="flex items-start justify-between border-b border-white/5 pb-3">
          <div>
            <h3 className="text-slate-200 text-lg font-bold font-['Plus_Jakarta_Sans'] leading-5">
              Process Payment
            </h3>
            <p className="text-slate-400 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4 mt-0.5">
              Select payment method to complete the transaction
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-amber-500 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Cost Breakdown Card */}
        <div className="p-3.5 bg-gray-900/60 rounded-xl border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-sm font-normal font-['Plus_Jakarta_Sans'] text-slate-300">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-normal font-['Plus_Jakarta_Sans'] text-slate-300">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="pt-2 border-t border-white/5 flex justify-between items-center">
            <span className="text-slate-200 text-sm font-bold font-['Plus_Jakarta_Sans']">
              Total
            </span>
            <span className="text-amber-500 text-base font-bold font-['Plus_Jakarta_Sans']">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-1.5">
          <label className="text-slate-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Card Option */}
            <button
              type="button"
              onClick={() => setMethod('Card')}
              className={`p-2.5 rounded-[6px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                method === 'Card'
                  ? 'bg-yellow-500/20 outline outline-1 outline-offset-[-1px] outline-amber-500/40 text-white shadow-sm'
                  : 'bg-gray-900/40 outline outline-1 outline-offset-[-1px] outline-white/5 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-xs font-medium font-['Plus_Jakarta_Sans'] leading-tight">
                Card
              </span>
            </button>

            {/* Cash Option */}
            <button
              type="button"
              onClick={() => setMethod('Cash')}
              className={`p-2.5 rounded-[6px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                method === 'Cash'
                  ? 'bg-yellow-500/20 outline outline-1 outline-offset-[-1px] outline-amber-500/40 text-white shadow-sm'
                  : 'bg-gray-900/40 outline outline-1 outline-offset-[-1px] outline-white/5 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium font-['Plus_Jakarta_Sans'] leading-tight">
                Cash
              </span>
            </button>

            {/* QR / Digital Option */}
            <button
              type="button"
              onClick={() => setMethod('QR / Digital')}
              className={`p-2.5 rounded-[6px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                method === 'QR / Digital'
                  ? 'bg-yellow-500/20 outline outline-1 outline-offset-[-1px] outline-amber-500/40 text-white shadow-sm'
                  : 'bg-gray-900/40 outline outline-1 outline-offset-[-1px] outline-white/5 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span className="text-xs font-medium font-['Plus_Jakarta_Sans'] leading-tight">
                QR / Digital
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Terminal / Method Instructions Box */}
        <div className="p-3.5 bg-gray-900/30 rounded-[6px] outline outline-1 outline-offset-[-1px] outline-white/5 flex flex-col items-center justify-center text-center min-h-[90px]">
          {method === 'Card' && (
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <p className="text-slate-400 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4">
                Insert, tap, or swipe card on terminal
              </p>
            </div>
          )}

          {method === 'Cash' && (
            <div className="w-full flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Received:</span>
                <span className="font-semibold text-white">${cashReceived.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center">
                {[Math.ceil(total), 20, 50, 100].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCashReceived(val)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      cashReceived === val
                        ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
              {changeDue > 0 && (
                <div className="text-sm text-emerald-400 pt-1 border-t border-white/5 flex justify-between">
                  <span>Change due:</span>
                  <span className="font-bold">${changeDue.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {method === 'QR / Digital' && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-md p-1 flex items-center justify-center shadow-md">
                <QrCode className="w-10 h-10 text-black" />
              </div>
              <p className="text-slate-400 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-tight">
                Customer can scan via Apple Pay, Google Pay, or Banking App
              </p>
            </div>
          )}
        </div>

        {/* Action Button: Confirm Payment */}
        <button
          type="button"
          disabled={isProcessing}
          onClick={handleConfirm}
          className="w-full h-10 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white text-sm sm:text-base font-semibold font-['Plus_Jakarta_Sans'] rounded-[6px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-yellow-500/25 active:scale-[0.99] disabled:opacity-50"
        >
          {isProcessing ? (
            <span>Processing...</span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Confirm Payment · ${total.toFixed(2)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
