import React from 'react';
import ManagerDashboard from './ManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Manager Dashboard | Tavonza AI Hospitality',
  description:
    'Comprehensive operational command center for restaurant managers featuring live orders, staff metrics, kitchen queues, and Tavonza AI intelligence.',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const tab =
    (Array.isArray(resolvedParams?.tab)
      ? resolvedParams?.tab[0]
      : resolvedParams?.tab) || 'Dashboard';

  return <ManagerDashboard initialTab={tab} />;
}
