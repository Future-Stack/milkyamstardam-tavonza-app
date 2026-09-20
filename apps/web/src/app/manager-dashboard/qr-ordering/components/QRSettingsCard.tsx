'use client';

import React from 'react';
import { toast } from 'sonner';
import { QRSettingsState } from '../../types';

interface QRSettingsCardProps {
  settings: QRSettingsState;
  onUpdateSettings: (newSettings: QRSettingsState) => void;
}

export const QRSettingsCard: React.FC<QRSettingsCardProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const toggleField = (field: keyof QRSettingsState, label: string) => {
    const updated = {
      ...settings,
      [field]: !settings[field],
    };
    onUpdateSettings(updated);
    toast.success(`${label} ${updated[field] ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="w-full bg-black rounded-xl border border-white/10 p-4 flex flex-col justify-between shadow-xl">
      {/* Title */}
      <div className="pb-2 border-b border-white/10">
        <h3 className="text-slate-200 text-lg font-semibold font-['Plus_Jakarta_Sans'] leading-5">
          Settings
        </h3>
        <p className="text-slate-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4 mt-0.5">
          Configure live QR ordering behavior
        </p>
      </div>

      {/* Toggles List matching Figma */}
      <div className="divide-y divide-white/5 flex flex-col justify-center">
        {/* Toggle 1: Auto-confirm orders */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-white/80 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4">
            Auto-confirm orders
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.autoConfirmOrders}
            onClick={() => toggleField('autoConfirmOrders', 'Auto-confirm orders')}
            className={`w-8 h-4 relative rounded-full transition-colors cursor-pointer ${
              settings.autoConfirmOrders ? 'bg-amber-500' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 absolute top-[1px] bg-white rounded-full shadow-sm transition-transform ${
                settings.autoConfirmOrders ? 'right-[2px]' : 'left-[2px]'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: Show allergen info */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-white/80 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4">
            Show allergen info
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.showAllergenInfo}
            onClick={() => toggleField('showAllergenInfo', 'Show allergen info')}
            className={`w-8 h-4 relative rounded-full transition-colors cursor-pointer ${
              settings.showAllergenInfo ? 'bg-amber-500' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 absolute top-[1px] bg-white rounded-full shadow-sm transition-transform ${
                settings.showAllergenInfo ? 'right-[2px]' : 'left-[2px]'
              }`}
            />
          </button>
        </div>

        {/* Toggle 3: Allow item notes */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-white/80 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4">
            Allow item notes
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.allowItemNotes}
            onClick={() => toggleField('allowItemNotes', 'Allow item notes')}
            className={`w-8 h-4 relative rounded-full transition-colors cursor-pointer ${
              settings.allowItemNotes ? 'bg-amber-500' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 absolute top-[1px] bg-white rounded-full shadow-sm transition-transform ${
                settings.allowItemNotes ? 'right-[2px]' : 'left-[2px]'
              }`}
            />
          </button>
        </div>

        {/* Toggle 4: Upsell suggestions */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-white/80 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4">
            Upsell suggestions
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.upsellSuggestions}
            onClick={() => toggleField('upsellSuggestions', 'Upsell suggestions')}
            className={`w-8 h-4 relative rounded-full transition-colors cursor-pointer ${
              settings.upsellSuggestions ? 'bg-amber-500' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 absolute top-[1px] bg-white rounded-full shadow-sm transition-transform ${
                settings.upsellSuggestions ? 'right-[2px]' : 'left-[2px]'
              }`}
            />
          </button>
        </div>

        {/* Toggle 5: Table-side payment */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-white/80 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4">
            Table-side payment
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.tableSidePayment}
            onClick={() => toggleField('tableSidePayment', 'Table-side payment')}
            className={`w-8 h-4 relative rounded-full transition-colors cursor-pointer ${
              settings.tableSidePayment ? 'bg-amber-500' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 absolute top-[1px] bg-white rounded-full shadow-sm transition-transform ${
                settings.tableSidePayment ? 'right-[2px]' : 'left-[2px]'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
