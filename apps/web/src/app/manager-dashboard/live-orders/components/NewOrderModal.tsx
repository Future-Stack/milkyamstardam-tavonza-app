'use client';

import React, { useState, useRef } from 'react';
import { X, ChevronDown, Plus, Minus } from 'lucide-react';
import { menuItemsList, tableList, waiterList } from '../../data';
import { DetailedLiveOrder, MenuItem } from '../../types';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (newOrder: DetailedLiveOrder) => void;
}

interface SelectedItem {
  item: MenuItem;
  quantity: number;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const [selectedTable, setSelectedTable] = useState('T-02');
  const [selectedWaiter, setSelectedWaiter] = useState('Emma Wilson');
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedItem>>({});
  const [orderNotes, setOrderNotes] = useState('');
  const orderCounterRef = useRef(10497);

  if (!isOpen) return null;

  const handleAddItem = (item: MenuItem) => {
    setSelectedItems((prev) => {
      const current = prev[item.id];
      if (current) {
        return {
          ...prev,
          [item.id]: { item, quantity: current.quantity + 1 },
        };
      }
      return {
        ...prev,
        [item.id]: { item, quantity: 1 },
      };
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setSelectedItems((prev) => {
      const current = prev[itemId];
      if (!current) return prev;
      const newQty = current.quantity + delta;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return {
        ...prev,
        [itemId]: { ...current, quantity: newQty },
      };
    });
  };

  const itemsList = Object.values(selectedItems);
  const subtotal = itemsList.reduce(
    (acc, curr) => acc + curr.item.price * curr.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    if (itemsList.length === 0) return;

    orderCounterRef.current += 1;
    const currentNum = orderCounterRef.current;
    const newOrder: DetailedLiveOrder = {
      id: `ord-${currentNum}`,
      orderNumber: `#${currentNum}`,
      table: selectedTable,
      waiter: selectedWaiter,
      itemsCount: itemsList.reduce((acc, curr) => acc + curr.quantity, 0),
      itemsSummary: `${itemsList.reduce((acc, curr) => acc + curr.quantity, 0)} items`,
      total,
      status: 'Preparing',
      eta: '10 min',
      time: 'Just now',
      notes: orderNotes,
      orderItems: itemsList.map((i) => ({
        id: i.item.id,
        name: i.item.name,
        price: i.item.price,
        quantity: i.quantity,
      })),
    };

    onOrderCreated(newOrder);
    setSelectedItems({});
    setOrderNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 lg:left-72 top-20 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-[640px] bg-black border border-white/15 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-2 border-b border-white/10">
          <div>
            <h3 className="text-white text-lg font-bold font-['Plus_Jakarta_Sans']">
              New Order
            </h3>
            <p className="text-neutral-400 text-sm font-normal font-['Plus_Jakarta_Sans'] mt-0.5">
              Create a new table order
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left Column: Table/Waiter + Menu Grid + Order Notes (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            {/* Table & Waiter Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white uppercase tracking-wide block font-['Plus_Jakarta_Sans']">
                  Table
                </label>
                <div className="relative">
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="w-full h-8 px-2.5 bg-gray-900/60 border border-white/10 rounded-[5px] text-sm text-slate-200 font-medium font-['Plus_Jakarta_Sans'] focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
                  >
                    {tableList.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white uppercase tracking-wide block font-['Plus_Jakarta_Sans']">
                  Waiter
                </label>
                <div className="relative">
                  <select
                    value={selectedWaiter}
                    onChange={(e) => setSelectedWaiter(e.target.value)}
                    className="w-full h-8 px-2.5 bg-gray-900/60 border border-white/10 rounded-[5px] text-sm text-slate-200 font-medium font-['Plus_Jakarta_Sans'] focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
                  >
                    {waiterList.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Menu Items Grid (2x3) */}
            <div className="grid grid-cols-2 gap-2">
              {menuItemsList.map((item) => {
                const qty = selectedItems[item.id]?.quantity || 0;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleAddItem(item)}
                    className={`relative p-2 rounded-xl bg-gray-900/40 hover:bg-gray-900/80 border transition-all cursor-pointer select-none flex flex-col justify-center ${
                      qty > 0
                        ? 'border-amber-500/50 bg-amber-500/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="text-slate-200 text-sm font-medium font-['Plus_Jakarta_Sans'] truncate pr-4">
                      {item.name}
                    </div>
                    <div className="text-amber-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] mt-1">
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Quantity Badge */}
                    {qty > 0 && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-yellow-500 text-white text-[10px] font-bold rounded-[3px] font-mono">
                        {String(qty).padStart(2, '0')}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Order Notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-white uppercase tracking-wide block font-['Plus_Jakarta_Sans']">
                Order Notes
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Special requests, allergies..."
                className="w-full h-10 px-3 bg-neutral-950/60 border border-white/10 rounded-[5px] text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-['Plus_Jakarta_Sans']"
              />
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-3">
            <div className="p-3 bg-neutral-950/70 rounded-xl border border-white/10 flex-1 flex flex-col justify-between">
              {/* Summary Header */}
              <div>
                <h4 className="text-slate-200 text-sm font-semibold font-['Plus_Jakarta_Sans']">
                  Order Summary
                </h4>
                <p className="text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] mt-0.5">
                  {selectedTable} · {selectedWaiter}
                </p>

                {/* Items List or Empty state */}
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                  {itemsList.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-sm font-['Plus_Jakarta_Sans']">
                      Select items from the menu
                    </div>
                  ) : (
                    itemsList.map(({ item, quantity }) => (
                      <div
                        key={item.id}
                        className="p-2 bg-gray-900/90 rounded-lg flex items-center justify-between gap-1.5 border border-white/5 text-sm"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-slate-200 text-sm font-medium truncate block">
                            {item.name}
                          </span>
                          <span className="text-slate-500 text-xs">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="w-5 h-5 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center text-slate-200 transition-colors"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-4 text-center font-mono font-medium text-sm text-white">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="w-5 h-5 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center text-slate-200 transition-colors"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <span className="font-semibold text-amber-500 font-mono shrink-0 ml-1 text-sm">
                          ${(item.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Price Calculations */}
              {itemsList.length > 0 && (
                <div className="pt-3 border-t border-white/10 space-y-1.5 text-sm font-['Plus_Jakarta_Sans']">
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-300">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Tax (10%)</span>
                    <span className="font-mono text-slate-300">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-200 font-bold pt-1 border-t border-white/5">
                    <span>Total</span>
                    <span className="font-mono text-amber-500">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Place Order Button */}
            <button
              type="button"
              disabled={itemsList.length === 0}
              onClick={handlePlaceOrder}
              className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-[5px] text-sm font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Place Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
