import React from 'react';
import ManagerDashboard from '../ManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Live Order Center | Manager Dashboard | Tavonza AI',
  description:
    'Real-time order tracking across all tables with active filters, table statuses, ETA monitoring, and new order creation.',
};

export default function Page() {
  return <ManagerDashboard initialTab="Live Orders" />;
}
