import React from 'react';
import CashierDashboard from './CashierDashboard';

export const metadata = {
  title: 'Cashier POS & Bill Queue | Tavonza AI Hospitality',
  description: 'Real-time cashier station for bill queues, walk-in counter ordering, shift history, and alerts.',
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
      : resolvedParams?.tab) || 'queue';

  return <CashierDashboard initialTab={tab} />;
}
