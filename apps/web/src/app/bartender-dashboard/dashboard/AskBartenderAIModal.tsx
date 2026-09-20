'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Wine,
  GlassWater,
  Flame,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';

interface AskBartenderAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AskBartenderAIModal({ isOpen, onClose }: AskBartenderAIModalProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content:
        "Hello James! I'm your Tavonza Bar AI Copilot. I can pull up cocktail recipes, calculate batch syrup ratios, predict upcoming drink orders, or balance your cocktail station workload. How can I assist?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let reply = "I've checked the bar queue. Cocktail demand is rising at Table 08 and Bar Counter. Restocking 1 bottle of mint syrup is recommended.";
      const lower = userText.toLowerCase();
      if (lower.includes('mojito') || lower.includes('recipe')) {
        reply = "Signature Mojito Recipe:\n• 60ml White Rum\n• 30ml Fresh Lime Juice\n• 20ml Simple Syrup\n• 6-8 Fresh Mint Leaves\n• Top with Soda Water & Crushed Ice\nPrep time target: 2 min.";
      } else if (lower.includes('rush') || lower.includes('forecast')) {
        reply = 'Expect a 25% surge in cold beverages between 6:00 PM and 9:00 PM. Station 1 (Cocktail) will require 1 backup mixologist.';
      } else if (lower.includes('mint') || lower.includes('stock')) {
        reply = 'Fresh mint is currently at 12% par. A refill purchase request has been drafted to Downtown produce supplier.';
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      setLoading(false);
    }, 600);
  };

  const quickPrompts = [
    'Signature Mojito Recipe',
    'Evening Rush Forecast',
    'Mint Stock Status',
    'Cocktail Station Load',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col h-[520px] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-yellow-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Inter']">
                Tavonza Bar AI Copilot
              </h3>
              <p className="text-sm text-zinc-400 font-mono">Mixology Intelligence v2.1</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 custom-scrollbar">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-3 text-sm sm:text-base font-['Inter'] leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-amber-500 text-white font-medium'
                    : 'bg-white/5 border border-white/10 text-gray-200'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="p-3 bg-white/5 rounded-xl text-sm text-amber-400 flex items-center gap-2">
                <span className="size-2 bg-amber-400 rounded-full animate-ping" />
                Analyzing bar telemetry...
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompt Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 custom-scrollbar flex-shrink-0">
          {quickPrompts.map((prompt, pIdx) => (
            <button
              key={pIdx}
              type="button"
              onClick={() => {
                setInput(prompt);
              }}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-xs text-zinc-300 font-medium whitespace-nowrap cursor-pointer transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-white/10 flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask recipe, ingredient ratio, or queue check..."
            className="flex-1 h-10 px-3 bg-neutral-800 rounded-xl border border-white/10 text-sm text-white placeholder:text-gray-500 outline-none focus:border-amber-500/50"
          />
          <button
            type="submit"
            className="h-10 px-4 bg-yellow-500 hover:bg-yellow-400 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
