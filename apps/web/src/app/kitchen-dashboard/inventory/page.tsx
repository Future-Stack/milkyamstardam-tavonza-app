import React from 'react';
import KitchenDashboard from '../KitchenDashboard';

export const metadata = {
  title: 'Kitchen Inventory | Kitchen Dashboard | Tavonza',
  description: 'Real-time stock alerts and ingredient levels.',
};

export default function Page() {
  return <KitchenDashboard initialNav="Inventory" />;
}
