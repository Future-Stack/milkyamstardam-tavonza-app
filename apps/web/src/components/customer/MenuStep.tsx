"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Plus,
  Star,
  Sparkles,
  Flame,
  Utensils,
  GlassWater,
  Cake,
  UtensilsCrossed,
  Heart
} from "lucide-react";
import { MenuItem } from "@/src/types/customer";
import { MOCK_MENU_ITEMS } from "@/src/data/mockMenuData";

interface MenuStepProps {
  onSelectItem: (item: MenuItem) => void;
  onOpenCart: () => void;
  onOpenAskAi: () => void;
  cartCount: number;
}

export default function MenuStep({
  onSelectItem,
  onOpenCart,
  onOpenAskAi,
  cartCount
}: MenuStepProps) {
  const [activeCategory, setActiveCategory] = useState<string>("steaks");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "steaks", label: "Steaks", icon: Flame },
    { id: "starters", label: "Starters", icon: Utensils },
    { id: "sides", label: "Sides", icon: UtensilsCrossed },
    { id: "drinks", label: "Drinks", icon: GlassWater },
    { id: "desserts", label: "Desserts", icon: Cake },
    { id: "lunch", label: "Lunch Special", icon: Sparkles }
  ];

  const featuredItems = MOCK_MENU_ITEMS.filter((item) => item.category === "starters");
  const popularSteaks = MOCK_MENU_ITEMS.filter((item) => item.category === "steaks");

  return (
    <div className="relative flex-1 flex flex-col bg-black text-white overflow-hidden animate-in fade-in duration-300 font-sans pt-4">
      {/* Main Header */}
      <div className="px-6 pt-2 pb-3">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-medium font-['Poppins'] leading-7 tracking-wide text-white">
            Our Menu
          </h1>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-3 bg-black/20 rounded-[20px] shadow-[0px_0px_4px_0px_rgba(255,255,255,0.25)] border border-white/10 text-white hover:bg-black/40 transition"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white font-extrabold text-[11px] flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="w-full h-9 px-3 py-2 bg-white/10 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-800 backdrop-blur-[2px] inline-flex justify-start items-center gap-2">
            <Search className="w-4 h-4 text-neutral-200" />
            <input
              type="text"
              placeholder="Find your favorite..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-gray-300 text-[10px] font-normal font-['Montserrat'] leading-4 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-6 mb-4">
        <h2 className="text-base font-medium font-['Poppins'] text-white mb-2">
          All Categories
        </h2>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 text-xs">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1.5 rounded-[999px] flex justify-start items-center gap-1 font-medium font-['Montserrat'] leading-4 whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-amber-500 text-white font-semibold"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Scroll Content */}
      <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-24">
        {/* Featured Items Cards */}
        <div className="space-y-3.5">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="cursor-pointer bg-neutral-900 border border-zinc-800 rounded-[10px] p-3 flex gap-3 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.25)] hover:border-zinc-700 transition relative group"
            >
              {/* Image & Rating Badge */}
              <div className="relative w-28 h-36 rounded-[10px] overflow-hidden bg-white shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-1 left-1.5 px-2 py-0.5 bg-zinc-900 rounded-full flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-red-50 text-[7.35px] font-medium font-['Montserrat'] leading-[9.80px]">
                    {item.rating}{" "}
                    <span className="text-[5px]">({item.reviewsCount})</span>
                  </span>
                </div>
              </div>

              {/* Item Details */}
              <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 bg-orange-700/10 rounded-full text-amber-500 text-[10px] font-light font-['Poppins'] leading-4">
                      {item.badge}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="text-stone-400 hover:text-rose-500 transition"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-semibold font-['Montserrat'] text-white truncate my-1">
                    {item.name}
                  </h3>
                  <p className="text-white text-[10px] font-normal font-['Poppins'] line-clamp-2 leading-normal">
                    {item.description}
                  </p>

                  {item.isVegetarian && (
                    <div className="h-5 px-2 py-0.5 mt-2 bg-neutral-800 rounded-[5px] outline outline-[0.50px] outline-offset-[-0.50px] outline-neutral-700 inline-flex justify-start items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-green-500 text-[8px] font-semibold font-['DM_Sans'] leading-4">
                        Vegetarian
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-[#E5A853] text-base font-bold font-['DM_Sans'] leading-6">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectItem(item);
                    }}
                    className="w-5 h-5 rounded-[30.62px] bg-amber-500 text-white flex items-center justify-center shadow hover:brightness-110 active:scale-95 transition"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Most Popular Steaks Grid */}
        <div>
          <h2 className="text-base font-medium font-['Poppins'] text-white mb-3">
            Most Popular Steaks
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {popularSteaks.map((steak) => (
              <div
                key={steak.id}
                onClick={() => onSelectItem(steak)}
                className="cursor-pointer bg-neutral-900 border border-zinc-800 rounded-xl p-2.5 flex flex-col justify-between shadow-[0px_0px_4px_0px_rgba(255,255,255,0.25)] hover:border-zinc-700 transition group"
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] rounded-[9.80px] overflow-hidden bg-black mb-2">
                  <Image
                    src={steak.image}
                    alt={steak.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-zinc-900 rounded-full flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-red-50 text-[7.35px] font-medium font-['Montserrat'] leading-[9.80px]">
                      {steak.rating}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold font-['Montserrat'] text-white truncate">
                    {steak.name}
                  </h3>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-amber-500 text-base font-bold font-['DM_Sans'] leading-6">
                      ${steak.price.toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(steak);
                      }}
                      className="w-5 h-5 rounded-[30.62px] bg-amber-500 text-white flex items-center justify-center shadow hover:brightness-110 transition"
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Ask AI Button */}
      <button
        onClick={onOpenAskAi}
        className="fixed bottom-6 right-6 sm:absolute z-30 px-5 py-3 rounded-full bg-amber-500/90 hover:bg-amber-500 text-white font-semibold font-['DM_Sans'] text-sm shadow-[0px_8px_24px_0px_rgba(0,0,0,0.25)] flex items-center gap-2 transition active:scale-95"
      >
        <Sparkles className="w-4 h-4 fill-current text-white" />
        <span>Ask AI</span>
      </button>
    </div>
  );
}
