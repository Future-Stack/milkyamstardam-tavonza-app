import React from 'react';
import BartenderDashboard from '../BartenderDashboard';

export const metadata = {
  title: 'Drink Orders | Bartender Dashboard | Tavonza AI Hospitality',
  description: 'Full drink order history, live status tracking, table assignments, and mixology ticket logs.',
};

export default function Page() {
  return <BartenderDashboard initialNav="Drink Orders" />;
}
