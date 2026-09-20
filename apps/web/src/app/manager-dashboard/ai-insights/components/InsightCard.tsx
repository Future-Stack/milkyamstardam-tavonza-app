'use client';

import React from 'react';
import {
  TrendingUp,
  Users,
  UtensilsCrossed,
  AlertTriangle,
  UserCheck,
  ChefHat,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { AIInsightItem } from '../../types';

interface InsightCardProps {
  insight: AIInsightItem;
  onTakeAction: (insight: AIInsightItem) => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, onTakeAction }) => {
  // Map icon and themes
  const getCardTheme = () => {
    switch (insight.iconType) {
      case 'revenue':
        return {
          icon: TrendingUp,
          iconBg: 'bg-green-500/10',
          iconColor: 'text-green-500',
          badgeBg: 'bg-emerald-500/10',
          badgeText: 'text-emerald-500',
          btnBg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
          btnText: 'text-emerald-500',
          btnArrow: 'text-emerald-500',
        };
      case 'staffing':
        return {
          icon: Users,
          iconBg: 'bg-indigo-500/10',
          iconColor: 'text-indigo-500',
          badgeBg: 'bg-blue-500/10',
          badgeText: 'text-blue-500',
          btnBg: 'bg-blue-500/10 hover:bg-blue-500/20',
          btnText: 'text-blue-500',
          btnArrow: 'text-blue-500',
        };
      case 'menu':
        return {
          icon: UtensilsCrossed,
          iconBg: 'bg-amber-500/20',
          iconColor: 'text-amber-500',
          badgeBg: 'bg-stone-800',
          badgeText: 'text-amber-500',
          btnBg: 'bg-amber-500/10 hover:bg-amber-500/20',
          btnText: 'text-amber-500',
          btnArrow: 'text-amber-500',
        };
      case 'inventory':
        return {
          icon: AlertTriangle,
          iconBg: 'bg-orange-600/10',
          iconColor: 'text-red-500',
          badgeBg: 'bg-orange-600/10',
          badgeText: 'text-red-500',
          btnBg: 'bg-red-500/10 hover:bg-red-500/20',
          btnText: 'text-red-500',
          btnArrow: 'text-red-500',
        };
      case 'loyalty':
        return {
          icon: UserCheck,
          iconBg: 'bg-violet-500/10',
          iconColor: 'text-violet-500',
          badgeBg: 'bg-violet-500/10',
          badgeText: 'text-violet-500',
          btnBg: 'bg-violet-500/10 hover:bg-violet-500/20',
          btnText: 'text-violet-500',
          btnArrow: 'text-violet-500',
        };
      case 'kitchen':
      default:
        return {
          icon: ChefHat,
          iconBg: 'bg-amber-500/10',
          iconColor: 'text-orange-500',
          badgeBg: 'bg-orange-500/10',
          badgeText: 'text-orange-500',
          btnBg: 'bg-orange-500/10 hover:bg-orange-500/20',
          btnText: 'text-orange-500',
          btnArrow: 'text-orange-500',
        };
    }
  };

  const theme = getCardTheme();
  const Icon = theme.icon;
  const isApplied = insight.status === 'applied';

  return (
    <div className="w-full p-5 bg-neutral-900 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-800 flex flex-col justify-between hover:outline-slate-700 hover:shadow-lg transition-all duration-200 group">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 ${theme.iconBg} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
          >
            <Icon className={`w-5 h-5 ${theme.iconColor}`} />
          </div>
          <h3 className="text-white text-base font-semibold font-['Inter'] leading-5">
            {insight.title}
          </h3>
        </div>

        {/* Badge */}
        <span
          className={`px-2 py-1 ${theme.badgeBg} ${theme.badgeText} rounded-sm text-sm font-medium font-sans capitalize shrink-0`}
        >
          {isApplied ? 'Applied' : insight.badgeText}
        </span>
      </div>

      {/* Description Text */}
      <div className="pt-3.5 pb-3">
        <p className="text-slate-400 text-sm font-normal font-['Inter'] leading-5">
          {insight.description}
        </p>
      </div>

      {/* Action Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => onTakeAction(insight)}
          className={`w-full py-2 ${
            isApplied ? 'bg-zinc-800 text-zinc-400 cursor-default' : theme.btnBg
          } rounded-[10px] inline-flex justify-center items-center gap-1.5 transition-all cursor-pointer font-['Inter']`}
        >
          {isApplied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Action Applied</span>
            </>
          ) : (
            <>
              <span className={`text-sm font-semibold ${theme.btnText}`}>
                {insight.actionText}
              </span>
              <ChevronRight className={`w-3 h-3 ${theme.btnArrow}`} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
