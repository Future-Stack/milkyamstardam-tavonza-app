'use client';

import React, { useState } from 'react';
import { X, Bell, Volume2, ShieldAlert, Check } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [urgentTableAlerts, setUrgentTableAlerts] = useState(true);
  const [kitchenDelayAlerts, setKitchenDelayAlerts] = useState(true);
  const [inventoryDepletionAlerts, setInventoryDepletionAlerts] = useState(true);
  const [vipArrivalAlerts, setVipArrivalAlerts] = useState(true);

  if (!isOpen) return null;

  const handleSave = () => {
    toast.success('Notification preferences updated successfully.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-xl shadow-2xl p-6 relative font-['Inter']">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold">Notification Settings</h2>
            <span className="text-sm text-zinc-400">Configure real-time alerts and triggers</span>
          </div>
        </div>

        {/* Settings Toggles */}
        <div className="mt-5 space-y-3.5 text-sm">
          {/* Sound toggle */}
          <div className="flex items-center justify-between p-3 bg-zinc-950/60 border border-white/5 rounded-lg">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-white font-medium block">Audible Sound Alert</span>
                <span className="text-zinc-500 text-xs">Play chime on new high-priority alert</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="accent-yellow-500 w-4 h-4 rounded cursor-pointer"
            />
          </div>

          {/* Urgent table waiting */}
          <div className="flex items-center justify-between p-3 bg-zinc-950/60 border border-white/5 rounded-lg">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <div>
                <span className="text-white font-medium block">Table Delay Alerts</span>
                <span className="text-zinc-500 text-xs">Trigger when guest waits 15+ minutes</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={urgentTableAlerts}
              onChange={(e) => setUrgentTableAlerts(e.target.checked)}
              className="accent-yellow-500 w-4 h-4 rounded cursor-pointer"
            />
          </div>

          {/* Kitchen prep delay */}
          <div className="flex items-center justify-between p-3 bg-zinc-950/60 border border-white/5 rounded-lg">
            <div>
              <span className="text-white font-medium block">Kitchen Prep Spikes</span>
              <span className="text-zinc-500 text-xs">Alert when average ticket prep rises {'>'} 8%</span>
            </div>
            <input
              type="checkbox"
              checked={kitchenDelayAlerts}
              onChange={(e) => setKitchenDelayAlerts(e.target.checked)}
              className="accent-yellow-500 w-4 h-4 rounded cursor-pointer"
            />
          </div>

          {/* Low inventory threshold */}
          <div className="flex items-center justify-between p-3 bg-zinc-950/60 border border-white/5 rounded-lg">
            <div>
              <span className="text-white font-medium block">Low Stock Threshold</span>
              <span className="text-zinc-500 text-xs">Alert when ingredient drops below 15%</span>
            </div>
            <input
              type="checkbox"
              checked={inventoryDepletionAlerts}
              onChange={(e) => setInventoryDepletionAlerts(e.target.checked)}
              className="accent-yellow-500 w-4 h-4 rounded cursor-pointer"
            />
          </div>

          {/* VIP Check-in */}
          <div className="flex items-center justify-between p-3 bg-zinc-950/60 border border-white/5 rounded-lg">
            <div>
              <span className="text-white font-medium block">VIP Guest Seating</span>
              <span className="text-zinc-500 text-xs">Notify immediately when VIP guests check in</span>
            </div>
            <input
              type="checkbox"
              checked={vipArrivalAlerts}
              onChange={(e) => setVipArrivalAlerts(e.target.checked)}
              className="accent-yellow-500 w-4 h-4 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-neutral-300 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-white text-sm font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Check className="w-3.5 h-3.5 text-white" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
