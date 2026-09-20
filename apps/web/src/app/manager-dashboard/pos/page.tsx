import React from 'react';
import ManagerDashboard from '../ManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Point of Sale (POS) | Manager Dashboard | Tavonza AI',
  description:
    'Create and manage orders at the counter with multi-category filtering, real-time cart calculations, and instant payment checkout.',
};

export default function Page() {
  return <ManagerDashboard initialTab="POS" />;
}
