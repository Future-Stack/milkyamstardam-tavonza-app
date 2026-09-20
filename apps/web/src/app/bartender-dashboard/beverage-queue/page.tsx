import React from 'react';
import BartenderDashboard from '../BartenderDashboard';

export const metadata = {
  title: 'Beverage Queue | Bartender Dashboard | Tavonza AI Hospitality',
  description: 'Live beverage orders awaiting preparation, cocktail station tracking, and priority ticket routing.',
};

export default function Page() {
  return <BartenderDashboard initialNav="Beverage Queue" />;
}
