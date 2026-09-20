'use client';

import React, { useState } from 'react';
import {
  Printer,
  Download,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Check,
  TrendingUp,
  FileSpreadsheet,
  Wine,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

export default function ShiftReportView() {
  const [selectedShift, setSelectedShift] = useState<'Morning' | 'Evening' | 'Full Day'>('Morning');
  const [hoveredBar, setHoveredBar] = useState<{ time: string; served: number; target: number } | null>(null);

  // Hourly drinks data for Drinks Served vs Target
  // Y max is ~68, points: 10am (25), 11am (28), 12pm (38), 1pm (25), 2pm (45), 3pm (58), 4pm (34)
  const hourlyServedData = [
    { time: '10am', served: 25, target: 30, heightPx: 75 },
    { time: '11am', served: 28, target: 30, heightPx: 85 },
    { time: '12pm', served: 38, target: 35, heightPx: 115 },
    { time: '1pm', served: 25, target: 30, heightPx: 75 },
    { time: '2pm', served: 45, target: 40, heightPx: 135 },
    { time: '3pm', served: 58, target: 50, heightPx: 175 },
    { time: '4pm', served: 34, target: 35, heightPx: 105 },
  ];

  // Shift details based on selection
  const shiftMetrics = {
    Morning: {
      shiftTime: 'Morning (07:00 – 15:00)',
      bartenders: 'James Carter, Sarah Nguyen',
      drinksServed: 142,
      revenue: '$1,284.00',
      revenueDisplay: '$1,284',
      avgPrepTime: '4 min',
      accuracyRate: '99.2%',
      ordersCompleted: '142',
      ordersDelayed: '02',
      peakHour: '13:00 – 14:00 (55 drinks)',
      topDrink: 'Signature Mojito (34×)',
    },
    Evening: {
      shiftTime: 'Evening (15:00 – 23:00)',
      bartenders: 'Leo Chang, Maria Vance',
      drinksServed: 198,
      revenue: '$1,940.00',
      revenueDisplay: '$1,940',
      avgPrepTime: '3.8 min',
      accuracyRate: '98.7%',
      ordersCompleted: '194',
      ordersDelayed: '04',
      peakHour: '20:00 – 21:00 (68 drinks)',
      topDrink: 'Smoked Paloma (42×)',
    },
    'Full Day': {
      shiftTime: 'Full Day Operations',
      bartenders: '4 Mixologists on Duty',
      drinksServed: 340,
      revenue: '$3,224.00',
      revenueDisplay: '$3,224',
      avgPrepTime: '3.9 min',
      accuracyRate: '99.0%',
      ordersCompleted: '336',
      ordersDelayed: '06',
      peakHour: '20:00 – 21:00 (68 drinks)',
      topDrink: 'Signature Mojito (76×)',
    },
  }[selectedShift];

  // Print shift report
  const handlePrint = () => {
    toast.info('Preparing print layout for Shift Report...');
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Export shift report CSV
  const handleExportCSV = () => {
    const csvContent = [
      ['Tavonza AI Hospitality - Shift Report'],
      ['Shift Period', shiftMetrics.shiftTime],
      ['Bartenders', `"${shiftMetrics.bartenders}"`],
      ['Total Drinks Served', shiftMetrics.drinksServed],
      ['Total Revenue', shiftMetrics.revenue],
      ['Avg Prep Time', shiftMetrics.avgPrepTime],
      ['Accuracy Rate', shiftMetrics.accuracyRate],
      ['Orders Completed', shiftMetrics.ordersCompleted],
      ['Orders Delayed', shiftMetrics.ordersDelayed],
      ['Peak Hour', `"${shiftMetrics.peakHour}"`],
      ['Top Drink', `"${shiftMetrics.topDrink}"`],
      [''],
      ['Hourly Performance Breakdown'],
      ['Time', 'Served', 'Target', 'Status'],
      ...hourlyServedData.map((d) => [
        d.time,
        d.served,
        d.target,
        d.served >= d.target ? 'Target Met' : 'Below Target',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `shift-report-${selectedShift.toLowerCase().replace(/\s+/g, '-')}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${selectedShift} Shift Report to CSV`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-4xl font-semibold font-['Inter'] leading-9 tracking-tight">
            Shift Report
          </h1>
          <p className="text-zinc-500 text-lg font-normal font-['Inter'] leading-6 mt-1">
            Tavonza AI — data-driven recommendations for your bar
          </p>
        </div>

        {/* Action Buttons: Shift selector, Print, Export */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Shift Selector */}
          <div className="relative">
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value as typeof selectedShift)}
              className="h-9 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-[10px] text-sm font-semibold text-white focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="Morning">Morning Shift (07:00 - 15:00)</option>
              <option value="Evening">Evening Shift (15:00 - 23:00)</option>
              <option value="Full Day">Full Day (All Shifts)</option>
            </select>
          </div>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-200/20 flex items-center gap-1.5 text-white text-sm font-semibold font-['Inter'] leading-5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span>Print</span>
          </button>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-200/20 flex items-center gap-1.5 text-white text-sm font-semibold font-['Inter'] leading-5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Drinks Served */}
        <div className="h-20 p-4 bg-white/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-[10.20px] flex flex-col justify-center items-center text-center">
          <div className="text-white text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-5">
            {shiftMetrics.drinksServed}
          </div>
          <div className="text-zinc-500 text-base font-medium font-['Inter'] leading-4 mt-1">
            Drinks Served
          </div>
        </div>

        {/* Card 2: Revenue */}
        <div className="h-20 p-4 bg-white/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-[10.20px] flex flex-col justify-center items-center text-center">
          <div className="text-emerald-500 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-5">
            {shiftMetrics.revenueDisplay}
          </div>
          <div className="text-zinc-500 text-base font-medium font-['Inter'] leading-4 mt-1">
            Revenue
          </div>
        </div>

        {/* Card 3: Avg Prep Time */}
        <div className="h-20 p-4 bg-white/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-[10.20px] flex flex-col justify-center items-center text-center">
          <div className="text-white text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-5">
            {shiftMetrics.avgPrepTime}
          </div>
          <div className="text-zinc-500 text-base font-medium font-['Inter'] leading-4 mt-1">
            Avg Prep Time
          </div>
        </div>

        {/* Card 4: Accuracy Rate */}
        <div className="h-20 p-4 bg-white/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-[10.20px] flex flex-col justify-center items-center text-center">
          <div className="text-amber-500 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-5">
            {shiftMetrics.accuracyRate}
          </div>
          <div className="text-zinc-500 text-base font-medium font-['Inter'] leading-4 mt-1">
            Accuracy Rate
          </div>
        </div>
      </div>

      {/* 3. Middle Row: Drinks Served vs Target Chart & Shift Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Card: Drinks Served vs Target (Screenshot matching) */}
        <div className="lg:col-span-7 xl:col-span-7 bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] p-6 min-h-[384px] flex flex-col justify-between relative overflow-hidden">
          {/* Card Title */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white text-lg font-semibold font-['Inter'] leading-9">
              Drinks Served vs Target
            </h2>
            <div className="flex items-center gap-4 text-sm font-['Inter'] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500" />
                <span>Served</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 border-t border-dashed border-zinc-500" />
                <span>Target</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Area */}
          <div className="relative w-full h-64 select-none flex items-end">
            {/* Left Y-axis labels */}
            <div className="w-8 h-56 flex flex-col justify-between text-right text-sm font-normal font-['Inter'] text-zinc-400 pb-6 pr-2 pointer-events-none">
              <span>68</span>
              <span>45</span>
              <span>38</span>
              <span>15</span>
              <span>00</span>
            </div>

            {/* Chart Grid and Columns */}
            <div className="flex-1 h-56 relative rounded-[5px] outline outline-[0.50px] outline-offset-[-0.50px] outline-zinc-600/70 overflow-hidden bg-black/20">
              {/* Horizontal Grid lines matching screenshot */}
              <div className="absolute left-0 right-0 top-[20%] border-b border-zinc-700/40 border-dashed" />
              <div className="absolute left-0 right-0 top-[40%] border-b border-zinc-700/40 border-dashed" />
              <div className="absolute left-0 right-0 top-[60%] border-b border-zinc-700/40 border-dashed" />
              <div className="absolute left-0 right-0 top-[80%] border-b border-zinc-700/40 border-dashed" />

              {/* 7 Yellow Bar Columns */}
              <div className="absolute inset-0 px-4 flex items-end justify-between">
                {hourlyServedData.map((d, idx) => {
                  const isPeak = d.served === 58;
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center justify-end h-full group"
                      onMouseEnter={() => setHoveredBar(d)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Bar Pillar */}
                      <div
                        className="w-6 sm:w-7 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 rounded-t-[5px] transition-all duration-200 cursor-pointer relative shadow-md group-hover:shadow-yellow-500/20"
                        style={{ height: `${d.heightPx}px` }}
                      >
                        {isPeak && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-amber-400 bg-zinc-900 border border-amber-500/40 px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap">
                            Peak
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hover Tooltip display */}
              {hoveredBar && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-zinc-900/95 border border-amber-500/50 px-3 py-1.5 rounded-lg shadow-xl text-sm font-['Inter'] pointer-events-none z-10 animate-in fade-in">
                  <span className="text-zinc-400">{hoveredBar.time}: </span>
                  <span className="font-bold text-amber-400">{hoveredBar.served} drinks served</span>
                  <span className="text-zinc-500 ml-1">/ target {hoveredBar.target}</span>
                </div>
              )}
            </div>
          </div>

          {/* X-axis Timeline Labels */}
          <div className="ml-8 mt-2 flex justify-between text-sm font-normal font-['Inter'] text-zinc-400 px-4">
            {hourlyServedData.map((d, i) => (
              <span key={i} className="text-center">{d.time}</span>
            ))}
          </div>
        </div>

        {/* Right Card: Shift Breakdown */}
        <div className="lg:col-span-5 xl:col-span-5 bg-white/10 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-white/10 p-6 flex flex-col justify-between min-h-[384px]">
          <div>
            <h2 className="text-white text-lg font-semibold font-['Inter'] leading-9 mb-1">
              Shift Breakdown
            </h2>

            {/* Spec rows with glass dividers matching Figma */}
            <div className="divide-y divide-white/10 text-base font-['Inter']">
              {/* Row 1: Shift */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-white text-lg font-normal">Shift</span>
                <span className="text-gray-200 text-sm font-medium font-['Outfit']">
                  {shiftMetrics.shiftTime}
                </span>
              </div>

              {/* Row 2: Bartender */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-white text-lg font-normal">Bartender</span>
                <span className="text-gray-200 text-sm font-medium font-['Outfit']">
                  {shiftMetrics.bartenders}
                </span>
              </div>

              {/* Row 3: Orders Completed */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-white text-lg font-normal">Orders Completed</span>
                <span className="text-gray-200 text-sm font-medium font-['Outfit']">
                  {shiftMetrics.ordersCompleted}
                </span>
              </div>

              {/* Row 4: Orders Delayed */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-white text-lg font-normal">Orders Delayed</span>
                <span className="text-gray-200 text-sm font-medium font-['Outfit']">
                  {shiftMetrics.ordersDelayed}
                </span>
              </div>

              {/* Row 5: Peak Hour */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-white text-lg font-normal">Peak Hour</span>
                <span className="text-gray-200 text-sm font-medium font-['Outfit']">
                  {shiftMetrics.peakHour}
                </span>
              </div>

              {/* Row 6: Top Drink */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-white text-lg font-normal">Top Drink</span>
                <span className="text-gray-200 text-sm font-medium font-['Outfit']">
                  {shiftMetrics.topDrink}
                </span>
              </div>

              {/* Row 7: Revenue */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-white text-lg font-normal">Revenue</span>
                <span className="text-gray-200 text-sm font-medium font-['Outfit'] font-bold text-amber-400">
                  {shiftMetrics.revenue}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Container: AI Shift Analysis */}
      <div className="bg-white/5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[30px] p-6 overflow-hidden">
        <h2 className="text-gray-200 text-base font-semibold font-['Outfit'] leading-5 mb-4">
          AI Shift Analysis
        </h2>

        {/* 3 Strategy Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Box 1: What Worked Well */}
          <div className="p-4 bg-gray-800/40 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/5 flex flex-col justify-start">
            <h3 className="text-gray-200 text-base font-semibold font-['Outfit'] leading-5 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              What Worked Well
            </h3>
            <div className="space-y-2.5 text-sm font-normal font-['Outfit'] text-gray-400">
              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>95% efficiency rating maintained all shift</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Zero cocktail quality rejections</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>VIP orders prioritized successfully</span>
              </div>
            </div>
          </div>

          {/* Box 2: Areas for Improvement */}
          <div className="p-4 bg-gray-800/40 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/5 flex flex-col justify-start">
            <h3 className="text-gray-200 text-base font-semibold font-['Outfit'] leading-5 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Areas for Improvement
            </h3>
            <div className="space-y-2.5 text-sm font-normal font-['Outfit'] text-gray-400">
              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Fresh mint restocking delayed by 30 min</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>2 orders exceeded 6-minute prep time</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Coffee station had brief slowdown at 11 AM</span>
              </div>
            </div>
          </div>

          {/* Box 3: Tomorrow's Focus */}
          <div className="p-4 bg-gray-800/40 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/5 flex flex-col justify-start">
            <h3 className="text-gray-200 text-base font-semibold font-['Outfit'] leading-5 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Tomorrow's Focus
            </h3>
            <div className="space-y-2.5 text-sm font-normal font-['Outfit'] text-gray-400">
              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Pre-stock mint before shift starts</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Add 1 more bartender during 12–14:00</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Run coffee machine maintenance tonight</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
