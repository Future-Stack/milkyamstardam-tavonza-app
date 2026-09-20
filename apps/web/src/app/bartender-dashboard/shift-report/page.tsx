import React from 'react';
import BartenderDashboard from '../BartenderDashboard';

export const metadata = {
  title: 'Shift Report | Bartender Dashboard | Tavonza AI Hospitality',
  description: 'Tavonza AI — data-driven recommendations, shift performance breakdown, drinks served vs target, and mixology logs.',
};

export default function Page() {
  return <BartenderDashboard initialNav="Shift Report" />;
}
