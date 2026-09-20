'use client';

import React, { useState } from 'react';
import {
  Camera,
  Check,
  Sparkles,
  Bell,
  User,
  Building,
  Mail,
  Shield,
  Save,
  Volume2,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsView() {
  // Profile state
  const [fullName, setFullName] = useState('James Carter');
  const [email, setEmail] = useState('james.carter@tavonza.com');
  const [role, setRole] = useState('Bartender');
  const [branch, setBranch] = useState('Downtown Branch');
  const [avatarUrl, setAvatarUrl] = useState('/assets/costomerpages/customer-page-icon.svg');

  // Tavonza AI Preferences state
  const [aiPreferences, setAiPreferences] = useState({
    aiSuggestions: true,
    demandForecasting: true,
    upsellTips: true,
    autoPrioritizeOrders: false,
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    vipOrderAlerts: true,
    lowStockAlerts: true,
    maintenanceReminders: false,
    performanceReports: true,
  });

  // Save profile handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Bar Command Center profile preferences saved.');
  };

  // Toggle AI Preference
  const toggleAiPref = (key: keyof typeof aiPreferences, label: string) => {
    setAiPreferences((prev) => {
      const next = !prev[key];
      toast.success(`${label} turned ${next ? 'ON' : 'OFF'}`);
      return { ...prev, [key]: next };
    });
  };

  // Toggle Notification
  const toggleNotification = (key: keyof typeof notifications, label: string) => {
    setNotifications((prev) => {
      const next = !prev[key];
      toast.success(`${label} ${next ? 'enabled' : 'disabled'}`);
      return { ...prev, [key]: next };
    });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16 font-['Inter']">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-4xl font-semibold font-['Inter'] leading-9 tracking-tight">
            Settings
          </h1>
          <p className="text-zinc-500 text-lg font-normal font-['Inter'] leading-6 mt-1">
            Configure your Bar Command Center preferences
          </p>
        </div>
      </div>

      {/* 2. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile & Notifications */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Profile Card */}
          <div className="bg-white/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[30px] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="text-gray-200 text-base font-semibold font-['Inter'] leading-5">
                Profile
              </h2>
            </div>

            {/* Avatar Row */}
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
                    alt="James Carter"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/icon.png';
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => toast.info('Photo upload dialog opened.')}
                  title="Change avatar photo"
                  className="absolute -bottom-1 -right-1 p-1.5 bg-amber-500 hover:bg-amber-400 text-white rounded-lg transition-colors shadow-md cursor-pointer"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              <div>
                <h3 className="text-slate-200 text-lg font-bold font-['Inter'] leading-6">
                  {fullName}
                </h3>
                <p className="text-slate-500 text-sm font-normal font-['Inter'] leading-4">
                  {role} · 4 years at Tavonza
                </p>
                <button
                  type="button"
                  onClick={() => toast.info('Photo upload dialog opened.')}
                  className="mt-1 inline-flex items-center gap-1 text-amber-500 hover:text-amber-400 text-xs font-medium font-['Inter'] cursor-pointer transition-colors"
                >
                  <Camera className="w-3 h-3" />
                  <span>Change Photo</span>
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-white text-xs font-semibold font-['Inter'] uppercase tracking-wide mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-slate-200 text-base font-normal font-['Inter'] focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-white text-xs font-semibold font-['Inter'] uppercase tracking-wide mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-slate-200 text-base font-normal font-['Inter'] focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-white text-xs font-semibold font-['Inter'] uppercase tracking-wide mb-1.5">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full h-10 px-3 bg-zinc-900 border border-white/10 rounded-lg text-slate-200 text-base font-normal font-['Inter'] focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Bartender">Bartender</option>
                    <option value="Lead Mixologist">Lead Mixologist</option>
                    <option value="Bar Manager">Bar Manager</option>
                    <option value="Sommelier">Head Sommelier</option>
                  </select>
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-white text-xs font-semibold font-['Inter'] uppercase tracking-wide mb-1.5">
                    Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full h-10 px-3 bg-zinc-900 border border-white/10 rounded-lg text-slate-200 text-base font-normal font-['Inter'] focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Downtown Branch">Downtown Branch</option>
                    <option value="Uptown Branch">Uptown Branch</option>
                    <option value="Waterfront Lounge">Waterfront Lounge</option>
                    <option value="Westside Rooftop">Westside Rooftop</option>
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-9 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 rounded-[5px] text-white text-base font-medium font-['Inter'] capitalize transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>

          {/* Notifications Card */}
          <div className="bg-white/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[30px] p-6">
            <h2 className="text-gray-200 text-base font-semibold font-['Inter'] leading-5 mb-4">
              Notifications
            </h2>

            <div className="divide-y divide-white/5">
              {/* 1. VIP Order Alerts */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-gray-200 text-base font-normal font-['Inter'] leading-5">
                    VIP Order Alerts
                  </div>
                  <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-4">
                    Notify when a VIP order is placed or delayed
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleNotification('vipOrderAlerts', 'VIP Order Alerts')}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer flex items-center px-0.5 ${
                    notifications.vipOrderAlerts ? 'bg-amber-500' : 'bg-gray-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
                      notifications.vipOrderAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 2. Low Stock Alerts */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-gray-200 text-base font-normal font-['Inter'] leading-5">
                    Low Stock Alerts
                  </div>
                  <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-4">
                    Notify when inventory falls below minimum level
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleNotification('lowStockAlerts', 'Low Stock Alerts')}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer flex items-center px-0.5 ${
                    notifications.lowStockAlerts ? 'bg-amber-500' : 'bg-gray-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
                      notifications.lowStockAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 3. Maintenance Reminders */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-gray-200 text-base font-normal font-['Inter'] leading-5">
                    Maintenance Reminders
                  </div>
                  <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-4">
                    Equipment maintenance due notifications
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleNotification('maintenanceReminders', 'Maintenance Reminders')}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer flex items-center px-0.5 ${
                    notifications.maintenanceReminders ? 'bg-amber-500' : 'bg-gray-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
                      notifications.maintenanceReminders ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 4. Performance Reports */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-gray-200 text-base font-normal font-['Inter'] leading-5">
                    Performance Reports
                  </div>
                  <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-4">
                    End-of-shift performance summary
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleNotification('performanceReports', 'Performance Reports')}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer flex items-center px-0.5 ${
                    notifications.performanceReports ? 'bg-amber-500' : 'bg-gray-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
                      notifications.performanceReports ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tavonza AI Preferences */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Tavonza AI Card */}
          <div className="bg-white/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[30px] overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-gray-200 text-base font-semibold font-['Inter'] leading-5">
                Tavonza AI
              </h2>
            </div>

            {/* AI Toggle Items */}
            <div className="p-5 space-y-4 text-base font-['Inter']">
              {/* 1. AI Suggestions */}
              <div className="flex items-center justify-between">
                <span className="text-gray-200 text-base font-normal">AI Suggestions</span>
                <button
                  type="button"
                  onClick={() => toggleAiPref('aiSuggestions', 'AI Suggestions')}
                  className={`px-2 py-0.5 rounded-[5px] outline outline-1 outline-offset-[-1px] text-sm font-medium font-['Inter'] transition-colors cursor-pointer ${
                    aiPreferences.aiSuggestions
                      ? 'bg-emerald-500/10 outline-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                      : 'bg-gray-800 outline-white/5 text-gray-500 hover:bg-zinc-800'
                  }`}
                >
                  {aiPreferences.aiSuggestions ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* 2. Demand Forecasting */}
              <div className="flex items-center justify-between">
                <span className="text-gray-200 text-base font-normal">Demand Forecasting</span>
                <button
                  type="button"
                  onClick={() => toggleAiPref('demandForecasting', 'Demand Forecasting')}
                  className={`px-2 py-0.5 rounded-[5px] outline outline-1 outline-offset-[-1px] text-sm font-medium font-['Inter'] transition-colors cursor-pointer ${
                    aiPreferences.demandForecasting
                      ? 'bg-emerald-500/10 outline-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                      : 'bg-gray-800 outline-white/5 text-gray-500 hover:bg-zinc-800'
                  }`}
                >
                  {aiPreferences.demandForecasting ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* 3. Upsell Tips */}
              <div className="flex items-center justify-between">
                <span className="text-gray-200 text-base font-normal">Upsell Tips</span>
                <button
                  type="button"
                  onClick={() => toggleAiPref('upsellTips', 'Upsell Tips')}
                  className={`px-2 py-0.5 rounded-[5px] outline outline-1 outline-offset-[-1px] text-sm font-medium font-['Inter'] transition-colors cursor-pointer ${
                    aiPreferences.upsellTips
                      ? 'bg-emerald-500/10 outline-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                      : 'bg-gray-800 outline-white/5 text-gray-500 hover:bg-zinc-800'
                  }`}
                >
                  {aiPreferences.upsellTips ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* 4. Auto-prioritize Orders */}
              <div className="flex items-center justify-between">
                <span className="text-gray-200 text-base font-normal">Auto-prioritize Orders</span>
                <button
                  type="button"
                  onClick={() => toggleAiPref('autoPrioritizeOrders', 'Auto-prioritize Orders')}
                  className={`px-2 py-0.5 rounded-[5px] outline outline-1 outline-offset-[-1px] text-sm font-medium font-['Inter'] transition-colors cursor-pointer ${
                    aiPreferences.autoPrioritizeOrders
                      ? 'bg-emerald-500/10 outline-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                      : 'bg-gray-800 outline-white/5 text-gray-500 hover:bg-zinc-800'
                  }`}
                >
                  {aiPreferences.autoPrioritizeOrders ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Bar Station Audio & Alert Preferences */}
          <div className="bg-white/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[30px] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="w-4 h-4 text-amber-500" />
              <h3 className="text-gray-200 text-base font-semibold font-['Inter']">
                KDS Bar Audio Signals
              </h3>
            </div>
            <p className="text-zinc-500 text-sm font-normal mb-3 font-['Inter']">
              Audio chime when rush order tickets arrive at stations.
            </p>
            <div className="flex items-center justify-between text-sm text-zinc-300 font-['Inter']">
              <span>Chime Volume</span>
              <span className="text-amber-400 font-semibold font-['Inter']">80%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="80"
              className="w-full accent-amber-500 mt-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
