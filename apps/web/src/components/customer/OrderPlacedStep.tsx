"use client";

import React from "react";
import { Check } from "lucide-react";

interface OrderPlacedStepProps {
  onTrackOrder: () => void;
  orderId?: string;
  tableNumber?: string;
}

export default function OrderPlacedStep({
  onTrackOrder,
  orderId = "LT-2847",
  tableNumber = "Table 08"
}: OrderPlacedStepProps) {
  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 overflow-hidden animate-in fade-in duration-300 font-sans text-white bg-neutral-900">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90 pointer-events-none" />

      {/* Main Content Body */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center px-2 pt-6">
        {/* Animated Checkmark Circle */}
        <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-400 animate-spin-slow opacity-80" />
          <div className="w-24 h-24 rounded-full bg-orange-400/10 border-2 border-orange-400 flex items-center justify-center shadow-[0_0_20px_rgba(251,146,60,0.3)]">
            <Check className="w-12 h-12 text-orange-400 stroke-[3]" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl font-medium font-['Poppins'] leading-7 tracking-wide text-white mb-2">
          Order Placed Successfully
        </h1>

        <p className="text-stone-200 text-sm font-normal font-['Montserrat'] leading-6 max-w-[280px] mb-8">
          Your order has been sent to the kitchen. We&apos;ll notify you when it&apos;s ready.
        </p>

        {/* Order Summary Card */}
        <div className="w-full max-w-[320px] bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-800">
          <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center text-sm font-bold font-['Montserrat']">
            <span>Order Summary</span>
            <span className="text-orange-400">{orderId}</span>
          </div>

          <div className="p-5 space-y-3 text-left text-sm font-['Montserrat']">
            <div className="flex justify-between items-center">
              <span className="text-stone-300 font-normal">Order</span>
              <span className="text-white font-semibold">{orderId}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-stone-300 font-medium">Estimated Preparation</span>
              <span className="text-white font-semibold">15–20 min</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-stone-300 font-normal">Table Number</span>
              <span className="text-white font-semibold">{tableNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Track Order Button */}
      <div className="relative z-10 pb-4 pt-2">
        <button
          onClick={onTrackOrder}
          className="w-full py-4 bg-orange-400 hover:bg-amber-400 rounded-2xl shadow-[0px_8px_20px_0px_rgba(227,172,56,0.35)] text-white text-lg font-semibold font-['Montserrat'] leading-5 transition active:scale-98"
        >
          Track Order
        </button>
      </div>
    </div>
  );
}
