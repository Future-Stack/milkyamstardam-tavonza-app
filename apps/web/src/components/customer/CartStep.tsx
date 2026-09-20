"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft, Minus, Plus, X } from "lucide-react";
import { CartItem } from "@/src/types/customer";

interface CartStepProps {
  cartItems: CartItem[];
  onBack: () => void;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onPlaceOrder: () => void;
}

export default function CartStep({
  cartItems,
  onBack,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder
}: CartStepProps) {
  const totalItemsCount = cartItems.reduce((acc, c) => acc + c.quantity, 0);

  const subtotal = cartItems.reduce((sum, cartItem) => {
    const addOnsCost = cartItem.selectedAddOns.reduce((a, b) => a + b.price, 0);
    return sum + (cartItem.item.price + addOnsCost) * cartItem.quantity;
  }, 0);

  const serviceCharge = subtotal * 0.05;
  const tax = subtotal * 0.08;
  const totalAmount = subtotal + serviceCharge + tax;

  return (
    <div className="relative flex-1 flex flex-col bg-black text-white overflow-hidden animate-in slide-in-from-right duration-300 font-sans pt-4">
      {/* Header */}
      <div className="px-6 py-2 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-[20px] bg-amber-500/40 text-white flex items-center justify-center hover:bg-amber-500/60 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5">
          <h1 className="text-2xl font-semibold font-['Montserrat'] text-white">
            Your Cart
          </h1>
          <span className="text-base font-normal font-['Montserrat'] text-white">
            ( {totalItemsCount} items )
          </span>
        </div>
      </div>

      {/* Cart Content */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-28 pt-2">
        {cartItems.length === 0 ? (
          <div className="text-center py-16 text-stone-400 text-sm font-['Montserrat']">
            Your cart is currently empty.
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="space-y-3">
              {cartItems.map((cartItem, index) => {
                const addOnsCost = cartItem.selectedAddOns.reduce(
                  (a, b) => a + b.price,
                  0
                );
                const itemTotal =
                  (cartItem.item.price + addOnsCost) * cartItem.quantity;

                return (
                  <div
                    key={index}
                    className="relative bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(255,255,255,0.25)] outline outline-1 outline-offset-[-1px] outline-zinc-800 p-3 flex gap-3 items-center overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative w-14 h-16 rounded-[10px] overflow-hidden bg-white shrink-0">
                      <Image
                        src={cartItem.item.image}
                        alt={cartItem.item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 pr-6">
                      <h3 className="text-base font-semibold font-['Montserrat'] text-white truncate">
                        {cartItem.item.name}
                      </h3>

                      {cartItem.selectedAddOns.length > 0 && (
                        <p className="text-[10px] text-stone-400 truncate mt-0.5 font-['Poppins']">
                          + {cartItem.selectedAddOns.map((a) => a.name).join(", ")}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            onUpdateQuantity(index, cartItem.quantity - 1)
                          }
                          className="w-5 h-5 rounded-2xl bg-orange-400/30 outline outline-[0.56px] outline-offset-[-0.56px] outline-neutral-700 flex items-center justify-center text-white"
                        >
                          <Minus className="w-3 h-3 stroke-[3]" />
                        </button>
                        <span className="text-xs font-bold font-['Inter'] text-white w-3 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(index, cartItem.quantity + 1)
                          }
                          className="w-5 h-5 rounded-2xl bg-orange-400 outline outline-[0.56px] outline-offset-[-0.56px] outline-neutral-700 flex items-center justify-center text-white"
                        >
                          <Plus className="w-3 h-3 stroke-[3]" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <span className="text-amber-500 text-lg font-bold font-['Poppins'] leading-5 shrink-0">
                      ${itemTotal.toFixed(2)}
                    </span>

                    {/* Close Icon */}
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="absolute top-2.5 right-2.5 p-1 bg-zinc-900 rounded-full text-stone-400 hover:text-white transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Card */}
            <div className="bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(255,255,255,0.25)] border border-zinc-800 p-4 space-y-3">
              <h2 className="text-base font-semibold font-['Montserrat'] text-white">
                Order Summary
              </h2>

              <div className="flex justify-between items-center text-xs font-normal font-['Montserrat'] text-stone-200">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-xs font-normal font-['Montserrat'] text-stone-200">
                <span>Service Charge ( 5% )</span>
                <span>${serviceCharge.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-xs font-normal font-['Montserrat'] text-stone-200">
                <span>Tax ( 8% )</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
                <span className="text-white text-base font-semibold font-['Montserrat']">
                  Total Amount
                </span>
                <span className="text-amber-500 text-lg font-bold font-['Poppins'] leading-5">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky Place Order Button */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/95 backdrop-blur-md border-t border-zinc-800 p-4">
        <button
          onClick={onPlaceOrder}
          disabled={cartItems.length === 0}
          className="w-full py-4 bg-orange-400 hover:bg-amber-400 disabled:opacity-50 rounded-2xl shadow-[0px_8px_20px_0px_rgba(227,172,56,0.35)] text-white text-lg font-semibold font-['Montserrat'] leading-5 transition active:scale-98"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
