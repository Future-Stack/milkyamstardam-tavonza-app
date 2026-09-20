import React from 'react';
import KitchenDashboard from '../KitchenDashboard';

export const metadata = {
  title: 'AI Insights | Kitchen Dashboard | Tavonza',
  description: 'Predictive kitchen demand modeling and automated culinary briefings.',
};

export default function Page() {
  return <KitchenDashboard initialNav="AI Insights" />;
}
