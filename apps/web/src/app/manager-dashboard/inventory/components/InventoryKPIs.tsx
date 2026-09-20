'use client';

import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, Package } from 'lucide-react';
import { InventoryKPIsData } from '../../types';

interface InventoryKPIsProps {
  kpis: InventoryKPIsData;
  onFilterStatus?: (status: 'Critical' | 'Low' | 'Healthy' | 'All') => void;
}

export const InventoryKPIs: React.FC<InventoryKPIsProps> = ({
  kpis,
  onFilterStatus,
}) => {
  const cards = [
    {
      id: 'critical',
      label: 'Critical Items',
      value: String(kpis.criticalCount).padStart(2, '0'),
      subtitle: kpis.criticalSubtitle,
      color: 'text-orange-600',
      icon: AlertOctagon,
      statusKey: 'Critical' as const,
    },
    {
      id: 'low',
      label: 'Low Stock',
      value: String(kpis.lowStockCount).padStart(2, '0'),
      subtitle: kpis.lowSubtitle,
      color: 'text-amber-500',
      icon: AlertTriangle,
      statusKey: 'Low' as const,
    },
    {
      id: 'healthy',
      label: 'Healthy Stock',
      value: String(kpis.healthyCount).padStart(2, '0'),
      subtitle: kpis.healthySubtitle,
      color: 'text-emerald-500',
      icon: CheckCircle2,
      statusKey: 'Healthy' as const,
    },
    {
      id: 'total',
      label: 'Total Items',
      value: String(kpis.totalCount).padStart(2, '0'),
      subtitle: kpis.totalSubtitle,
      color: 'text-blue-500',
      icon: Package,
      statusKey: 'All' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            onClick={() => onFilterStatus?.(c.statusKey)}
            className="h-24 bg-black rounded-xl border border-white/10 p-4 flex items-center justify-between transition-all hover:bg-zinc-950 hover:border-white/20 cursor-pointer group"
          >
            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-zinc-400 text-sm font-semibold font-['Inter'] leading-5">
                {c.label}
              </span>
              <span
                className={`${c.color} text-2xl font-bold font-['Inter'] leading-5 group-hover:scale-105 transition-transform`}
              >
                {c.value}
              </span>
              <span className="text-slate-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4">
                {c.subtitle}
              </span>
            </div>

            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
