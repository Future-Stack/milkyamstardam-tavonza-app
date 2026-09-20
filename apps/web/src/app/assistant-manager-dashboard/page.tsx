import React from 'react';
import AssistantManagerDashboard from './AssistantManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Assistant Manager Dashboard | Tavonza AI Hospitality',
  description:
    'Live floor operational command center for Assistant Managers featuring table status, frontline alerts, 86 stock sync, and shift handover.',
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
      : resolvedParams?.tab) || 'Floor';

  return <AssistantManagerDashboard initialNav={tab} />;
}
