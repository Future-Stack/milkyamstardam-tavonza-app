'use client';

import React from 'react';
import {
  GlassWater,
  CheckCircle2,
  Wine,
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { mockBarStatCards } from '../data';

export default function BartenderStatCardsSection() {
  const iconMap: Record<string, React.ElementType> = {
    GlassWater,
    CheckCircle2,
    Wine,
    Clock,
    Sparkles,
    AlertTriangle,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {mockBarStatCards.map((card) => {
        const Icon = iconMap[card.iconName] || Wine;
        return (
          <div
            key={card.id}
            className={`p-3.5 sm:p-5 bg-neutral-900 rounded-xl border ${card.shadowColor} flex flex-col justify-between transition-all hover:scale-[1.02] duration-150 min-h-[145px]`}
          >
            {/* Top Icon with Golden Glow Ring */}
            <div className="size-8 sm:size-9 bg-zinc-900 rounded-full border border-amber-500/30 flex items-center justify-center text-white shadow-inner shrink-0">
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>

            {/* Value */}
            <div className="pt-2">
              <span className="text-white text-xl sm:text-2xl md:text-3xl font-bold font-['Plus_Jakarta_Sans'] tracking-tight truncate block">
                {card.value}
              </span>
            </div>

            {/* Labels */}
            <div className="space-y-0.5 pt-1">
              <p className="text-gray-400 text-xs sm:text-sm font-medium font-['Inter'] leading-tight truncate">
                {card.label}
              </p>
              <p className="text-gray-500 text-[10px] sm:text-xs font-normal font-['Inter'] leading-tight truncate">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
