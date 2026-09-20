'use client';

import React from 'react';
import {
  CreditCard,
  Banknote,
  Smartphone,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react';
import { POSCartItem, POSPaymentMethod } from '../../types';

interface POSCartPanelProps {
  cartItems: POSCartItem[];
  selectedPaymentMethod: POSPaymentMethod;
  onSelectPaymentMethod: (method: POSPaymentMethod) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onClearCart: () => void;
  onProcessPayment: () => void;
}

export const POSCartPanel: React.FC<POSCartPanelProps> = ({
  cartItems,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  onUpdateQuantity,
  onClearCart,
  onProcessPayment,
}) => {
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const taxRate = 0.08; // 8%
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const formattedItemsCount =
    totalItemsCount < 10 ? `0${totalItemsCount}` : `${totalItemsCount}`;

  return (
    <div className="w-full xl:w-80 bg-black rounded-xl border border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl shrink-0">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-white text-base font-bold font-['Plus_Jakarta_Sans'] leading-5">
            Order Summary
          </h2>
          <p className="text-slate-500 text-sm font-normal font-['Inter'] leading-4">
            {formattedItemsCount} items in cart
          </p>
        </div>
        {totalItemsCount > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="p-1 rounded-md text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
            title="Clear all items"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Cart Items List or Empty State */}
      <div className="flex-1 p-3.5 flex flex-col gap-2 overflow-y-auto max-h-[440px] min-h-[220px] scrollbar-thin scrollbar-thumb-zinc-800">
        {cartItems.length === 0 ? (
          <div className="h-44 flex flex-col justify-center items-center text-center my-auto">
            <span className="text-4xl mb-2 select-none">🛒</span>
            <p className="text-white/80 text-sm font-normal font-['Inter'] max-w-[200px] leading-4">
              Tap menu items to add them to the order
            </p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.product.id}
              className="p-2.5 sm:p-3 bg-white/10 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-xl flex items-center gap-3 transition-all hover:bg-white/[0.14]"
            >
              {/* Product Emoji / Thumbnail */}
              <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-lg shrink-0 select-none">
                {item.product.emoji || '🍽️'}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="text-white text-sm font-semibold font-['Inter'] leading-4 truncate">
                  {item.product.name}
                </span>
                <span className="text-yellow-500 text-sm font-normal font-['Inter'] leading-4">
                  ${item.product.price.toFixed(2)}
                </span>
              </div>

              {/* Stepper Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.product.id, -1)}
                  className="w-6 h-6 bg-neutral-700 hover:bg-neutral-600 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center text-white text-sm font-bold font-['Inter'] leading-4 select-none">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.product.id, 1)}
                  className="w-6 h-6 bg-yellow-500 hover:bg-yellow-400 rounded-lg flex items-center justify-center text-white font-bold transition-colors cursor-pointer shadow-sm shadow-yellow-500/20"
                  title="Increase quantity"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Totals & Payment Method Selector */}
      <div className="p-3.5 border-t border-slate-800 flex flex-col gap-3 bg-neutral-900/95">
        {/* Cost Breakdown */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-sm font-normal font-['Inter'] text-slate-400">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-normal font-['Inter'] text-slate-400">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-base font-bold font-['Inter'] text-white pt-1 border-t border-white/5">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method Quick Selector (Figma: Card, Cash, Mobile) */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onSelectPaymentMethod('Card')}
            className={`py-2 rounded-[10px] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              selectedPaymentMethod === 'Card'
                ? 'bg-yellow-500/10 outline outline-1 outline-offset-[-1px] outline-yellow-500 text-yellow-500'
                : 'outline outline-1 outline-offset-[-1px] outline-slate-800 text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold font-['Inter'] leading-none">
              Card
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPaymentMethod('Cash')}
            className={`py-2 rounded-[10px] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              selectedPaymentMethod === 'Cash'
                ? 'bg-yellow-500/10 outline outline-1 outline-offset-[-1px] outline-yellow-500 text-yellow-500'
                : 'outline outline-1 outline-offset-[-1px] outline-slate-800 text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold font-['Inter'] leading-none">
              Cash
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPaymentMethod('QR / Digital')}
            className={`py-2 rounded-[10px] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              selectedPaymentMethod === 'QR / Digital'
                ? 'bg-yellow-500/10 outline outline-1 outline-offset-[-1px] outline-yellow-500 text-yellow-500'
                : 'outline outline-1 outline-offset-[-1px] outline-slate-800 text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold font-['Inter'] leading-none">
              Mobile
            </span>
          </button>
        </div>

        {/* Process Payment Button */}
        <button
          type="button"
          disabled={cartItems.length === 0}
          onClick={onProcessPayment}
          className="h-10 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:hover:bg-yellow-500 disabled:cursor-not-allowed text-white text-base font-bold font-['Inter'] rounded-[10px] flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-yellow-500/20 active:scale-[0.99]"
        >
          Process Payment
        </button>
      </div>
    </div>
  );
};
