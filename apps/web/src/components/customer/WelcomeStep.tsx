"use client";

import React from "react";
import Image from "next/image";
import { MapPin, UtensilsCrossed, ArrowRight } from "lucide-react";
const customerPageIcon = "/assets/costomerpages/customer-page-icon.svg";
const restaurantTableSpread = "/assets/costomerpages/restaurant-table-spread.jpg";

interface WelcomeStepProps {
  onContinue: () => void;
  tableNumber?: string;
}

export default function WelcomeStep({
  onContinue,
  tableNumber = "Table 08"
}: WelcomeStepProps) {
  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-500 text-white font-sans">
      {/* Background Spread & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={restaurantTableSpread}
          alt="Restaurant Feast Table"
          fill
          priority
          className="object-cover object-center filter brightness-65"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
        <div className="absolute top-[305px] left-[25px] w-80 h-80 bg-black/95 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Center Welcome Content */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center px-4 pt-4">
        {/* Golden Emblem Logo */}
        <div className="relative w-20 h-20 mb-6 transition-transform hover:scale-105 duration-300">
          <Image
            src={customerPageIcon}
            alt="Tavonza Logo"
            fill
            className="object-contain drop-shadow-[0_0_20px_rgba(251,146,60,0.6)]"
          />
        </div>

        {/* Title */}
        <h1 className="text-center text-white text-4xl font-normal font-['Poppins'] leading-10 tracking-wide mb-1">
          Welcome to <br /> TAVONZA
        </h1>

        {/* Subtitle */}
        <div className="text-center text-orange-400 text-sm font-semibold font-['Montserrat'] leading-5 tracking-widest uppercase mb-3">
          BAR &amp; RESTAURANT
        </div>

        {/* Decorative Divider */}
        <div className="w-20 h-[5px] relative mb-6">
          <div className="w-8 h-0 left-0 top-[3px] absolute bg-orange-400 outline outline-1 outline-offset-[-0.50px] outline-orange-400" />
          <div className="w-8 h-0 left-[51px] top-[3px] absolute bg-orange-400 outline outline-1 outline-offset-[-0.50px] outline-orange-400" />
          <div className="w-[5px] h-[5px] left-[40px] top-0 absolute bg-orange-400 rounded-full" />
        </div>

        {/* Text */}
        <p className="text-center text-stone-200 text-base font-normal font-['Montserrat'] leading-5 tracking-wide max-w-[290px] mb-6">
          Scan complete! Explore our digital menu and place your order in just a few taps.
        </p>

        {/* Badges */}
        <div className="inline-flex justify-center items-center gap-3 mb-8">
          <div className="px-4 py-2 bg-orange-50 rounded-[99px] flex justify-start items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-black text-sm font-medium font-['Montserrat'] leading-5">
              {tableNumber}
            </span>
          </div>

          <div className="px-4 py-2 bg-orange-50 rounded-[99px] flex justify-start items-center gap-1.5">
            <UtensilsCrossed className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-black text-sm font-medium font-['Montserrat'] leading-5">
              Dine-In
            </span>
          </div>
        </div>

        {/* View Menu Button */}
        <button
          onClick={onContinue}
          className="w-full py-4 bg-orange-400 hover:bg-amber-400 rounded-2xl shadow-[0px_8px_20px_0px_rgba(227,172,56,0.35)] flex justify-center items-center gap-2.5 text-white text-lg font-semibold font-['Montserrat'] leading-5 transition-all active:scale-98"
        >
          <span>View Menu</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Footer Branding */}
      <div className="relative z-10 text-center py-2 text-neutral-300 text-xs font-normal font-['Montserrat'] leading-4">
        Powered by Tavonza Digital Ordering
      </div>
    </div>
  );
}
