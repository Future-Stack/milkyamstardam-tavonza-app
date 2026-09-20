import React from 'react';
import AssistantManagerDashboard from '../AssistantManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Frontline Alerts | Assistant Manager Dashboard | Tavonza AI',
  description:
    'Live operations alerts, service bottlenecks, kitchen delay warnings, and immediate resolutions.',
};

export default function Page() {
  return <AssistantManagerDashboard initialNav="Alerts" />;
}
