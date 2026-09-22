"use client";

import React, { useState } from "react";
import { ChevronLeft, CreditCard } from "lucide-react";

interface PaymentStepProps {
  onBack: () => void;
  onPay: () => void;
  subtotalAmount?: number;
}

export default function PaymentStep({
  onBack,
  onPay,
  subtotalAmount = 18.19
}: PaymentStepProps) {
  const tax = subtotalAmount * 0.08;
  const serviceCharge = subtotalAmount * 0.05;
  const totalAmount = subtotalAmount + tax + serviceCharge;

  const [cardNumber, setCardNumber] = useState("1234 5678 1234 5678");
  const [name, setName] = useState("Sam Louis");
  const [cardId, setCardId] = useState("Mastercard");
  const [expiry, setExpiry] = useState("07/29");
  const [cvv, setCvv] = useState("215");
  const [selectedCard, setSelectedCard] = useState<number>(0);

  return (
    <div className="relative flex-1 flex flex-col bg-neutral-900 text-white overflow-hidden animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 p-6 pb-2">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-[20px] bg-amber-500/40 text-white flex items-center justify-center hover:bg-amber-500/60 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold font-['Poppins'] leading-7 tracking-wide text-white">
          Complete Payment
        </h1>
      </div>

      {/* Main Scroll Content */}
      <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-28 pt-2">
        {/* Bill Summary Card */}
        <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-800">
          <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800 text-sm font-bold font-['Montserrat']">
            Bill Summary
          </div>
          <div className="p-5 space-y-3 text-sm font-['Montserrat']">
            <div className="flex justify-between items-center text-stone-300">
              <span>Items</span>
              <span className="font-semibold text-white">
                ${subtotalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-stone-300">
              <span>Tax (8%)</span>
              <span className="font-semibold text-white">
                ${tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-stone-300">
              <span>Service Charge (5%)</span>
              <span className="font-semibold text-white">
                ${serviceCharge.toFixed(2)}
              </span>
            </div>

            <div className="border-t border-orange-400/20 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-white">Total</span>
              <span className="text-lg font-bold text-orange-400">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Card Selection */}
        <div>
          <h2 className="text-lg font-semibold font-['Poppins'] text-white mb-3">
            Complete Payment
          </h2>

          <div className="flex gap-3 mb-4">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCard(idx)}
                className={`w-24 h-16 rounded-2xl border-2 flex items-center justify-center transition p-2 ${
                  selectedCard === idx
                    ? "border-orange-400 bg-orange-400/10 shadow-[0_0_10px_rgba(251,146,60,0.4)]"
                    : "border-zinc-800 bg-zinc-900"
                }`}
              >
                <div className="w-full h-full bg-gradient-to-r from-zinc-700 to-slate-800 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-orange-400" />
                </div>
              </button>
            ))}
          </div>

          {/* Interactive Credit Card Preview */}
          <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-amber-200 via-amber-300 to-orange-400 text-white p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold font-['Inter'] uppercase tracking-wider text-black/80">
                Credit
              </span>
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-red-600/90" />
                <div className="w-6 h-6 rounded-full bg-amber-500/90" />
              </div>
            </div>

            <div className="text-base font-bold font-['Inter'] tracking-[0.25em] text-black">
              {cardNumber}
            </div>

            <div className="flex justify-between items-end text-[11px] font-['Inter'] text-black/80">
              <div>
                <span className="text-[9px] uppercase tracking-wider block text-black/60">
                  Card Holder
                </span>
                <span className="font-semibold text-black">{name}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider block text-black/60">
                  Expires
                </span>
                <span className="font-semibold text-black">{expiry}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider block text-black/60">
                  CVV
                </span>
                <span className="font-semibold text-black">{cvv}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Input Form */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-sm font-normal font-['Inter'] text-white/70 block mb-1">
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full bg-transparent border-b-2 border-zinc-700 pb-1 text-lg font-semibold font-['Inter'] text-white focus:outline-none focus:border-orange-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-normal font-['Inter'] text-white/70 block mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b-2 border-zinc-700 pb-1 text-lg font-semibold font-['Inter'] text-white focus:outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="text-sm font-normal font-['Inter'] text-white/70 block mb-1">
                Card ID
              </label>
              <input
                type="text"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                className="w-full bg-transparent border-b-2 border-zinc-700 pb-1 text-lg font-semibold font-['Inter'] text-white focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-normal font-['Inter'] text-white/70 block mb-1">
                Expiration Date
              </label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full bg-transparent border-b-2 border-zinc-700 pb-1 text-lg font-semibold font-['Inter'] text-white focus:outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="text-sm font-normal font-['Inter'] text-white/70 block mb-1">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full bg-transparent border-b-2 border-zinc-700 pb-1 text-lg font-semibold font-['Inter'] text-white focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Pay Button */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 p-4">
        <button
          onClick={onPay}
          className="w-full py-4 bg-orange-400 hover:bg-amber-400 rounded-2xl shadow-[0px_8px_20px_0px_rgba(227,172,56,0.35)] text-white text-lg font-semibold font-['Montserrat'] leading-5 transition active:scale-98"
        >
          Pay
        </button>
      </div>
    </div>
  );
}
