'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight } from 'lucide-react';

interface AskAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actions?: string[];
}

export const AskAIModal: React.FC<AskAIModalProps> = ({
  isOpen,
  onClose,
  initialPrompt = '',
}) => {
  const [input, setInput] = useState(initialPrompt);
  const msgCounterRef = useRef(10);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hello Sarah! I'm Tavonza AI, your operations assistant. Downtown Branch is running at 94% efficiency. What would you like to analyze or optimize right now?",
      timestamp: 'Just now',
      actions: [
        'Analyze lunch rush bottleneck',
        'Floor 2 waiter assignment proposal',
        'Mozzarella reorder forecast',
        'Review delayed orders impact',
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    msgCounterRef.current += 1;
    const userMsgId = `u-${msgCounterRef.current}`;
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let replyText =
        'Based on current table occupancy (75%) and kitchen prep velocity (13m avg), assigning 1 additional runner to Floor 2 will reduce average wait time by 4.2 minutes and eliminate table 12 delays.';
      if (query.toLowerCase().includes('mozzarella') || query.toLowerCase().includes('inventory')) {
        replyText =
          'Mozzarella stock is at 3.2kg. With tonight’s dinner bookings projecting 48 pizza and pasta covers, stock will be depleted by 8:15 PM. Recommended: trigger express supplier PO for 10kg from Central Dairy.';
      } else if (query.toLowerCase().includes('delayed') || query.toLowerCase().includes('order')) {
        replyText =
          'Orders #10484, #10485, and #10486 are waiting on Grill Station item #3. Reassigning Order #10484 side items to Fry Station will balance the ticket load.';
      }

      msgCounterRef.current += 1;
      const aiMsgId = `ai-${msgCounterRef.current}`;
      const aiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        text: replyText,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 lg:left-72 top-20 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-black border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-semibold font-['Inter'] text-lg flex items-center gap-2">
                Tavonza AI Assistant
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500 text-white">
                  LIVE OPS
                </span>
              </h3>
              <p className="text-neutral-400 text-sm">
                Real-time decision intelligence · Downtown Branch
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-white'
                    : 'bg-neutral-800 border border-white/10 text-amber-400'
                }`}
              >
                {m.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-xl p-4 text-base ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-white font-medium'
                    : 'bg-white/[0.06] border border-white/10 text-neutral-200 leading-relaxed'
                }`}
              >
                <p>{m.text}</p>
                {m.actions && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                    {m.actions.map((act) => (
                      <button
                        key={act}
                        type="button"
                        onClick={() => handleSend(act)}
                        className="text-sm px-2.5 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 border border-amber-500/20 text-amber-300 transition-colors flex items-center gap-1.5"
                      >
                        {act}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-neutral-400 text-sm font-mono">
              <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 text-amber-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <span className="animate-pulse">Tavonza AI is computing live telemetry...</span>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-white/10 bg-black">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about inventory, floor staff, kitchen delays, or revenue..."
              className="flex-1 bg-zinc-950 border border-white/15 rounded-xl px-4 py-2.5 text-base text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl text-base transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
