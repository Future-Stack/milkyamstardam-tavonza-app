"use client";

import React from "react";
import { ChevronLeft, Clock, Check, Utensils, Package, Bell } from "lucide-react";

interface TrackOrderStepProps {
  onBack: () => void;
  onCompletePayment: () => void;
}

export default function TrackOrderStep({
  onBack,
  onCompletePayment
}: TrackOrderStepProps) {
  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 overflow-hidden animate-in fade-in duration-300 font-sans text-white bg-neutral-900">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 pt-2">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-[20px] bg-amber-500/40 text-white flex items-center justify-center hover:bg-amber-500/60 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold font-['Poppins'] leading-7 tracking-wide text-white">
          Track Your Order
        </h1>
      </div>

      {/* Scrollable Center Container */}
      <div className="relative z-10 my-auto py-6 space-y-6">
        {/* Estimated Time Header Card */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-orange-400 text-white flex items-center justify-center mb-2 shadow-lg shadow-orange-400/20">
            <Clock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-stone-200 text-xs font-normal font-['Montserrat'] uppercase leading-4 tracking-wide">
            ESTIMATED TIME
          </span>
          <span className="text-orange-400 text-3xl font-bold font-['Poppins'] leading-8 mt-1">
            18 min
          </span>
        </div>

        {/* Timeline Progress Card */}
        <div className="w-full bg-stone-950 rounded-2xl border border-zinc-800/40 p-5 space-y-5 shadow-xl">
          {/* Step 1: Order Received (Completed) */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="w-0.5 h-8 bg-orange-400 mt-1" />
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold font-['Montserrat'] leading-5">
                Order Received
              </h3>
              <p className="text-neutral-500 text-xs font-normal font-['Montserrat'] leading-4">
                Completed
              </p>
            </div>
          </div>

          {/* Step 2: Preparing (In progress) */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center">
                <Utensils className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="w-0.5 h-8 bg-yellow-800/40 mt-1" />
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold font-['Montserrat'] leading-5">
                Preparing
              </h3>
              <p className="text-neutral-500 text-xs font-normal font-['Montserrat'] leading-4">
                In progress...
              </p>
            </div>
          </div>

          {/* Step 3: Ready (Pending) */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-orange-100/20 border-2 border-yellow-800/30 text-stone-400 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <div className="w-0.5 h-8 bg-yellow-800/40 mt-1" />
            </div>
            <div className="py-1">
              <h3 className="text-zinc-500 text-sm font-semibold font-['Montserrat'] leading-5">
                Ready
              </h3>
            </div>
          </div>

          {/* Step 4: Served (Pending) */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-orange-100/20 border-2 border-yellow-800/30 text-stone-400 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
            </div>
            <div className="py-1">
              <h3 className="text-zinc-500 text-sm font-semibold font-['Montserrat'] leading-5">
                Served
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Complete Payment Button */}
      <div className="relative z-10 pb-4 pt-2">
        <button
          onClick={onCompletePayment}
          className="w-full py-4 bg-orange-400 hover:bg-amber-400 rounded-2xl shadow-[0px_8px_20px_0px_rgba(227,172,56,0.35)] text-white text-lg font-semibold font-['Montserrat'] leading-5 transition active:scale-98"
        >
          Complete Payment
        </button>
      </div>
    </div>
  );
}
