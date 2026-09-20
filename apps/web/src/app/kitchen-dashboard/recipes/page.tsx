import React from 'react';
import KitchenDashboard from '../KitchenDashboard';

export const metadata = {
  title: 'Kitchen Recipes | Kitchen Dashboard | Tavonza',
  description: 'Culinary specifications, recipe steps, and portioning.',
};

export default function Page() {
  return <KitchenDashboard initialNav="Recipes" />;
}
