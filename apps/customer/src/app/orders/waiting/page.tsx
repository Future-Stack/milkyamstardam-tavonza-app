'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Clock, AlertCircle, CheckCircle, ChefHat } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import DesktopSplitLayout from '@/components/layout/DesktopSplitLayout';

function WaitingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tableNumber } = useCart();

  const activeTable = searchParams.get('table') || tableNumber || 'Table 08';
  const orderId = searchParams.get('order') || 'LT-2847';

  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Auto-advance simulation after 8 seconds (or click the quick simulation button)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => {
        if (prev >= 8) {
          clearInterval(timer);
          router.push(`/orders/confirmed?table=${encodeURIComponent(activeTable)}&order=${encodeURIComponent(orderId)}`);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, activeTable, orderId]);

  const handleCancelOrder = () => {
    router.push(`/order-unavailable?table=${encodeURIComponent(activeTable)}&reason=cancelled`);
  };

  const handleManualAccept = () => {
    router.push(`/orders/confirmed?table=${encodeURIComponent(activeTable)}&order=${encodeURIComponent(orderId)}`);
  };

  return (
    <DesktopSplitLayout
      imageSrc="/images/seabass.jpg"
      imageAlt="Tavonza Kitchen"
      badgeText="Kitchen Queue"
      activeTable={activeTable}
      headline={
        <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight font-poppins">
          Order Sent to Kitchen! <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
            Awaiting Confirmation
          </span>
        </h1>
      }
      subheadline="Our kitchen staff is reviewing your table order. Once accepted by your server, live preparation begins immediately."
      sideFooterExtra={
        <div className="p-4 bg-neutral-900/80 border border-neutral-700/60 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-xs font-semibold font-montserrat">Order {orderId}</span>
              <span className="text-yellow-400 text-sm font-bold">Elapsed: {secondsElapsed}s / 8s</span>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-mono font-medium animate-pulse">
            Queued
          </span>
        </div>
      }
    >
      <div className="w-full flex flex-col gap-6">
        {/* Top Header / Back Button */}
        <header className="w-full flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => router.push(`/menu?table=${encodeURIComponent(activeTable)}`)}
            className="w-8 h-8 bg-[#191818] border border-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-800 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>

          <span className="text-xs text-zinc-400 font-montserrat">
            Order: <span className="text-white font-medium">{orderId}</span>
          </span>
        </header>

        {/* Center Content: Status & Summary */}
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Animated Hourglass / Confirmation Indicator */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-yellow-400/10 border-2 border-dashed border-yellow-400/60 flex items-center justify-center animate-spin-slow">
            <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 animate-pulse" />
          </div>

          <div className="flex flex-col gap-2 max-w-sm">
            <h1 className="text-white text-xl sm:text-2xl font-medium font-poppins tracking-wide">
              Waiting for waiter&apos;s confirmation
            </h1>
            <p className="text-[#828282] text-xs sm:text-sm font-inter font-normal leading-relaxed">
              Your order has been sent to the kitchen. We&apos;ll notify you as soon as it&apos;s confirmed.
            </p>
          </div>
        </div>

        {/* ORDER SUMMARY CARD */}
        <div className="w-full bg-[#141414] border border-[#1A1A1A] rounded-xl overflow-hidden shadow-2xl">
          <div className="px-5 py-3.5 bg-[#141414] border-b border-[#1A1A1A] flex items-center justify-between">
            <span className="text-white text-sm font-semibold font-montserrat">
              Order Summary
            </span>
            <span className="text-white text-sm font-medium font-inter">
              {orderId}
            </span>
          </div>

          <div className="p-5 flex flex-col gap-3.5 text-sm font-montserrat">
            <div className="flex items-center justify-between text-white/90">
              <span className="text-zinc-400 font-normal">Order ID</span>
              <span className="text-white font-semibold">{orderId}</span>
            </div>

            <div className="flex items-center justify-between text-white/90">
              <span className="text-zinc-400 font-normal">Table</span>
              <span className="text-white font-semibold">{activeTable}</span>
            </div>

            <div className="flex items-center justify-between text-white/90">
              <span className="text-zinc-400 font-normal">Status</span>
              <span className="text-amber-400 font-medium">Pending Kitchen Approval</span>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="w-full flex flex-col gap-3 pt-2">
          <button
            type="button"
            onClick={handleManualAccept}
            className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-semibold font-inter text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Simulate Waiter Acceptance</span>
          </button>

          <button
            type="button"
            onClick={handleCancelOrder}
            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-rose-400 hover:text-rose-300 font-medium font-inter text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Cancel Order</span>
          </button>
        </div>
      </div>
    </DesktopSplitLayout>
  );
}

export default function WaitingPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-[#111111] flex items-center justify-center text-white">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <WaitingContent />
    </Suspense>
  );
}
