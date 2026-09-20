import React from 'react';
import ManagerDashboard from '../ManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'QR Ordering | Manager Dashboard | Tavonza AI',
  description:
    'Manage contactless table QR codes, multilingual auto-translation, real-time scan metrics, and table ordering settings.',
};

export default function Page() {
  return <ManagerDashboard initialTab="QR Ordering" />;
}
