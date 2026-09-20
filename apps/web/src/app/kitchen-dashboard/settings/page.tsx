import React from 'react';
import KitchenDashboard from '../KitchenDashboard';

export const metadata = {
  title: 'Settings & Preferences | Kitchen Dashboard | Tavonza',
  description: 'Manage chef profiles, kitchen thresholds, notification alerts, appearance, and Tavonza AI configurations.',
};

export default function Page() {
  return <KitchenDashboard initialNav="Settings" />;
}
