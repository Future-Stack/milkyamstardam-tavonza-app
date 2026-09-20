import React from 'react';
import BartenderDashboard from '../BartenderDashboard';

export const metadata = {
  title: 'Drink Menu | Bartender Dashboard | Tavonza AI Hospitality',
  description: 'Manage and view all available beverages, cocktails, mocktails, juices, and coffee recipes with real-time stock toggling.',
};

export default function Page() {
  return <BartenderDashboard initialNav="Drink Menu" />;
}
