import React from 'react';
import ManagerDashboard from '../ManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Customer Management | Manager Dashboard | Tavonza AI',
  description: 'Loyalty profiles, customer history, feedback, and VIP management.',
};

export default function Page() {
  return <ManagerDashboard initialTab="Customers" />;
}
