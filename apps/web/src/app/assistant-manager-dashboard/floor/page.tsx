import React from 'react';
import AssistantManagerDashboard from '../AssistantManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Floor Operations | Assistant Manager Dashboard | Tavonza AI',
  description:
    'Live floor overview, table occupancy, server assignments, and turn-time monitoring.',
};

export default function Page() {
  return <AssistantManagerDashboard initialNav="Floor" />;
}
