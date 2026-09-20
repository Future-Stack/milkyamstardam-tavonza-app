'use client';

import React from 'react';
import {
  ShoppingBag,
  Grid,
  Users,
  UserCheck,
  ChefHat,
  Star,
  ExternalLink,
} from 'lucide-react';
import { OperationKPICard } from '../types';

interface LiveOperationsKPIsProps {
  cards: OperationKPICard[];
  onCardClick?: (id: string) => void;
}

export const LiveOperationsKPIs: React.FC<LiveOperationsKPIsProps> = ({
  cards,
  onCardClick,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'kpi-1':
        return <ShoppingBag className="w-4 h-4 text-blue-400" />;
      case 'kpi-2':
        return <Grid className="w-4 h-4 text-amber-400" />;
      case 'kpi-3':
        return <Users className="w-4 h-4 text-emerald-400" />;
      case 'kpi-4':
        return <UserCheck className="w-4 h-4 text-violet-400" />;
      case 'kpi-5':
        return <ChefHat className="w-4 h-4 text-orange-400" />;
      case 'kpi-6':
        return <Star className="w-4 h-4 text-yellow-400" />;
      default:
        return <ShoppingBag className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-white text-lg font-semibold font-['Inter'] leading-6">
        Live Operations Overview
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => onCardClick && onCardClick(card.id)}
            className="min-h-[140px] p-3.5 sm:p-4 bg-black hover:bg-zinc-950 rounded-2xl border border-white/10 shadow-sm flex flex-col justify-between transition-all cursor-pointer group"
          >
            {/* Top row: Icon + Link hint */}
            <div className="flex items-center justify-between">
              <div
                className={`w-8 h-8 ${card.iconBg} rounded-xl flex items-center justify-center`}
              >
                {getIcon(card.id)}
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
            </div>

            {/* Metric Value */}
            <div>
              <div className="text-white text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-tight truncate">
                {card.value}
              </div>
              <div className="text-white text-xs sm:text-sm font-medium font-['Plus_Jakarta_Sans'] leading-4 mt-0.5 truncate">
                {card.title}
              </div>
              <div className="text-slate-400 text-[10px] sm:text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4 truncate">
                {card.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
