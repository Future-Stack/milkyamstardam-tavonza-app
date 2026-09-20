'use client';

import React from 'react';
import {
  Plus,
  Grid,
  Utensils,
  ChefHat,
  Users,
  Package,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { QuickActionItem } from '../types';

interface QuickActionsBarProps {
  actions: QuickActionItem[];
  onActionClick: (id: string, label: string) => void;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  actions,
  onActionClick,
}) => {
  const getActionIcon = (name: string) => {
    switch (name) {
      case 'Plus':
        return <Plus className="w-4 h-4 text-stone-300" />;
      case 'Grid':
        return <Grid className="w-4 h-4 text-stone-300" />;
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-stone-300" />;
      case 'ChefHat':
        return <ChefHat className="w-4 h-4 text-stone-300" />;
      case 'Users':
        return <Users className="w-4 h-4 text-stone-300" />;
      case 'Package':
        return <Package className="w-4 h-4 text-stone-300" />;
      case 'BarChart':
        return <BarChart3 className="w-4 h-4 text-stone-300" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-stone-300" />;
      default:
        return <Plus className="w-4 h-4 text-stone-300" />;
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-white text-lg font-semibold font-['Inter'] leading-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => onActionClick(action.id, action.label)}
            className="h-14 px-2.5 py-2 bg-black hover:bg-zinc-950 border border-white/10 rounded-[5px] flex flex-col justify-center items-center gap-1.5 transition-colors cursor-pointer group shadow-sm"
          >
            <div className="group-hover:scale-110 transition-transform">
              {getActionIcon(action.iconName)}
            </div>
            <span className="text-stone-300 group-hover:text-white text-sm font-medium font-['Inter'] leading-3 truncate">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
