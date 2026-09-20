import React from 'react';
import AssistantManagerDashboard from '../AssistantManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Operations Settings | Assistant Manager Dashboard | Tavonza AI',
  description:
    'Turn-time alerts, automated busser notification settings, and floor operational rules.',
};

export default function Page() {
  return <AssistantManagerDashboard initialNav="Settings" />;
}
