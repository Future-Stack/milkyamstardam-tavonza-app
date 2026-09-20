import React from 'react';
import BartenderDashboard from './BartenderDashboard';

export const metadata = {
  title: 'Bartender Dashboard & Beverage Queue | Tavonza AI Hospitality',
  description: 'Real-time bar operations, live drink order queues, cocktail station load balancing, and AI mixology insights.',
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

  return <BartenderDashboard initialNav={tab} />;
}
