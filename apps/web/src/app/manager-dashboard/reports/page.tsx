import React from 'react';
import ManagerDashboard from '../ManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Analytics & Reports | Manager Dashboard | Tavonza AI',
  description:
    'Deep dive into your restaurant performance metrics, hourly guest traffic, and category revenue distribution.',
};

export default function Page() {
  return <ManagerDashboard initialTab="Reports" />;
}
