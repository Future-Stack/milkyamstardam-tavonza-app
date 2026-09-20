'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { AIOperationSettingToggle } from '../../types';

interface AIOperationsCardProps {
  initialToggles: AIOperationSettingToggle[];
}

export const AIOperationsCard: React.FC<AIOperationsCardProps> = ({ initialToggles }) => {
  const [toggles, setToggles] = useState<AIOperationSettingToggle[]>(initialToggles);

  const handleToggle = (id: string) => {
    setToggles((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextVal = !item.enabled;
          toast.info(`AI Operation "${item.label}" ${nextVal ? 'enabled' : 'disabled'}.`);
          return { ...item, enabled: nextVal };
        }
        return item;
      })
    );
  };

  return (
    <div className="w-full bg-zinc-900 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/5 p-5 flex flex-col justify-start items-start select-none shadow-lg">
      <h2 className="text-slate-200 text-lg font-semibold font-sans mb-3">
        AI Operations
      </h2>

      <div className="w-full divide-y divide-white/5">
        {toggles.map((item) => (
          <div
            key={item.id}
            onClick={() => handleToggle(item.id)}
            className="py-3 flex items-center justify-between cursor-pointer group"
          >
            <span className="text-white/80 text-sm font-normal font-sans group-hover:text-white transition-colors">
              {item.label}
            </span>

            {/* Amber Pill Toggle Switch */}
            <div
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative ${
                item.enabled ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ease-in-out ${
                  item.enabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
