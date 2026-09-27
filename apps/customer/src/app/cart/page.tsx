'use client';

import React, { Suspense, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  CheckCircle2,
  UtensilsCrossed,
  Sparkles,
  Users,
  QrCode,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

function CartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCount,
    subtotal,
    serviceCharge,
    tax,
    totalAmount,
    tableNumber,
  } = useCart();

  const [orderPreference, setOrderPreference] = useState<'DINE_IN' | 'TAKEAWAY'>('DINE_IN');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const activeTable = searchParams.get('table') || tableNumber || 'Table 8';

  const handleOrderSubmit = () => {
    // Show instant success or forward to checkout
    setShowSuccessModal(true);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white relative font-sans overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      {/* Container - centered & responsive for mobile, tablet, and desktop */}
      <div className="w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-32 flex flex-col gap-6">
        
        {/* HEADER: Back Button + Title */}
        <header className="w-full flex items-center justify-between pt-1">
          <button
            onClick={() => router.push(`/menu?table=${encodeURIComponent(activeTable)}`)}
            className="inline-flex items-center gap-2.5 text-white hover:text-yellow-400 transition cursor-pointer"
          >
            <div className="w-7 h-7 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center">
              <ArrowLeft className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white text-base font-semibold font-montserrat">
                Your Cart
              </span>
              <span className="text-white/80 text-base font-normal font-montserrat">
                ( {totalCount} {totalCount === 1 ? 'item' : 'items'} )
              </span>
            </div>
          </button>

          {/* Table Badge */}
          <div className="px-2.5 py-1.5 bg-neutral-900 rounded-md border border-neutral-800 flex items-center shadow-sm">
            <span className="text-zinc-400 text-xs font-medium font-poppins">
              {activeTable.startsWith('Table') ? activeTable : `Table ${activeTable}`}
            </span>
          </div>
        </header>

        {/* CART ITEMS LIST */}
        {cart.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-zinc-500" />
            </div>
            <h2 className="text-white text-lg font-semibold font-poppins">
              Your cart is empty
            </h2>
            <p className="text-zinc-400 text-xs font-poppins max-w-xs">
              Explore our delicious menu and add your favorite dishes to start ordering.
            </p>
            <button
              onClick={() => router.push('/menu')}
              className="mt-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm font-montserrat rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5">
              <div className="flex flex-col gap-3.5">
            {cart.map((item) => {
              const itemTotal = item.price * item.quantity;
              return (
                <div
                  key={item.id}
                  className="relative w-full bg-neutral-900 rounded-2xl border border-neutral-800 p-3 pr-4 flex items-center justify-between gap-3 shadow-sm hover:border-neutral-700 transition"
                >
                  {/* Left: Dish image & details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-neutral-950">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                      <h3 className="text-white text-sm font-medium font-inter truncate">
                        {item.name}
                      </h3>
                      {item.subtitle && (
                        <p className="text-orange-200 text-xs font-normal font-poppins tracking-wide truncate">
                          {item.subtitle}
                        </p>
                      )}
                      <div className="flex items-center gap-0.5 text-orange-400 text-sm font-normal font-poppins">
                        <span>$</span>
                        <span className="text-white font-medium">{itemTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity Stepper & Remove */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Stepper */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 bg-neutral-200 hover:bg-neutral-300 rounded-md flex items-center justify-center transition cursor-pointer text-neutral-800"
                        title="Decrease"
                      >
                        <Minus className="w-3 h-3 stroke-[2.5]" />
                      </button>

                      <span className="text-white text-base font-medium font-inter min-w-4 text-center">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 bg-yellow-500 hover:bg-yellow-400 rounded-md flex items-center justify-center transition cursor-pointer text-neutral-900 shadow-sm"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Delete icon */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="w-6 h-6 rounded-full bg-zinc-800/80 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
              </div>

              {/* DINE-IN / TAKEAWAY PREFERENCE SELECTOR */}
              <div className="w-full flex items-center gap-2 p-1.5 bg-neutral-900 rounded-xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setOrderPreference('DINE_IN')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold font-montserrat transition-all cursor-pointer ${
                    orderPreference === 'DINE_IN'
                      ? 'bg-yellow-400 text-neutral-950 shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🍽️ Dine-In ({activeTable})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderPreference('TAKEAWAY')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold font-montserrat transition-all cursor-pointer ${
                    orderPreference === 'TAKEAWAY'
                      ? 'bg-yellow-400 text-neutral-950 shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🥡 Takeaway
                </button>
              </div>

              {/* SHARE WITH FRIENDS AT TABLE CALLOUT */}
              <div className="w-full bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-neutral-900 border border-amber-500/30 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center shrink-0">
                    <QrCode className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-white text-xs font-semibold font-montserrat truncate">
                      Dining with up to 4 friends?
                    </span>
                    <span className="text-zinc-400 text-[11px] font-poppins truncate">
                      Share QR code so they can order individually
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => router.push(`/cart/share-qr?table=${encodeURIComponent(activeTable)}`)}
                  className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-neutral-950 text-xs font-bold font-inter rounded-lg transition shrink-0 cursor-pointer shadow-sm"
                >
                  Share QR
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary & Checkout Button (Sticky on desktop) */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8 flex flex-col gap-4">
              <div className="w-full bg-neutral-900 rounded-[14px] border border-neutral-800 p-5 flex flex-col gap-3.5 shadow-xl">
                <h2 className="text-white text-base font-semibold font-montserrat">
                  Order Summary
                </h2>

                <div className="flex items-center justify-between text-sm font-normal font-montserrat text-white/90">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-sm font-normal font-montserrat text-white/90">
                  <span>Service Charge ( 5% )</span>
                  <span className="text-white font-medium">${serviceCharge.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-sm font-normal font-montserrat text-white/90">
                  <span>Tax ( 8% )</span>
                  <span className="text-white font-medium">${tax.toFixed(2)}</span>
                </div>

                <div className="w-full h-px bg-neutral-700/50 my-1" />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-white text-base font-semibold font-montserrat">
                    Total Amount
                  </span>
                  <span className="text-yellow-400 text-xl font-bold font-poppins">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* BOTTOM CTA: "Order Preference" */}
              <button
                type="button"
                onClick={handleOrderSubmit}
                className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 active:scale-[0.99] text-neutral-950 text-base font-semibold font-inter rounded-xl shadow-[0px_8px_20px_0px_rgba(227,172,56,0.35)] transition-all flex items-center justify-center cursor-pointer"
              >
                Order Preference
              </button>
            </div>
          </div>
        )}

      </div>

      {/* HOSTGUEST ORDER PREFERENCE MODAL (From Figma) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-sm sm:max-w-md bg-neutral-950/95 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-6 text-center shadow-2xl relative">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xs font-montserrat px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
            >
              ✕
            </button>

            {/* HostGuest Avatar / Icon */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner">
                🍽️
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-white text-lg sm:text-xl font-semibold font-inter capitalize">
                  You Have Joined As Hostguest
                </h3>
                <p className="text-neutral-400 text-xs font-inter leading-relaxed max-w-xs mx-auto">
                  You’re now part of HostGuest. Start exploring your hosting journey and choose how you would like to order.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push(`/cart/share-qr?table=${encodeURIComponent(activeTable)}`);
                }}
                className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 active:scale-[0.99] text-neutral-950 text-sm sm:text-base font-semibold font-inter rounded-xl shadow-[0px_4px_12px_rgba(227,172,56,0.35)] transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Share QR Code (Up to 4 Friends)</span>
                <span className="text-xs bg-neutral-950 text-yellow-400 px-2 py-0.5 rounded-full font-bold">New</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push(`/orders/waiting?table=${encodeURIComponent(activeTable)}&mode=individual`);
                }}
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 active:scale-[0.99] text-white text-sm sm:text-base font-semibold font-inter rounded-xl transition cursor-pointer"
              >
                Order Individually (Just for Me)
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push(`/cart/group?table=${encodeURIComponent(activeTable)}`);
                }}
                className="w-full py-3 bg-[#FCF7EB] hover:bg-[#F3ECD9] active:scale-[0.99] text-neutral-950 text-sm sm:text-base font-semibold font-inter rounded-xl shadow-md transition cursor-pointer"
              >
                Order Together (Shared Cart)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-black flex items-center justify-center text-white">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CartContent />
    </Suspense>
  );
}
