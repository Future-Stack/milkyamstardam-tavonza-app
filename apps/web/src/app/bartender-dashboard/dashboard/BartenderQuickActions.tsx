'use client';

import React from 'react';
import {
  Play,
  CheckCircle2,
  PackagePlus,
  BellRing,
  BookOpen,
  Wine
} from 'lucide-react';
import { toast } from 'sonner';

interface BartenderQuickActionsProps {
  onActionClick?: (actionName: string) => void;
}

export default function BartenderQuickActions({ onActionClick }: BartenderQuickActionsProps) {
  const actions = [
    {
      id: 'start-prep',
      label: 'Start Preparation',
      icon: Wine,
      color: 'text-amber-400',
    },
    {
      id: 'mark-prep',
      label: 'Mark as Preparing',
      icon: Play,
      color: 'text-blue-400',
    },
    {
      id: 'mark-ready',
      label: 'Mark as Ready',
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
    {
      id: 'stock-refill',
      label: 'Request Stock Refill',
      icon: PackagePlus,
      color: 'text-rose-400',
    },
    {
      id: 'notify-waiter',
      label: 'Notify Waiter',
      icon: BellRing,
      color: 'text-yellow-400',
    },
    {
      id: 'view-recipes',
      label: 'View Drink Recipes',
      icon: BookOpen,
      color: 'text-purple-400',
    },
  ];

  const handleClick = (actionLabel: string) => {
    if (onActionClick) {
      onActionClick(actionLabel);
    } else {
      toast.success(`Action executed: ${actionLabel}`);
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-white text-lg font-semibold font-['Inter']">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => handleClick(act.label)}
              className="h-14 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-xl border border-white/10 hover:border-white/20 transition-all flex flex-col justify-center items-center gap-1 cursor-pointer group shadow-sm active:scale-95"
            >
              <Icon className={`w-4 h-4 ${act.color} group-hover:scale-110 transition-transform`} />
              <span className="text-stone-300 group-hover:text-white text-sm font-medium font-['Inter'] text-center truncate w-full">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
