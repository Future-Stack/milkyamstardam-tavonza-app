import React from 'react';
import ManagerDashboard from '../ManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Staff Management | Manager Dashboard | Tavonza AI',
  description:
    'Monitor team activity, table allocations, service ratings, shift schedules, and team performance with real-time AI insights.',
};

export default function Page() {
  return <ManagerDashboard initialTab="Staff" />;
}
