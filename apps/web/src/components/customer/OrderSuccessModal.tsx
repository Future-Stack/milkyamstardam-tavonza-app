"use client";

import React from "react";
import { CheckCircle2, Utensils } from "lucide-react";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onReset: () => void;
  tableNumber?: string;
}

export default function OrderSuccessModal({
  isOpen,
  onReset,
  tableNumber = "Table 08"
}: OrderSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-xs text-center shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h3 className="text-xl font-extrabold text-white mb-1">
          Order Sent to Kitchen!
        </h3>

        <p className="text-xs text-stone-300 mb-2">
          Your order for <strong className="text-[#E5A853]">{tableNumber}</strong> has been received by our chefs.
        </p>

        <p className="text-[11px] text-stone-500 mb-6">
          Estimated preparation time: 15–20 mins.
        </p>

        <button
          onClick={onReset}
          className="w-full py-3.5 bg-[#E5A853] hover:bg-amber-400 text-white font-extrabold text-xs rounded-xl shadow hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2"
        >
          <Utensils className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
}
