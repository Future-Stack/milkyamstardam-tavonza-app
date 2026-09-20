'use client';

import React, { useState } from 'react';
import { Sparkles, Bot, Zap, TrendingUp } from 'lucide-react';
import { JarvisInsightCard } from './components/JarvisInsightCard';
import { toast } from 'sonner';

export function JarvisView() {
  const [activePrompt, setActivePrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'jarvis',
      text: 'Good morning Marcus. Current floor occupancy is 67% (16/24 tables). 2 tables in Main Dining have mains delayed over 18m due to the risotto station bottleneck. I recommend temporarily routing upcoming parties of 4 to Patio sections 2 & 3.',
      timestamp: '10:20 AM',
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePrompt.trim()) return;

    const userMsg = {
      sender: 'user',
      text: activePrompt.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setActivePrompt('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'jarvis',
          text: `Analyzing live floor data for "${userMsg.text}"... Server Maya Patel currently carries 4 active tables with an average turn-time of 48m. Reassigning Table- 05 to server Liam Carter will bring ticket wait times down by 14%.`,
          timestamp: 'Just now',
        },
      ]);
    }, 800);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white font-['Inter'] flex items-center gap-2.5">
          <Sparkles className="size-6 text-amber-400" />
          Jarvis AI Floor Copilot
        </h1>
        <p className="text-zinc-400 text-sm font-['Inter'] mt-1">
          Autonomous floor intelligence, turnover prediction, kitchen queue balancing, and proactive guest recovery.
        </p>
      </div>

      {/* AI Operations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <JarvisInsightCard
          title="Main Dining Turn-Around"
          category="Turn-Time Optimization"
          description="Table 02 bussing turnaround is averaging 7 minutes. Suggest flagging Sofia to prioritize sanitize reset for walk-in waiting list (+8)."
          actionText="Dispatch Busser Prompt"
          onAction={() => toast.success('Dispatched reset prompt to Sofia (Busser).')}
          icon={Zap}
          colorClass="border-amber-500/20 text-amber-400"
        />

        <JarvisInsightCard
          title="12:00 PM Lunch Peak"
          category="Rush Hour Anticipation"
          description="Historical models predict a 94% occupancy surge starting at 11:45 AM. Ensure bar station prep is fully stocked with Barolo alternative."
          actionText="Review Bar Prep"
          onAction={() => toast.success('Bar pre-rush checklist sent to Chloe.')}
          icon={TrendingUp}
          colorClass="border-blue-500/20 text-blue-400"
        />

        <JarvisInsightCard
          title="Apex Capital at PR-1"
          category="VIP Guest Intelligence"
          description="VIP profile indicates preference for sparkling mineral water and 12-minute plate intervals. Concierge server Julian has been notified."
          actionText="View VIP Preferences"
          onAction={() => toast.info('VIP profile verified.')}
          icon={Bot}
          colorClass="border-emerald-500/20 text-emerald-400"
        />
      </div>

      {/* Interactive AI Chat */}
      <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
        <div className="text-sm font-semibold text-white flex items-center gap-2">
          <Bot className="size-4 text-amber-400" />
          Ask Jarvis About Floor Operations
        </div>

        <div className="space-y-3 min-h-[160px] max-h-72 overflow-y-auto pr-2 custom-scrollbar">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-white font-medium'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-zinc-800">
          <input
            type="text"
            value={activePrompt}
            onChange={(e) => setActivePrompt(e.target.value)}
            placeholder="Ask e.g. 'How can we reduce kitchen delays on Table 01?'"
            className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm rounded-xl cursor-pointer transition-colors"
          >
            Ask Jarvis
          </button>
        </form>
      </div>
    </div>
  );
}

export default JarvisView;
