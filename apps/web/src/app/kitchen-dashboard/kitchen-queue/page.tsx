import React from 'react';
import KitchenDashboard from '../KitchenDashboard';

export const metadata = {
  title: 'Kitchen Queue | Kitchen Dashboard | Tavonza',
  description: 'Live order queue and incoming ticket stream.',
};

export default function Page() {
  return <KitchenDashboard initialNav="Kitchen Queue" />;
}
