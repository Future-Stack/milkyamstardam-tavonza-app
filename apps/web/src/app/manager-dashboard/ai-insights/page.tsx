import React from 'react';
import ManagerDashboard from '../ManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'AI Insights | Manager Dashboard | Tavonza AI',
  description:
    'Tavonza AI-powered operational intelligence, revenue forecasting, staffing optimizations, and kitchen efficiency recommendations.',
};

export default function Page() {
  return <ManagerDashboard initialTab="AI Insights" />;
}
