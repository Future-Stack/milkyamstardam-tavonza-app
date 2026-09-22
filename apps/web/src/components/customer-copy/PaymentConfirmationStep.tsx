"use client";

import React from "react";
import { ChevronLeft, Check, CreditCard, ArrowLeft } from "lucide-react";

interface PaymentConfirmationStepProps {
  onBackToHome: () => void;
  onGoToFeedback: () => void;
  transactionId?: string;
  totalPaid?: number;
}

export default function PaymentConfirmationStep({
  onBackToHome,
  onGoToFeedback,
  transactionId = "#ID-22465476578390-3789",
  totalPaid = 50.97
}: PaymentConfirmationStepProps) {
  return (
    <div className="relative flex-1 flex flex-col bg-neutral-900 text-white overflow-hidden animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 p-6 pb-2">
        <button
          onClick={onBackToHome}
          className="w-9 h-9 rounded-[20px] bg-amber-500/40 text-white flex items-center justify-center hover:bg-amber-500/60 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold font-['Poppins'] leading-7 tracking-wide text-white">
          Confirmation
        </h1>
      </div>

      {/* Main Content Scroll */}
      <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-28 pt-4 flex flex-col items-center">
        {/* Checkmark Emblem */}
        <div className="w-20 h-20 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.5)]">
          <Check className="w-10 h-10 stroke-[3]" />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold font-['SF_Pro'] text-white mb-1">
            Thank you!
          </h2>
          <p className="text-stone-200 text-sm font-normal font-['SF_Pro'] leading-relaxed">
            Your transaction was successful
            <br />
            <span className="text-stone-400 text-xs">{transactionId}</span>
          </p>
        </div>

        {/* Receipt Ticket Card */}
        <div className="w-full max-w-[320px] bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden space-y-4">
          <div className="space-y-2.5 text-sm font-['SF_Pro']">
            <div className="flex justify-between items-center text-zinc-300">
              <span>Date</span>
              <span className="text-white font-medium">01/24/2023</span>
            </div>

            <div className="flex justify-between items-center text-zinc-300">
              <span>Time</span>
              <span className="text-white font-medium">10:15 AM</span>
            </div>

            <div className="flex justify-between items-center text-zinc-300">
              <span>To</span>
              <span className="text-white font-medium">Amanda</span>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
            <span className="text-white text-lg font-bold font-['SF_Pro']">
              Total
            </span>
            <span className="text-white text-xl font-bold font-['SF_Pro']">
              ${totalPaid.toFixed(2)}
            </span>
          </div>

          {/* Payment Method Badge */}
          <div className="p-3 bg-zinc-950 rounded-xl border border-amber-500/40 flex items-center gap-3">
            <div className="w-10 h-7 rounded-md bg-gradient-to-r from-zinc-700 to-slate-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Tavonza</span>
              <span className="text-[10px] text-stone-400">amanda@okaxis</span>
            </div>
          </div>

          {/* Ticket Barcode & PAID Tag */}
          <div className="border-t border-dashed border-zinc-700 pt-4 flex justify-between items-center">
            <div className="flex gap-0.5 items-center h-10">
              <div className="w-1 h-full bg-white" />
              <div className="w-0.5 h-full bg-white ml-0.5" />
              <div className="w-1.5 h-full bg-white ml-1" />
              <div className="w-0.5 h-full bg-white ml-0.5" />
              <div className="w-2 h-full bg-white ml-1" />
              <div className="w-1 h-full bg-white ml-0.5" />
              <div className="w-0.5 h-full bg-white ml-1" />
              <div className="w-1.5 h-full bg-white ml-0.5" />
            </div>

            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500 text-amber-500 text-xs font-bold rounded-lg tracking-wider">
              PAID
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Buttons */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 p-4 space-y-2">
        <button
          onClick={onGoToFeedback}
          className="w-full py-3.5 bg-orange-400 hover:bg-amber-400 rounded-2xl shadow-[0px_8px_20px_0px_rgba(227,172,56,0.35)] text-white text-lg font-semibold font-['Montserrat'] leading-5 transition active:scale-98 flex items-center justify-center gap-2"
        >
          <span>Provide Feedback</span>
        </button>

        <button
          onClick={onBackToHome}
          className="w-full py-2.5 text-stone-400 hover:text-white text-xs font-medium text-center transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
