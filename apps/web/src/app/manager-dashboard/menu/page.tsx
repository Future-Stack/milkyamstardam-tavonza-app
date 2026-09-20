import React from 'react';
import ManagerDashboard from '../ManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Menu Management | Manager Dashboard | Tavonza AI',
  description:
    'Update restaurant item availability, prices, descriptions, and categories with real-time dining sync.',
};

export default function Page() {
  return <ManagerDashboard initialTab="Menu" />;
}
