'use client';

import React from 'react';
import { toast } from 'sonner';
import { IntegrationSettingItem } from '../../types';

interface IntegrationsCardProps {
  integrations: IntegrationSettingItem[];
  onConfigure?: (item: IntegrationSettingItem) => void;
}

export const IntegrationsCard: React.FC<IntegrationsCardProps> = ({
  integrations,
  onConfigure,
}) => {
  const handleConfigureClick = (item: IntegrationSettingItem) => {
    if (onConfigure) {
      onConfigure(item);
    } else {
      toast.info(`Opening configuration wizard for ${item.name}...`);
    }
  };

  return (
    <div className="w-full bg-neutral-900 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/5 p-5 flex flex-col justify-start items-start gap-3 shadow-lg">
      <h2 className="text-slate-200 text-lg font-semibold font-sans">
        Integrations
      </h2>

      <div className="w-full space-y-2.5 pt-1">
        {integrations.map((item) => {
          const isConnected = item.status === 'Connected';

          return (
            <div
              key={item.id}
              className="w-full p-2.5 bg-white/5 hover:bg-white/[0.08] rounded-lg flex items-center justify-between transition-colors"
            >
              <span className="text-white text-sm font-medium font-sans">
                {item.name}
              </span>

              <div className="flex items-center gap-2">
                <div
                  className={`px-2 py-0.5 rounded-md text-sm font-medium font-sans ${
                    isConnected
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {item.status}
                </div>

                <button
                  type="button"
                  onClick={() => handleConfigureClick(item)}
                  className="px-2 py-1 text-neutral-400 hover:text-white text-xs font-medium font-sans hover:bg-white/10 rounded transition-colors cursor-pointer"
                >
                  Configure
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
