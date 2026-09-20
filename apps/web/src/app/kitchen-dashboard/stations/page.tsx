import React from 'react';
import KitchenDashboard from '../KitchenDashboard';

export const metadata = {
  title: 'Kitchen Stations | Kitchen Dashboard | Tavonza',
  description: 'Station status, line load balancing, and active orders by station.',
};

export default function Page() {
  return <KitchenDashboard initialNav="Stations" />;
}
