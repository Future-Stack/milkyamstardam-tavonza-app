import React from 'react';
import KitchenDashboard from './KitchenDashboard';

export const metadata = {
  title: 'Kitchen Dashboard & KDS | Tavonza AI Hospitality',
  description: 'Real-time kitchen operations, live order queues, station load balancing, and AI culinary forecasting.',
};

export const dynamic = 'force-dynamic';

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

  return <KitchenDashboard initialNav={tab} />;
}
