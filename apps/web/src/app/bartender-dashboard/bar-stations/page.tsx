import React from 'react';
import BartenderDashboard from '../BartenderDashboard';

export const metadata = {
  title: 'Bar Stations | Bartender Dashboard | Tavonza AI Hospitality',
  description: 'Real-time bar station monitoring, capacity management, order load balancing, and mixologist station assignment.',
};

export default function Page() {
  return <BartenderDashboard initialNav="Bar Stations" />;
}
