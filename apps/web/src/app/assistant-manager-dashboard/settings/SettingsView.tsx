'use client';

import React, { useState } from 'react';
import { Settings, Check } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsView() {
  const [turnTimeAlert, setTurnTimeAlert] = useState(60);
  const [autoBusserPing, setAutoBusserPing] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [vipPriorityHighlight, setVipPriorityHighlight] = useState(true);

  const handleSave = () => {
    toast.success('Floor operational preferences saved successfully.');
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white font-['Inter'] flex items-center gap-2.5">
          <Settings className="size-6 text-amber-400" />
          Floor Operations Settings
        </h1>
        <p className="text-zinc-400 text-sm font-['Inter'] mt-1">
          Configure threshold triggers, handheld terminal alerts, and automated busser dispatch rules.
        </p>
      </div>

      <div className="space-y-4">
        {/* Turn-Time Alert Threshold */}
        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between gap-4">
          <div>
            <div className="text-white text-base font-medium font-['Inter']">
              Target Turn-Time Alert Threshold
            </div>
            <p className="text-zinc-400 text-xs mt-1">
              Mark tables with yellow/red warning status when dining elapsed exceeds target time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[45, 60, 75].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setTurnTimeAlert(mins)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  turnTimeAlert === mins
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}
              >
                {mins} mins
              </button>
            ))}
          </div>
        </div>

        {/* Auto Busser Dispatch */}
        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between gap-4">
          <div>
            <div className="text-white text-base font-medium font-['Inter']">
              Auto-Dispatch Bussing Reminders
            </div>
            <p className="text-zinc-400 text-xs mt-1">
              Automatically ping Sofia and floor bussers when a table remains empty &gt;5 minutes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAutoBusserPing(!autoBusserPing)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              autoBusserPing ? 'bg-amber-500 justify-end' : 'bg-zinc-800 justify-start'
            }`}
          >
            <div className="bg-black w-4 h-4 rounded-full shadow-md" />
          </button>
        </div>

        {/* Audio Alerts for Frontline Delays */}
        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between gap-4">
          <div>
            <div className="text-white text-base font-medium font-['Inter']">
              High-Priority Sound Chimes
            </div>
            <p className="text-zinc-400 text-xs mt-1">
              Play soft chime on AM terminal when kitchen delay exceeds 15 minutes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSoundAlerts(!soundAlerts)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              soundAlerts ? 'bg-amber-500 justify-end' : 'bg-zinc-800 justify-start'
            }`}
          >
            <div className="bg-black w-4 h-4 rounded-full shadow-md" />
          </button>
        </div>

        {/* VIP Priority Highlight */}
        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between gap-4">
          <div>
            <div className="text-white text-base font-medium font-['Inter']">
              VIP Table Glow Highlight
            </div>
            <p className="text-zinc-400 text-xs mt-1">
              Highlight VIP and executive tables with subtle amber outline across the floor grid.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setVipPriorityHighlight(!vipPriorityHighlight)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              vipPriorityHighlight ? 'bg-amber-500 justify-end' : 'bg-zinc-800 justify-start'
            }`}
          >
            <div className="bg-black w-4 h-4 rounded-full shadow-md" />
          </button>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Check className="size-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}

export default SettingsView;
