import React from 'react';
import KitchenDashboard from '../KitchenDashboard';

export const metadata = {
  title: 'Future AI & Release Roadmap | Kitchen Dashboard | Tavonza',
  description: 'Upcoming Tavonza AI capabilities including Chef Auto-Assignment, Workload Balancing, Voice Commands, and Bottleneck Prediction.',
};

export default function Page() {
  return <KitchenDashboard initialNav="Future AI" />;
}
