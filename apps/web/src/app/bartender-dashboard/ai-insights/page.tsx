import React from 'react';
import BartenderDashboard from '../BartenderDashboard';

export const metadata = {
  title: 'AI Insights | Bartender Dashboard | Tavonza AI Hospitality',
  description: 'Tavonza AI — data-driven recommendations, hourly demand forecasting, revenue category breakdown, and smart mixology optimizations.',
};

export default function Page() {
  return <BartenderDashboard initialNav="AI Insights" />;
}
