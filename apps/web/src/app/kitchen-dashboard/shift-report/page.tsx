import React from 'react';
import KitchenDashboard from '../KitchenDashboard';

export const metadata = {
  title: 'Shift Report | Kitchen Dashboard | Tavonza',
  description: 'Kitchen shift analytics, ticket speed, and culinary performance.',
};

export default function Page() {
  return <KitchenDashboard initialNav="Shift Report" />;
}
