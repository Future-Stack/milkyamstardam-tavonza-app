import React from 'react';
import ManagerDashboard from '../ManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Inventory Management | Manager Dashboard | Tavonza AI',
  description:
    'Track stock levels, monitor critical thresholds, and manage supplier reorders with AI hospitality intelligence.',
};

export default function Page() {
  return <ManagerDashboard initialTab="Inventory" />;
}
