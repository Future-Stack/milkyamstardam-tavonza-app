import React from 'react';
import CashierDashboard from './CashierDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Cashier Dashboard | Tavonza AI Hospitality',
  description: 'Real-time cashier station command center for POS orders, transactions, payment analytics, and checkout workflow.',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const tab = (Array.isArray(resolvedParams?.tab) ? resolvedParams?.tab[0] : resolvedParams?.tab) || 'Dashboard';

  return <CashierDashboard initialNav={tab} />;
}
