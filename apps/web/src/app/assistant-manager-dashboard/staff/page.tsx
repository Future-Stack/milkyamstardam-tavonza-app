import React from 'react';
import AssistantManagerDashboard from '../AssistantManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Floor Staff Roster | Assistant Manager Dashboard | Tavonza AI',
  description:
    'Monitor active server assignments, zone coverage, staff breaks, and handheld terminals.',
};

export default function Page() {
  return <AssistantManagerDashboard initialNav="Staff" />;
}
