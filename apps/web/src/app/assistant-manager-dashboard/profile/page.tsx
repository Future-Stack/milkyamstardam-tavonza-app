import React from 'react';
import AssistantManagerDashboard from '../AssistantManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Profile & Credentials | Assistant Manager Dashboard | Tavonza AI',
  description:
    'Manager security privileges, shift history, and floor authorization levels.',
};

export default function Page() {
  return <AssistantManagerDashboard initialNav="Profile" />;
}
