"use client";

import React, { useState } from "react";
import { Sparkles, X, Send, Bot } from "lucide-react";

interface AskAiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AskAiModal({ isOpen, onClose }: AskAiModalProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<
    { sender: "ai" | "user"; text: string }[]
  >([
    {
      sender: "ai",
      text: "Hello! I'm your AI Sommelier & Menu Assistant at Tavonza. What flavors or wine pairings are you craving today?"
    }
  ]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!query.trim()) return;
    const userText = query;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setQuery("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `For ${userText}, I highly recommend our Dry-Aged Tomahawk Ribeye paired with an oaked Cabernet Sauvignon or our Arancini al Tartufo with Chardonnay!`
        }
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-sm overflow-hidden flex flex-col h-[480px] shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 to-amber-950/40 p-4 border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E5A853] text-white flex items-center justify-center font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1">
                AI Culinary Assistant
                <Sparkles className="w-3.5 h-3.5 text-[#E5A853] fill-current" />
              </h3>
              <span className="text-[10px] text-stone-400">
                Sommelier & Menu Guide
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-full bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-[#E5A853] text-white font-semibold rounded-br-none"
                    : "bg-zinc-800 text-stone-200 border border-zinc-700/60 rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about wine pairing, tender cuts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#E5A853]"
          />
          <button
            onClick={handleSend}
            className="p-2 rounded-xl bg-[#E5A853] text-white hover:bg-amber-400 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
