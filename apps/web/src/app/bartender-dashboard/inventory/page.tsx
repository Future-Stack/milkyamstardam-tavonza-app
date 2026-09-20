import React from 'react';
import BartenderDashboard from '../BartenderDashboard';

export const metadata = {
  title: 'Inventory | Bartender Dashboard | Tavonza AI Hospitality',
  description: 'Track stock levels, monitor low stock ingredients, replenish bar supplies, and manage beverage inventory with pagination.',
};

export default function Page() {
  return <BartenderDashboard initialNav="Inventory" />;
}
