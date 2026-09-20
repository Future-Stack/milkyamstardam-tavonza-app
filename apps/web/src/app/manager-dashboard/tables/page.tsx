import React from 'react';
import ManagerDashboard from '../ManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tables & Floor Plan | Manager Dashboard | Tavonza AI',
  description:
    'Live floor plan - monitor table occupancy, manage table assignments, configure seating, and track real-time dining revenue.',
};

export default function Page() {
  return <ManagerDashboard initialTab="Tables" />;
}
