import React from 'react';
import ManagerDashboard from '../ManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Settings | Manager Dashboard | Tavonza AI',
  description:
    'Configure restaurant information, operational notifications, integrations, and Tavonza AI operations.',
};

export default function Page() {
  return <ManagerDashboard initialTab="Settings" />;
}
