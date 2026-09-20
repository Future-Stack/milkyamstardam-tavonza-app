import React from 'react';
import ManagerDashboard from '../ManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Notifications | Manager Dashboard | Tavonza AI',
  description:
    'Real-time operational alerts, table waiting thresholds, kitchen prep delays, and inventory notifications.',
};

export default function Page() {
  return <ManagerDashboard initialTab="Notifications" />;
}
