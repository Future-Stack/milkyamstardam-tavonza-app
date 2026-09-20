'use client';

import React, { useState } from 'react';
import { CategoryRevenuePoint } from '../../types';

interface RevenueByCategoryChartProps {
  categories: CategoryRevenuePoint[];
}

export const RevenueByCategoryChart: React.FC<RevenueByCategoryChartProps> = ({ categories }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Exact arc order from reference screenshot 2:
  // Mains (38%, orange) -> Desserts (10%, pink) -> Beverages (12%, green) -> Burgers (18%, purple) -> Pizza (22%, blue)
  const arcOrder = ['Mains', 'Desserts', 'Beverages', 'Burgers', 'Pizza'];
  const orderedArcs = arcOrder
    .map((name) => categories.find((c) => c.name === name))
    .filter(Boolean) as CategoryRevenuePoint[];

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div className="w-full bg-white/10 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-white/10 backdrop-blur-md p-6 sm:p-7 flex flex-col justify-between h-[390px] select-none">
      {/* Header */}
      <div>
        <h2 className="text-white text-lg font-semibold font-['Inter'] leading-6">
          Revenue by Category
        </h2>
        <p className="text-slate-400 text-sm font-normal font-['Inter'] leading-5 mt-0.5">
          Revenue by menu category this week.
        </p>
      </div>

      {/* Donut Chart Display */}
      <div className="flex items-center justify-center my-1 relative">
        <div className="relative size-36 flex items-center justify-center">
          <svg className="size-full -rotate-90" viewBox="0 0 100 100">
            {orderedArcs.map((item) => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = `${-(cumulativePercent / 100) * circumference}`;
              cumulativePercent += item.percentage;
              const isHovered = hoveredCategory === item.name;

              return (
                <circle
                  key={item.name}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? '15' : '13'}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 8px ${item.color})` : 'none',
                    opacity: hoveredCategory && !isHovered ? 0.6 : 1,
                  }}
                  onMouseEnter={() => setHoveredCategory(item.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              );
            })}
          </svg>

          {/* Center Info Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {hoveredCategory ? (
              <>
                <span className="text-white text-sm font-bold font-['Inter']">
                  {categories.find((c) => c.name === hoveredCategory)?.percentage}%
                </span>
                <span className="text-xs text-zinc-400 font-['Inter'] truncate max-w-[70px]">
                  {hoveredCategory}
                </span>
              </>
            ) : (
              <span className="text-white text-base font-semibold font-['Inter']">
                100%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category Legend List */}
      <div className="space-y-1.5 pt-2">
        {categories.map((cat) => {
          const isHovered = hoveredCategory === cat.name;

          return (
            <div
              key={cat.name}
              className={`flex items-center justify-between text-sm py-0.5 px-1.5 rounded transition-all cursor-pointer ${
                isHovered ? 'bg-white/10 scale-[1.01]' : 'hover:bg-white/5'
              }`}
              onMouseEnter={() => setHoveredCategory(cat.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Color indicator dot + Name */}
              <div className="flex items-center gap-2.5">
                <span
                  className="size-2 rounded-full shrink-0 transition-transform"
                  style={{
                    backgroundColor: cat.color,
                    boxShadow: isHovered ? `0 0 6px ${cat.color}` : 'none',
                  }}
                />
                <span className={`font-normal font-['Inter'] ${isHovered ? 'text-white' : 'text-neutral-200'}`}>
                  {cat.name}
                </span>
              </div>

              {/* Percentage & Amount */}
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium font-mono">
                  {cat.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
