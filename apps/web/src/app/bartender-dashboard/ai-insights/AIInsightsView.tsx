'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Flame,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  MessageSquare,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  Send,
  Coffee,
  Wine,
  CupSoda,
  Citrus,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';

export default function AIInsightsView() {
  const [timeframe, setTimeframe] = useState<'Today' | 'This Week' | 'Peak Hours'>('Today');
  const [hoveredHour, setHoveredHour] = useState<{ hour: string; value: number } | null>(null);
  const [activeCategorySegment, setActiveCategorySegment] = useState<string | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: "Hello! I'm Tavonza AI for your bar. Tonight, cocktail demand is predicted to peak at 8:30 PM with Mojitos and Mezcal Palomas. How can I assist you?",
      time: 'Just now',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');

  // Hourly demand curve data points
  // 10am (38), 12pm (48), 2pm (38), 4pm (55), 6pm (68), 8pm (85), 10pm (75)
  const hourlyData = [
    { hour: '10am', x: 20, y: 155, value: 38 },
    { hour: '12pm', x: 105, y: 135, value: 48 },
    { hour: '2pm', x: 190, y: 155, value: 38 },
    { hour: '4pm', x: 275, y: 120, value: 55 },
    { hour: '6pm', x: 360, y: 92, value: 68 },
    { hour: '8pm', x: 445, y: 55, value: 85 },
    { hour: '10pm', x: 530, y: 78, value: 75 },
  ];

  // SVG spline path generator
  const curvePath = 'M 20 155 C 60 130, 80 135, 105 135 C 130 135, 160 160, 190 155 C 220 150, 250 125, 275 120 C 300 115, 335 100, 360 92 C 400 80, 420 50, 445 55 C 475 60, 500 70, 530 78';
  const fillPath = `${curvePath} L 530 200 L 20 200 Z`;

  // Categories breakdown data
  const categories = [
    { name: 'Cocktails', percentage: 38, color: '#f97316', bgDot: 'bg-orange-500', revenue: '$2,840' },
    { name: 'Coffee', percentage: 22, color: '#3b82f6', bgDot: 'bg-blue-500', revenue: '$1,645' },
    { name: 'Soft Drinks', percentage: 18, color: '#a855f7', bgDot: 'bg-purple-500', revenue: '$1,346' },
    { name: 'Juices', percentage: 12, color: '#22c55e', bgDot: 'bg-green-500', revenue: '$897' },
    { name: 'Mocktails & Other', percentage: 10, color: '#ec4899', bgDot: 'bg-pink-500', revenue: '$748' },
  ];

  // Top selling drinks
  const topSellingDrinks = [
    { rank: '01', name: 'Signature Mojito', sold: '34 sold', revenue: '$306', category: 'Cocktail' },
    { rank: '02', name: 'Iced Latte', sold: '28 sold', revenue: '$182', category: 'Coffee' },
    { rank: '03', name: 'Fresh Lime Soda', sold: '21 sold', revenue: '$94.50', category: 'Soft Drink' },
    { rank: '04', name: 'Cappuccino', sold: '18 sold', revenue: '$90', category: 'Coffee' },
  ];

  // Smart recommendations
  const recommendations = [
    {
      id: 'rec-1',
      title: 'Top Seller',
      desc: "Signature Mojito is today's top-selling beverage.",
      actionText: 'Prep More',
      type: 'prep',
      actionPrompt: 'Batched fresh mint and lime prep initiated for Signature Mojito.',
    },
    {
      id: 'rec-2',
      title: 'Demand Forecast',
      desc: 'Cold beverages expected to increase by 25% between 6–9 PM.',
      actionText: 'Pre-chill',
      type: 'chill',
      actionPrompt: 'Glassware pre-chilling cycle scheduled in auxiliary coolers.',
    },
    {
      id: 'rec-3',
      title: 'Upsell Opportunity',
      desc: 'Customers ordering burgers are likely to purchase soft drinks.',
      actionText: 'Upsell',
      type: 'upsell',
      actionPrompt: 'Floor staff notified with burger beverage combo pairings.',
    },
    {
      id: 'rec-4',
      title: 'Stock Alert',
      desc: 'Fresh mint leaves critically low — restock before evening.',
      actionText: 'Restock',
      type: 'restock',
      actionPrompt: 'Dispatched emergency fresh herb delivery order to local distributor.',
    },
  ];

  const handleRecommendationAction = (rec: (typeof recommendations)[0]) => {
    toast.success(`${rec.actionText} applied: ${rec.actionPrompt}`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: inputQuestion,
      time: 'Just now',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');

    // AI Response simulation
    setTimeout(() => {
      let aiResponse = "Analyzing bar data: based on current throughput and customer check-ins, I recommend pre-garnishing 20 highball glasses with mint and lime wedges.";
      if (inputQuestion.toLowerCase().includes('ice')) {
        aiResponse = "Ice consumption is at 62% of bin capacity. The ice maker is running smoothly; estimated to meet 9 PM peak demand without supplemental bags.";
      } else if (inputQuestion.toLowerCase().includes('popular') || inputQuestion.toLowerCase().includes('special')) {
        aiResponse = "Today's top cocktail is the Signature Mojito (34 sold). For tonight's special, the Smoked Paloma has high profit margin (82%) and high customer rating.";
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiResponse,
          time: 'Just now',
        },
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-4xl font-semibold font-['Inter'] leading-9 tracking-tight flex items-center gap-2.5">
            AI Insights
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 font-['Inter']">
              Live Mixology Engine
            </span>
          </h1>
          <p className="text-zinc-500 text-lg font-normal font-['Inter'] leading-6 mt-1">
            Tavonza AI — data-driven recommendations for your bar
          </p>
        </div>

        {/* Action Button: Open AI Chat */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAIChatOpen(true)}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-[10px] shadow-[0px_1px_2px_-1px_rgba(255,214,168,1.00)] shadow-[0px_1px_3px_0px_rgba(255,214,168,1.00)] flex items-center gap-1.5 text-white font-semibold text-sm font-['Inter'] leading-5 transition-all duration-150 cursor-pointer hover:shadow-amber-400/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            <span>Open AI Chat</span>
          </button>
        </div>
      </div>

      {/* 2. Top Analytic Row: Hourly Demand Forecast & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Card: Hourly Demand Forecast (Screenshot 1 matching) */}
        <div className="lg:col-span-7 xl:col-span-7 bg-white/10 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-xl p-6 flex flex-col justify-between min-h-[384px] relative overflow-hidden">
          {/* Card Top Title & Timeframe Selector */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h2 className="text-white text-lg font-semibold font-['Inter'] leading-6">
                Hourly Demand Forecast
              </h2>
              <p className="text-neutral-400 text-sm font-normal font-['Inter'] leading-5 mt-0.5">
                Monitor your business performance across different time periods.
              </p>
            </div>

            {/* Timeframe selector button */}
            <div className="relative">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as typeof timeframe)}
                className="h-9 px-3.5 py-1.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-700 bg-zinc-900 text-neutral-300 text-sm font-normal font-['Inter'] cursor-pointer focus:outline-amber-500/50"
              >
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="Peak Hours">Peak Hours</option>
              </select>
            </div>
          </div>

          {/* SVG Chart Container */}
          <div className="relative w-full h-64 mt-2 select-none">
            {/* Y-axis Labels on Left */}
            <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-right text-sm font-normal font-['Inter'] text-zinc-400 pointer-events-none">
              <span>100</span>
              <span>75</span>
              <span>58</span>
              <span>25</span>
              <span>00</span>
            </div>

            {/* Main SVG Area */}
            <div className="ml-10 h-full relative">
              <svg
                viewBox="0 0 550 200"
                preserveAspectRatio="none"
                className="w-full h-52 overflow-visible"
              >
                <defs>
                  {/* Subtle vertical grid pattern */}
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#eab308" stopOpacity="0.28" />
                    <stop offset="70%" stopColor="#f97316" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#fb923c" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="10" y1="10" x2="540" y2="10" stroke="rgba(113, 113, 122, 0.25)" strokeDasharray="3 3" />
                <line x1="10" y1="55" x2="540" y2="55" stroke="rgba(113, 113, 122, 0.25)" strokeDasharray="3 3" />
                <line x1="10" y1="100" x2="540" y2="100" stroke="rgba(113, 113, 122, 0.25)" strokeDasharray="3 3" />
                <line x1="10" y1="145" x2="540" y2="145" stroke="rgba(113, 113, 122, 0.25)" strokeDasharray="3 3" />
                <line x1="10" y1="190" x2="540" y2="190" stroke="rgba(113, 113, 122, 0.35)" />

                {/* Vertical Grid lines */}
                {hourlyData.map((d, i) => (
                  <line
                    key={`vline-${i}`}
                    x1={d.x}
                    y1="10"
                    x2={d.x}
                    y2="190"
                    stroke="rgba(113, 113, 122, 0.2)"
                    strokeDasharray="3 3"
                  />
                ))}

                {/* Area Gradient Fill */}
                <path d={fillPath} fill="url(#areaGradient)" />

                {/* Smooth Yellow Bezier Spline */}
                <path
                  d={curvePath}
                  fill="none"
                  stroke="url(#strokeGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_2px_8px_rgba(234,179,8,0.4)]"
                />

                {/* Peak Indicator Glow Dot */}
                <circle cx="445" cy="55" r="4.5" fill="#facc15" className="animate-ping opacity-75" />
                <circle cx="445" cy="55" r="4" fill="#eab308" stroke="#ffffff" strokeWidth="1.5" />

                {/* Starting Point Dot */}
                <circle cx="20" cy="155" r="3.5" fill="#eab308" />

                {/* Interactive Points on Line */}
                {hourlyData.map((pt, i) => (
                  <circle
                    key={`point-${i}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    className="fill-amber-400 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    onMouseEnter={() => setHoveredHour({ hour: pt.hour, value: pt.value })}
                    onMouseLeave={() => setHoveredHour(null)}
                  />
                ))}
              </svg>

              {/* Hover Tooltip display */}
              {hoveredHour && (
                <div className="absolute top-2 right-4 bg-zinc-900/90 border border-amber-500/40 px-3 py-1.5 rounded-lg shadow-xl text-sm font-['Inter'] animate-in fade-in">
                  <span className="text-zinc-400">{hoveredHour.hour}: </span>
                  <span className="font-bold text-amber-400">{hoveredHour.value} orders predicted</span>
                </div>
              )}

              {/* X-axis Timeline Labels */}
              <div className="w-full flex justify-between text-sm font-normal font-['Inter'] text-zinc-400 pt-2 px-2">
                {hourlyData.map((d, i) => (
                  <span key={i} className="text-center">{d.hour}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Category Breakdown (Screenshot 2 matching) */}
        <div className="lg:col-span-5 xl:col-span-5 bg-white/10 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-white/10 p-6 flex flex-col justify-between min-h-[384px]">
          <div>
            <h2 className="text-white text-lg font-semibold font-['Inter'] leading-6">
              Category Breakdown
            </h2>
            <p className="text-slate-500 text-base font-normal font-['Inter'] leading-5 mt-0.5">
              Revenue by menu category this week.
            </p>
          </div>

          {/* Centered Donut Chart */}
          <div className="py-2 flex items-center justify-center relative">
            <svg width="150" height="150" viewBox="0 0 150 150" className="rotate-[-90deg]">
              {/* Donut Segments with exact percentages */}
              {/* Circumference: 2 * PI * 48 = ~301.6 */}
              {/* Cocktails: 38% -> 114.6 */}
              <circle
                cx="75"
                cy="75"
                r="48"
                fill="transparent"
                stroke="#f97316"
                strokeWidth="24"
                strokeDasharray="114.6 187"
                strokeDashoffset="0"
                className="hover:opacity-90 transition-opacity cursor-pointer"
                onMouseEnter={() => setActiveCategorySegment('Cocktails (38%)')}
                onMouseLeave={() => setActiveCategorySegment(null)}
              />
              {/* Coffee: 22% -> 66.3 */}
              <circle
                cx="75"
                cy="75"
                r="48"
                fill="transparent"
                stroke="#3b82f6"
                strokeWidth="24"
                strokeDasharray="66.3 235.3"
                strokeDashoffset="-114.6"
                className="hover:opacity-90 transition-opacity cursor-pointer"
                onMouseEnter={() => setActiveCategorySegment('Coffee (22%)')}
                onMouseLeave={() => setActiveCategorySegment(null)}
              />
              {/* Soft Drinks: 18% -> 54.3 */}
              <circle
                cx="75"
                cy="75"
                r="48"
                fill="transparent"
                stroke="#a855f7"
                strokeWidth="24"
                strokeDasharray="54.3 247.3"
                strokeDashoffset="-180.9"
                className="hover:opacity-90 transition-opacity cursor-pointer"
                onMouseEnter={() => setActiveCategorySegment('Soft Drinks (18%)')}
                onMouseLeave={() => setActiveCategorySegment(null)}
              />
              {/* Juices: 12% -> 36.2 */}
              <circle
                cx="75"
                cy="75"
                r="48"
                fill="transparent"
                stroke="#22c55e"
                strokeWidth="24"
                strokeDasharray="36.2 265.4"
                strokeDashoffset="-235.2"
                className="hover:opacity-90 transition-opacity cursor-pointer"
                onMouseEnter={() => setActiveCategorySegment('Juices (12%)')}
                onMouseLeave={() => setActiveCategorySegment(null)}
              />
              {/* Mocktails & Other: 10% -> 30.2 */}
              <circle
                cx="75"
                cy="75"
                r="48"
                fill="transparent"
                stroke="#ec4899"
                strokeWidth="24"
                strokeDasharray="30.2 271.4"
                strokeDashoffset="-271.4"
                className="hover:opacity-90 transition-opacity cursor-pointer"
                onMouseEnter={() => setActiveCategorySegment('Mocktails (10%)')}
                onMouseLeave={() => setActiveCategorySegment(null)}
              />
            </svg>

            {/* Inner Ring Glow */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">
                {activeCategorySegment ? 'CATEGORY' : 'TOTAL'}
              </span>
              <span className="text-base font-bold text-white font-['DM_Mono']">
                {activeCategorySegment ? activeCategorySegment.split(' ')[0] : '$7,476'}
              </span>
            </div>
          </div>

          {/* Legend Table Matching Screenshot */}
          <div className="space-y-2 pt-2">
            {categories.slice(0, 4).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm font-['Inter']">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${cat.bgDot}`} />
                  <span className="text-white font-normal">{cat.name}</span>
                </div>
                <span className="text-white font-medium font-['DM_Mono']">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Top Selling Drinks & Smart Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Top Selling Drinks (w-[524px] h-80 equivalent) */}
        <div className="lg:col-span-6 bg-white/10 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-xl p-6 flex flex-col justify-between min-h-[320px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white text-lg font-semibold font-['Inter'] leading-6">
                Top Selling Drinks
              </h2>
              <span className="text-xs text-zinc-500 uppercase font-mono tracking-wider">
                Shift Volume
              </span>
            </div>

            {/* Ranked Drinks List */}
            <div className="space-y-2.5">
              {topSellingDrinks.map((drink) => (
                <div
                  key={drink.rank}
                  className="h-14 p-3   hover:bg-white/[0.08] rounded-[5px] outline outline-1 outline-offset-[-1px] outline-white/5   flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge Circle */}
                    <div className="w-7 h-7 bg-blue-500/10 rounded-[20px] inline-flex justify-center items-center flex-shrink-0">
                      <span className="text-white text-sm font-normal font-['Inter'] leading-6">
                        {drink.rank}
                      </span>
                    </div>

                    {/* Drink Name */}
                    <div>
                      <div className="text-white text-sm font-medium font-['Inter'] leading-4">
                        {drink.name}
                      </div>
                      <div className="text-zinc-500 text-xs font-normal font-['Inter']">
                        {drink.category}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Sold and Revenue */}
                  <div className="flex items-center gap-6">
                    <div className="text-white text-sm font-medium font-['Inter'] leading-4">
                      {drink.sold}
                    </div>
                    <div className="text-emerald-500 text-sm font-medium font-['Inter'] leading-4 w-14 text-right">
                      {drink.revenue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Smart Recommendations (w-[559px] h-80 equivalent) */}
        <div className="lg:col-span-6 bg-white/10 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-xl p-6 flex flex-col justify-between min-h-[320px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white text-lg font-semibold font-['Inter'] leading-6">
                Smart Recommendations
              </h2>
              <span className="text-xs text-amber-400 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto-Generated
              </span>
            </div>

            {/* Recommendation Cards */}
            <div className="space-y-2.5">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="h-14 px-3 py-2   hover:bg-white/[0.08] rounded-[5px]  flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Icon */}
                    <div className="text-lg flex-shrink-0 text-gray-200 font-['Outfit']">
                      📈
                    </div>

                    {/* Content */}
                    <div className="min-w-0">
                      <div className="text-white text-xs font-medium font-['Inter'] leading-4">
                        {rec.title}
                      </div>
                      <div className="text-neutral-400 text-xs font-normal font-['Inter'] leading-4 truncate">
                        {rec.desc}
                      </div>
                    </div>
                  </div>

                  {/* Action Pill */}
                  <button
                    type="button"
                    onClick={() => handleRecommendationAction(rec)}
                    className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/30 rounded-sm outline outline-1 outline-offset-[-1px] outline-amber-500/20 text-amber-500 text-sm font-medium font-['JetBrains_Mono'] leading-4 transition-colors cursor-pointer flex-shrink-0"
                  >
                    {rec.actionText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive AI Chat Assistant Modal */}
      {isAIChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col h-[520px]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white font-['Inter'] flex items-center gap-2">
                    Tavonza AI Mixology Copilot
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <p className="text-xs text-zinc-400 font-['Inter']">
                    Real-time operational queries, demand forecasts & cocktail recipe assistance
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAIChatOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3 custom-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl text-sm font-['Inter'] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-400 text-white font-medium'
                        : 'bg-zinc-900 border border-white/10 text-zinc-200'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`block text-[10px] mt-1 ${
                        msg.sender === 'user' ? 'text-black/60 text-right' : 'text-zinc-500'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-5 py-2 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto text-xs text-zinc-400">
              <button
                type="button"
                onClick={() => setInputQuestion('Predict ice consumption for tonight')}
                className="px-2.5 py-1 rounded-full bg-zinc-900 border border-white/5 hover:border-amber-400/40 hover:text-white whitespace-nowrap cursor-pointer transition-colors"
              >
                🧊 Ice Forecast
              </button>
              <button
                type="button"
                onClick={() => setInputQuestion('Suggest tonight cocktail special')}
                className="px-2.5 py-1 rounded-full bg-zinc-900 border border-white/5 hover:border-amber-400/40 hover:text-white whitespace-nowrap cursor-pointer transition-colors"
              >
                🍸 Cocktail Special
              </button>
              <button
                type="button"
                onClick={() => setInputQuestion('How to prep for 8 PM rush?')}
                className="px-2.5 py-1 rounded-full bg-zinc-900 border border-white/5 hover:border-amber-400/40 hover:text-white whitespace-nowrap cursor-pointer transition-colors"
              >
                ⚡ Rush Prep
              </button>
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-zinc-900/40 flex gap-2">
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Ask AI about cocktail demand, inventory, or recipes..."
                className="flex-1 px-3.5 py-2 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-md shadow-amber-400/20"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
