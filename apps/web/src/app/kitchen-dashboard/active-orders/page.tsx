import React from 'react';
import KitchenDashboard from '../KitchenDashboard';

export const metadata = {
  title: 'Active Orders | Kitchen Dashboard | Tavonza',
  description: 'Currently preparing orders and priority cooking queue.',
};

export default function Page() {
  return <KitchenDashboard initialNav="Active Orders" />;
}
