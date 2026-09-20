'use client';

import React, { useState } from 'react';
import {
  ReportHeader,
  ReportKPICards,
  HourlyTrafficChart,
  RevenueByCategoryChart,
  ReportBreakdownTable,
} from './components';
import { AnalyticsTimeframe } from '../types';
import {
  timeframeAnalyticsKPIs,
  initialTrafficData,
  initialCategoryRevenue,
  initialCategoryBreakdown,
} from '../data';
import { toast } from 'sonner';

interface ReportsViewProps {
  onAskAI?: (prompt?: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onAskAI }) => {
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>('This Week');
  const currentKPIs = timeframeAnalyticsKPIs[timeframe] || timeframeAnalyticsKPIs['This Week'];

  const handleExportPDF = () => {
    toast.success(`Exporting ${timeframe} Analytics & Reports PDF for Downtown Branch...`);
  };

  const handleAskAIPress = () => {
    if (onAskAI) {
      onAskAI(`Analyze the ${timeframe} restaurant reports and highlight key revenue opportunities.`);
    } else {
      toast.info('Opening AI Copilot Analysis...');
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 pb-10">
      {/* 1. Header with Timeframe Tabs and Export Action */}
      <ReportHeader
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        onExportPDF={handleExportPDF}
        onAskAI={handleAskAIPress}
      />

      {/* 2. Top KPI Metric Cards (Green, Blue, Yellow, Purple outlines) */}
      <ReportKPICards kpis={currentKPIs} />

      {/* 3. Middle Row: Hourly Traffic (Left) & Revenue by Category Donut (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
        {/* Hourly Traffic Chart (Matches Figma Image 1) */}
        <div className="lg:col-span-7 xl:col-span-8 flex">
          <HourlyTrafficChart data={initialTrafficData} />
        </div>

        {/* Revenue by Category Donut (Matches Figma Image 2) */}
        <div className="lg:col-span-5 xl:col-span-4 flex">
          <RevenueByCategoryChart categories={initialCategoryRevenue} />
        </div>
      </div>

      {/* 4. Bottom Row: Category Performance Breakdown Table */}
      <div className="w-full">
        <ReportBreakdownTable rows={initialCategoryBreakdown} />
      </div>
    </div>
  );
};

export const ManagerReportsView = ReportsView;
export default ReportsView;
