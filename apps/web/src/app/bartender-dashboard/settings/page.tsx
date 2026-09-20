import React from 'react';
import BartenderDashboard from '../BartenderDashboard';

export const metadata = {
  title: 'Settings | Bartender Dashboard | Tavonza AI Hospitality',
  description: 'Configure your Bar Command Center preferences, staff profile, notification alerts, and Tavonza AI mixology settings.',
};

export default function Page() {
  return <BartenderDashboard initialNav="Settings" />;
}
