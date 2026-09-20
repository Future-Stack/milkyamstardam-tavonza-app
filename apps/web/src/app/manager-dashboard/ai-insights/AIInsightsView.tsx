'use client';

import React, { useState } from 'react';
import {
  AIInsightsHeader,
  AIInsightsKPICards,
  InsightCard,
  TakeActionModal,
} from './components';
import { initialAIInsightsKPIs, initialAIInsightItems } from '../data';
import { AIInsightItem } from '../types';
import { toast } from 'sonner';

interface AIInsightsViewProps {
  onAskAI?: (prompt?: string) => void;
}

export const AIInsightsView: React.FC<AIInsightsViewProps> = ({ onAskAI }) => {
  const [kpis, setKpis] = useState(initialAIInsightsKPIs);
  const [insights, setInsights] = useState<AIInsightItem[]>(initialAIInsightItems);
  const [activeFilter, setActiveFilter] = useState<'all' | 'revenue' | 'staffing' | 'menu' | 'inventory' | 'kitchen'>('all');
  const [selectedInsight, setSelectedInsight] = useState<AIInsightItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setKpis((prev) => ({
        ...prev,
        insightsGenerated: prev.insightsGenerated + 1,
      }));
      toast.success('AI telemetry refreshed with 1 new real-time observation.');
    }, 900);
  };

  const handleConfirmAction = (insightId: string) => {
    setInsights((prev) =>
      prev.map((item) =>
        item.id === insightId ? { ...item, status: 'applied' } : item
      )
    );
    const target = insights.find((i) => i.id === insightId);
    toast.success(`Action applied successfully: "${target?.title}"`);
  };

  const handleAskAIPress = (prompt?: string) => {
    if (onAskAI) {
      onAskAI(prompt || 'Show me a detailed summary of today’s top restaurant operational AI insights.');
    } else {
      toast.info('Opening Tavonza AI Copilot...');
    }
  };

  const filteredInsights = insights.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.iconType === activeFilter;
  });

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 pb-12">
      {/* 1. Header with live status and refresh */}
      <AIInsightsHeader
        onAskAI={() => handleAskAIPress()}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* 2. Top 4 Frosted Glass Metric Cards (Insights Generated, Actions Suggested, Accuracy Rate, Efficiency Gain) */}
      <AIInsightsKPICards kpis={kpis} />

      {/* 3. Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-white/5 pb-3">
        {(
          [
            { id: 'all', label: 'All Insights' },
            { id: 'revenue', label: 'Revenue' },
            { id: 'staffing', label: 'Staffing' },
            { id: 'menu', label: 'Menu' },
            { id: 'inventory', label: 'Inventory' },
            { id: 'kitchen', label: 'Kitchen' },
          ] as const
        ).map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium font-['Inter'] transition-colors cursor-pointer ${
                isActive
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. 6 Operational Insight Cards Grid (3x2 on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {filteredInsights.map((insight) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            onTakeAction={(item) => setSelectedInsight(item)}
          />
        ))}
      </div>

      {/* 5. Take Action Modal */}
      <TakeActionModal
        insight={selectedInsight}
        isOpen={Boolean(selectedInsight)}
        onClose={() => setSelectedInsight(null)}
        onConfirmAction={handleConfirmAction}
        onAskAI={handleAskAIPress}
      />
    </div>
  );
};

export const ManagerAIInsightsView = AIInsightsView;
export default AIInsightsView;
