"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Star,
  AlertTriangle,
  Wine,
  Clock,
  Flame,
  Minus,
  Plus,
  Sparkles
} from "lucide-react";
import { MenuItem, AddOnOption } from "@/src/types/customer";

interface ItemDetailStepProps {
  item: MenuItem;
  onBack: () => void;
  onAddToCart: (item: MenuItem, quantity: number, selectedAddOns: AddOnOption[], instructions: string) => void;
  onOpenAskAi: () => void;
}

export default function ItemDetailStep({
  item,
  onBack,
  onAddToCart,
  onOpenAskAi
}: ItemDetailStepProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>("");

  const toggleAddOn = (addOn: AddOnOption) => {
    if (selectedAddOns.some((a) => a.id === addOn.id)) {
      setSelectedAddOns((prev) => prev.filter((a) => a.id !== addOn.id));
    } else {
      setSelectedAddOns((prev) => [...prev, addOn]);
    }
  };

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const totalAmount = (item.price + addOnsTotal) * quantity;

  return (
    <div className="relative flex-1 flex flex-col bg-black text-white overflow-hidden animate-in slide-in-from-right duration-300 font-sans">
      {/* Banner Image */}
      <div className="relative w-full h-64 shrink-0 bg-white rounded-bl-[10px] rounded-br-[10px] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-[20px] bg-amber-500/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-amber-500/60 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Popular Badge */}
        {item.badge && (
          <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-amber-500/60 rounded-full text-white text-xs font-semibold font-['DM_Sans'] leading-4">
            {item.badge}
          </div>
        )}
      </div>

      {/* Main Details Body */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 pb-28">
        {/* Title, Rating & Price Header */}
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-base font-semibold font-['Montserrat'] text-white">
                {item.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-5 px-2 py-0.5 bg-zinc-900 rounded-full flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-red-50 text-[7.35px] font-medium font-['Montserrat'] leading-[9.80px]">
                    {item.rating}{" "}
                    <span className="text-[5px]">({item.reviewsCount})</span>
                  </span>
                </div>

                {item.isVegetarian && (
                  <div className="h-5 px-2 py-0.5 bg-zinc-900 rounded-full outline outline-[0.50px] outline-offset-[-0.50px] outline-neutral-600 inline-flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-green-500 text-[10px] font-semibold font-['DM_Sans'] leading-4">
                      Vegetarian
                    </span>
                  </div>
                )}
              </div>
            </div>

            <span className="text-amber-500 text-base font-bold font-['DM_Sans'] leading-6">
              ${item.price.toFixed(2)}
            </span>
          </div>

          <p className="text-white text-[10px] font-normal font-['Poppins'] leading-normal mt-2">
            {item.description}
          </p>
        </div>

        {/* Contains Alert Box */}
        {item.allergens && (
          <div className="w-full p-3 bg-stone-900 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-neutral-700 flex items-center gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <span className="text-orange-400 font-semibold font-['DM_Sans']">
                Contains:{" "}
              </span>
              <span className="text-white font-normal font-['DM_Sans']">
                {item.allergens}
              </span>
            </div>
          </div>
        )}

        {/* Wine Pairing Box */}
        {item.winePairing && (
          <div className="w-full p-3 bg-white/10 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[0px] space-y-1">
            <div>
              <span className="text-amber-500 text-xs font-semibold font-['DM_Sans'] leading-4">
                Wine Pairing:{" "}
              </span>
              <span className="text-white text-xs font-semibold font-['DM_Sans'] leading-4">
                {item.winePairing}
              </span>
            </div>
            <p className="text-white text-xs font-normal font-['DM_Sans'] leading-5">
              {item.winePairingDesc}
            </p>
          </div>
        )}

        {/* Prep Time & Calories Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white/10 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[0px] flex items-center gap-2">
            <Clock className="w-4 h-4 text-white shrink-0" />
            <div>
              <span className="text-amber-500 text-[10px] font-normal font-['DM_Sans'] uppercase leading-4 tracking-tight block">
                Prep Time
              </span>
              <span className="text-white text-sm font-semibold font-['DM_Sans'] leading-5">
                {item.prepTime || "12 min"}
              </span>
            </div>
          </div>

          <div className="p-3 bg-white/10 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[0px] flex items-center gap-2">
            <Flame className="w-4 h-4 text-white shrink-0" />
            <div>
              <span className="text-amber-500 text-[10px] font-normal font-['DM_Sans'] uppercase leading-4 tracking-tight block">
                Calories
              </span>
              <span className="text-white text-sm font-semibold font-['DM_Sans'] leading-5">
                {item.calories || "480 kcal"}
              </span>
            </div>
          </div>
        </div>

        {/* Quantity Bar */}
        <div className="w-full h-12 px-3 bg-neutral-900 rounded-[10px] flex justify-between items-center overflow-hidden">
          <span className="text-white text-base font-semibold font-['Montserrat']">
            Quantity
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-6 h-6 rounded-2xl bg-orange-400/30 outline outline-[0.56px] outline-offset-[-0.56px] outline-neutral-700 flex items-center justify-center text-white"
            >
              <Minus className="w-3 h-3 stroke-[3]" />
            </button>
            <span className="text-white text-xs font-bold font-['Inter'] leading-4 w-3 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-6 h-6 rounded-2xl bg-orange-400 outline outline-[0.56px] outline-offset-[-0.56px] outline-neutral-700 flex items-center justify-center text-white"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Add-Ons */}
        {item.addOns && item.addOns.length > 0 && (
          <div className="space-y-2.5">
            <h2 className="text-white text-base font-semibold font-['Montserrat']">
              Add On
            </h2>
            <div className="space-y-2.5">
              {item.addOns.map((addOn) => {
                const isSelected = selectedAddOns.some((a) => a.id === addOn.id);
                return (
                  <div
                    key={addOn.id}
                    onClick={() => toggleAddOn(addOn)}
                    className="cursor-pointer px-2.5 py-3 bg-neutral-900 rounded-[10px] flex justify-between items-center overflow-hidden border border-transparent hover:border-neutral-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border ${
                          isSelected
                            ? "border-amber-500 bg-amber-500"
                            : "border-stone-500"
                        }`}
                      />
                      <span className="text-white text-base font-semibold font-['Montserrat']">
                        {addOn.name}
                      </span>
                    </div>
                    <span className="text-amber-500 text-sm font-medium font-['DM_Sans'] leading-5">
                      +${addOn.price.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Special Instructions */}
        <div>
          <h2 className="text-white text-base font-semibold font-['Montserrat'] mb-2">
            Special Instructions
          </h2>
          <textarea
            rows={3}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Add a note for the Kitchen.........."
            className="w-full p-3.5 bg-neutral-900 rounded-[10px] text-xs text-white placeholder-zinc-500 font-normal font-['Montserrat'] focus:outline-none focus:border-amber-500 border border-transparent transition resize-none"
          />
        </div>
      </div>

      {/* Floating Ask AI Button */}
      <button
        onClick={onOpenAskAi}
        className="fixed bottom-24 right-6 sm:absolute z-30 px-5 py-3 rounded-full bg-amber-500/80 hover:bg-amber-500 text-white font-semibold font-['DM_Sans'] text-sm shadow-[0px_8px_24px_0px_rgba(0,0,0,0.25)] flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4 fill-current text-white" />
        <span>Ask AI</span>
      </button>

      {/* Sticky Bottom Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/95 backdrop-blur-md border-t border-neutral-400/25 p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-white text-base font-semibold font-['Montserrat']">
            Total Amount
          </span>
          <span className="text-amber-500 text-lg font-bold font-['Poppins'] leading-5">
            ${totalAmount.toFixed(2)}
          </span>
        </div>

        <button
          onClick={() =>
            onAddToCart(item, quantity, selectedAddOns, specialInstructions)
          }
          className="w-full h-12 bg-orange-400 hover:bg-amber-400 rounded-2xl shadow-[0px_8px_20px_0px_rgba(227,172,56,0.35)] text-white text-lg font-semibold font-['Montserrat'] leading-5 transition active:scale-98 flex items-center justify-center"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}
