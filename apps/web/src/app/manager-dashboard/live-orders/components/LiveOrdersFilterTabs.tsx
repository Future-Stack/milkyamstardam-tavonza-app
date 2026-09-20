'use client';

import React from 'react';
import { LiveOrderStatus } from '../../types';

interface LiveOrdersFilterTabsProps {
  activeTab: LiveOrderStatus;
  onTabChange: (tab: LiveOrderStatus) => void;
  counts: Record<LiveOrderStatus, number>;
}

const TABS: LiveOrderStatus[] = [
  'All',
  'Waiting',
  'Cooking',
  'Preparing',
  'Ready',
  'Served',
  'Paid',
];

export const LiveOrdersFilterTabs: React.FC<LiveOrdersFilterTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        const count = counts[tab] ?? 0;
        const label = tab === 'All' ? `All(${count})` : tab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`h-9 px-3.5 py-1.5 rounded-[5px] text-base font-medium font-['Inter'] transition-all shrink-0 cursor-pointer ${
              isActive
                ? 'bg-amber-400 text-white font-semibold shadow-md'
                : 'bg-transparent text-neutral-400 hover:text-white border border-neutral-600/60 hover:border-neutral-400'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
