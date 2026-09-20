'use client';

import React from 'react';
import {
  RestaurantInfoCard,
  NotificationsSettingsCard,
  AIOperationsCard,
  IntegrationsCard,
} from './components';
import {
  initialRestaurantInfo,
  initialNotificationToggles,
  initialAIOperationToggles,
  initialIntegrations,
} from '../data';

export const SettingsView: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-1 select-none">
        <h1 className="text-white text-3xl sm:text-4xl font-semibold font-['Inter'] leading-9 tracking-tight">
          Settings
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg font-normal font-['Inter'] leading-6">
          Configure your restaurant and operations
        </p>
      </div>

      {/* 2. 2-Column Grid matching Figma design */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-start">
        {/* Left Column: Restaurant Information + Integrations */}
        <div className="flex flex-col space-y-6">
          <RestaurantInfoCard initialInfo={initialRestaurantInfo} />
          <IntegrationsCard integrations={initialIntegrations} />
        </div>

        {/* Right Column: Notifications + AI Operations */}
        <div className="flex flex-col space-y-6">
          <NotificationsSettingsCard initialToggles={initialNotificationToggles} />
          <AIOperationsCard initialToggles={initialAIOperationToggles} />
        </div>
      </div>
    </div>
  );
};

export const ManagerSettingsView = SettingsView;
export default SettingsView;
