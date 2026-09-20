'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ChevronDown,
  CreditCard,
  Receipt,
  PauseCircle,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  ShoppingBag,
} from 'lucide-react';
import { CashierMenuItem, CartItem } from '../types';
import { cashierMenuItems } from '../data';

interface NewOrderViewProps {
  onShowToast?: (msg: string) => void;
  onOrderCompleted?: (orderId: string, total: number) => void;
}

export default function NewOrderView({
  onShowToast,
  onOrderCompleted,
}: NewOrderViewProps) {
  const [menuItems] = useState<CashierMenuItem[]>(cashierMenuItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customerType, setCustomerType] = useState<string>('Walk in customer');

  // Initial cart matching Figma with Caesar Salad ($14.00)
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'c-1',
      menuItemId: 'm-4',
      name: 'Caesar Salad',
      price: 14.0,
      quantity: 1,
    },
  ]);

  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const categories = ['All', 'Starters', 'Mains', 'Drinks', 'Desserts', 'Sides'];

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (menuItem: CashierMenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === menuItem.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === menuItem.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${menuItem.id}`,
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        },
      ];
    });
    onShowToast?.(`Added "${menuItem.name}" to cart.`);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.id === cartId) {
            const nextQty = c.quantity + delta;
            return nextQty > 0 ? { ...c, quantity: nextQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartId: string, name: string) => {
    setCart((prev) => prev.filter((c) => c.id !== cartId));
    onShowToast?.(`Removed "${name}" from cart.`);
  };

  const handleClearCart = () => {
    setCart([]);
    onShowToast?.('Cart cleared.');
  };

  const handleHoldOrder = () => {
    if (cart.length === 0) return;
    onShowToast?.(`Order for ${customerType} put on hold (Ticket #HLD-${Math.floor(100 + Math.random() * 900)}).`);
    setCart([]);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Number((subtotal * 0.08875).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const handleProceedPayment = () => {
    if (cart.length === 0) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      const generatedOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      onShowToast?.(`Payment of $${total.toFixed(2)} completed for ${generatedOrderId}!`);
      onOrderCompleted?.(generatedOrderId, total);
      setTimeout(() => {
        setCart([]);
        setPaymentSuccess(false);
      }, 1500);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Bar (From Figma) */}
      <div className="w-full bg-black shadow-[0px_0px_4px_0px_rgba(212,212,212,0.25)] border border-zinc-800/80 rounded-xl p-5 flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold font-['Inter'] leading-8">
            Create Walk-In Order
          </h1>
          <p className="text-slate-500 text-sm sm:text-base font-normal font-['Inter'] leading-5 mt-0.5">
            Build order for counter customer or direct register sale.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Menu Catalog vs Right Customer Account Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search, Categories & Menu Grid */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search Menu Input (From Figma: bg-zinc-900 rounded-[5px]) */}
          <div className="w-full h-11 px-4 bg-zinc-900 rounded-[5px] border border-neutral-800 flex items-center gap-3.5">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Menu Items..."
              className="w-full bg-transparent text-white text-sm sm:text-base placeholder-zinc-500 focus:outline-none"
            />
          </div>

          {/* Category Tabs (From Figma: All, Starters, Mains, Drinks, Desserts, Sides) */}
          <div className="flex items-center overflow-x-auto scrollbar-none">
            <div className="h-9 inline-flex rounded-lg border border-white/20 bg-black shrink-0">
              {categories.map((cat, idx) => {
                const isActive = selectedCategory === cat;
                const isFirst = idx === 0;
                const isLast = idx === categories.length - 1;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 text-sm sm:text-base font-normal font-['Inter'] transition-colors cursor-pointer ${
                      isFirst ? 'rounded-l-lg' : ''
                    } ${isLast ? 'rounded-r-lg' : ''} ${
                      isActive
                        ? 'bg-yellow-500 text-white font-medium'
                        : 'text-neutral-400 hover:text-white hover:bg-zinc-900 border-l border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menu Cards Grid (From Figma: 3 cards per row) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 hover:bg-white/10 rounded-[10px] border border-white/10 p-3 shadow-md flex flex-col justify-between space-y-3 transition-all group"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-900">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Category Tag Pill (From Figma: bg-zinc-900 text-red-50 text-xs) */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-zinc-900/90 rounded-full border border-white/10">
                    <span className="text-red-100 text-xs font-medium font-['Inter']">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-white text-base font-semibold font-['Inter'] line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="text-yellow-400 text-base font-semibold font-['Inter'] font-mono">
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                {/* Add to Cart Button (From Figma: bg-neutral-800 rounded-[50px]) */}
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full h-8 px-4 bg-neutral-800 hover:bg-neutral-700 active:scale-[0.98] rounded-[50px] flex items-center justify-center gap-2 text-white text-xs sm:text-sm font-medium font-['Poppins'] transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Add to cart</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Customer Account & Current Order Cart (From Figma) */}
        <div className="lg:col-span-4 bg-neutral-900 rounded-[10px] border border-neutral-700 p-4 sm:p-5 flex flex-col justify-between space-y-5 shadow-xl">
          <div className="space-y-4">
            {/* Header: Customer Account (From Figma: text-white text-xl font-medium) */}
            <h2 className="text-white text-xl font-medium font-['Inter']">
              Customer Account
            </h2>

            {/* Dropdown: Walk in customer (From Figma) */}
            <div className="w-full h-11 px-3 bg-neutral-800 rounded-lg border border-neutral-700 flex items-center justify-between cursor-pointer">
              <span className="text-white text-sm sm:text-base font-medium font-['Inter']">
                {customerType}
              </span>
              <ChevronDown className="w-4 h-4 text-orange-400" />
            </div>

            <div className="w-full h-px bg-zinc-800" />

            {/* Current Order Section (From Figma: text-white text-xl font-medium) */}
            <div className="space-y-3">
              <div className="text-white text-base sm:text-lg font-medium font-['Inter']">
                Current Order
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  Cart is empty. Tap any menu item on the left to add.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-neutral-800 rounded-lg border border-neutral-700 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-white text-sm font-medium font-['Inter'] truncate">
                          {item.name}
                        </div>
                        <div className="text-slate-400 text-xs font-medium font-['Inter'] font-mono">
                          ${item.price.toFixed(2)} each
                        </div>
                      </div>

                      {/* Quantity Stepper (From Figma) */}
                      <div className="flex items-center gap-2 bg-neutral-900/80 px-2 py-1 rounded-md border border-neutral-700">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="w-5 h-5 rounded border border-red-200/40 hover:bg-neutral-800 flex items-center justify-center text-red-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white text-sm font-semibold font-mono w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="w-5 h-5 rounded border border-red-200/40 hover:bg-neutral-800 flex items-center justify-center text-red-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right shrink-0 flex items-center gap-2">
                        <span className="text-white text-sm font-medium font-mono">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          className="text-red-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Totals & Bottom Action Buttons (From Figma) */}
          <div className="space-y-4 pt-3 border-t border-zinc-800">
            {/* Subtotal & Tax */}
            <div className="space-y-1.5 text-sm font-medium font-['Inter']">
              <div className="flex justify-between text-zinc-300">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Tax</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>
              <div className="w-full h-px bg-zinc-800 my-1" />
              <div className="flex justify-between text-white text-lg font-semibold">
                <span>Total</span>
                <span className="text-amber-400 font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Hold Order & Clear Cart Buttons (From Figma: bg-gray-100 text-black) */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleHoldOrder}
                disabled={cart.length === 0}
                className="py-2.5 bg-gray-100 hover:bg-white active:scale-[0.98] disabled:opacity-50 text-black font-medium text-sm rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <PauseCircle className="w-4 h-4 text-black" />
                <span>Hold Order</span>
              </button>
              <button
                onClick={handleClearCart}
                disabled={cart.length === 0}
                className="py-2.5 bg-gray-100 hover:bg-white active:scale-[0.98] disabled:opacity-50 text-black font-medium text-sm rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-black" />
                <span>Clear Cart</span>
              </button>
            </div>

            {/* Proceed to Payment Button (From Figma: bg-amber-400 text-black font-normal text-base) */}
            <button
              onClick={handleProceedPayment}
              disabled={cart.length === 0 || isProcessingPayment}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] disabled:opacity-50 text-black font-semibold text-base font-['Inter'] rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              {isProcessingPayment ? (
                <span>Processing Register...</span>
              ) : paymentSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  <span>Payment Complete!</span>
                </>
              ) : (
                <span>Proceed to Payment ( ${total.toFixed(2)} )</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
