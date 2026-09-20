import React from 'react';
import AssistantManagerDashboard from '../AssistantManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Jarvis AI Copilot | Assistant Manager Dashboard | Tavonza AI',
  description:
    'Real-time predictive turnover, autonomous delay detection, and smart floor recommendations.',
};

export default function Page() {
  return <AssistantManagerDashboard initialNav="Jarvis" />;
}
