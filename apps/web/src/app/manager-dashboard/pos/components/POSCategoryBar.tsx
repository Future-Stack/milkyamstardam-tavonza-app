'use client';

import React from 'react';
import { POSCategory } from '../../types';
import { posCategories } from '../../data';

interface POSCategoryBarProps {
  activeCategory: POSCategory;
  onSelectCategory: (cat: POSCategory) => void;
}

export const POSCategoryBar: React.FC<POSCategoryBarProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1">
      <div className="h-9 inline-flex items-center rounded-lg border border-white/20 bg-black overflow-hidden">
        {posCategories.map((category, index) => {
          const isActive = activeCategory === category;
          const isFirst = index === 0;
          const isLast = index === posCategories.length - 1;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`h-9 px-4 py-2 flex items-center justify-center text-base sm:text-lg font-normal font-['Inter'] transition-colors whitespace-nowrap cursor-pointer ${
                isFirst ? 'rounded-tl-lg rounded-bl-lg' : ''
              } ${isLast ? 'rounded-tr-lg rounded-br-lg' : ''} ${
                index > 0 ? 'border-l border-white/20' : ''
              } ${
                isActive
                  ? 'bg-yellow-500 text-white font-medium shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};
