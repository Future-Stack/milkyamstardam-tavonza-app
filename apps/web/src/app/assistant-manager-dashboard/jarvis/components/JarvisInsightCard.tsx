'use client';

import React from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';

export interface JarvisInsightCardProps {
  title: string;
  category: string;
  description: string;
  actionText: string;
  onAction: () => void;
  icon: LucideIcon;
  colorClass: string;
}

export function JarvisInsightCard({
  title,
  category,
  description,
  actionText,
  onAction,
  icon: Icon,
  colorClass,
}: JarvisInsightCardProps) {
  return (
    <div className={`p-4 bg-zinc-950 border ${colorClass} rounded-xl space-y-2 flex flex-col justify-between shadow-sm`}>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
          <Icon className="size-4" />
          <span>{category}</span>
        </div>
        <div className="text-white text-base font-medium font-['Inter']">{title}</div>
        <p className="text-zinc-400 text-xs leading-relaxed">{description}</p>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="text-xs text-amber-400 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
      >
        {actionText} <ArrowRight className="size-3" />
      </button>
    </div>
  );
}

export default JarvisInsightCard;
