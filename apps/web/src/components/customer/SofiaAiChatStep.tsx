"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, Bot, Mic, Send, Sparkles } from "lucide-react";
import { ChatMessage } from "@/src/types/customer";

interface SofiaAiChatStepProps {
  onBack: () => void;
}

export default function SofiaAiChatStep({ onBack }: SofiaAiChatStepProps) {
  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "sofia",
      text: "Buona sera! I'm Sofia, your AI dining assistant at La Tavola. I can help you find dishes that match your diet, suggest wine pairings, check allergens, and give personal recommendations. How can I help you tonight?"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "What's your best-selling dish?",
    "Show food list & prices",
    "Show vegetarian options.",
    "I have a nut allergy.",
    "Help me choose a wine."
  ];

  const getSofiaReply = (rawInput: string): string => {
    const input = rawInput.toLowerCase();

    // 1. Food List / Menu Items Query
    if (
      input.includes("food list") ||
      input.includes("menu list") ||
      input.includes("show food") ||
      input.includes("dishes") ||
      input.includes("what do you have") ||
      input.includes("what foods") ||
      input.includes("show menu")
    ) {
      return "Here is our featured food list available tonight:\n\n• Arancini al Tartufo — $30.50 (Starter / Chef's Pick)\n• Truffle Margherita — $30.50 (Starter / Best Seller)\n• Prime Ribeye with Herb Butter — $42.00 (Steak)\n• Dry-Aged Tomahawk Ribeye (800g) — $85.00 (Steak)\n• Sliced Flank Steak & Chimichurri — $34.00 (Steak)\n• Filet Mignon Center-Cut — $46.00 (Steak)\n• Grand Table Feast (Serves 4) — $120.00";
    }

    // 2. Prices / Cost Query
    if (
      input.includes("price") ||
      input.includes("prices") ||
      input.includes("cost") ||
      input.includes("how much") ||
      input.includes("rate") ||
      input.includes("cheap") ||
      input.includes("expensive")
    ) {
      return "Here is the price breakdown for our popular menu items:\n\n• Sliced Flank Steak: $20.50 – $34.00\n• Prime Ribeye Steak: $25.50 – $42.00\n• Arancini al Tartufo: $30.50\n• Truffle Margherita: $30.50\n• Filet Mignon Center-Cut: $45.50\n• Sommelier Wine Pairing: $55.00\n• Dry-Aged Tomahawk Steak: $85.00\n• Grand Table Feast (4 Pax): $120.00";
    }

    // 3. Best Sellers / Popular Query
    if (
      input.includes("best-selling") ||
      input.includes("bestseller") ||
      input.includes("popular") ||
      input.includes("top dish") ||
      input.includes("favorite")
    ) {
      return "Our top best-selling dishes tonight are the Truffle Margherita (★ 4.9), the 28-day Dry-Aged Tomahawk Ribeye (★ 4.9), and our Arancini al Tartufo (★ 4.5)!";
    }

    // 4. Steaks & Meats Query
    if (
      input.includes("steak") ||
      input.includes("meat") ||
      input.includes("beef") ||
      input.includes("ribeye") ||
      input.includes("tomahawk") ||
      input.includes("filet")
    ) {
      return "We specialize in premium woodfire grilled steaks:\n• Prime Ribeye with Herb Butter ($42.00)\n• Dry-Aged Tomahawk 800g ($85.00)\n• Sliced Flank Steak & Chimichurri ($34.00)\n• Filet Mignon Center-Cut ($46.00)\n\nAll steaks can be cooked rare, medium-rare, medium, or well-done!";
    }

    // 5. Wine & Drinks Query
    if (
      input.includes("wine") ||
      input.includes("drink") ||
      input.includes("beer") ||
      input.includes("pairing") ||
      input.includes("cocktail") ||
      input.includes("chardonnay")
    ) {
      return "Our Sommelier drink recommendations:\n• Chilled Oaked Chardonnay ($55.00) — pairs beautifully with Truffle Arancini & Salads\n• Cabernet Sauvignon / Malbec — perfect match for Ribeye & Flank Steaks\n• Craft Draft Beers & Signature Cocktails — included with our Table Feast!";
    }

    // 6. Vegetarian Query
    if (
      input.includes("vegetarian") ||
      input.includes("vegan") ||
      input.includes("veggie") ||
      input.includes("plant")
    ) {
      return "We offer delicious vegetarian options:\n• Arancini al Tartufo ($30.50) — Crispy truffle risotto spheres with smoked mozzarella\n• Truffle Margherita ($30.50) — Artisan sourdough pizza with buffalo mozzarella & fresh truffles";
    }

    // 7. Allergy Query
    if (
      input.includes("allergy") ||
      input.includes("allergen") ||
      input.includes("nut") ||
      input.includes("gluten") ||
      input.includes("dairy")
    ) {
      return "Allergen Transparency:\n• All our steaks are 100% nut-free and gluten-free.\n• Arancini & Truffle Margherita contain Gluten and Dairy.\n• Please inform your server if you have severe dietary allergies so our kitchen takes extra care!";
    }

    // 8. Spicy Recommendation
    if (input.includes("spicy") || input.includes("chili") || input.includes("hot")) {
      return "For a spicy kick, we recommend our Sliced Flank Steak served with hot chili-infused house green chimichurri!";
    }

    // 9. Table Info
    if (input.includes("table") || input.includes("where am i") || input.includes("dine-in")) {
      return "You are currently seated at Table 08 (Dine-In). Orders placed will be sent directly to your table!";
    }

    // Fallback response with helpful triggers
    return "I can help you explore our menu! Try asking me:\n• 'Show food list'\n• 'Show food prices'\n• 'Recommend a steak'\n• 'Help me choose a wine'\n• 'Show vegetarian options'";
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");

    setTimeout(() => {
      const sofiaReply = getSofiaReply(text);
      const sofiaMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "sofia",
        text: sofiaReply
      };

      setMessages((prev) => [...prev, sofiaMsg]);
    }, 500);
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-neutral-900 text-white overflow-hidden animate-in fade-in duration-300 font-sans z-20">
      {/* Top Header (Fixed Top) */}
      <div className="shrink-0 z-10 px-6 py-3 border-b border-stone-900 bg-neutral-900 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-[20px] bg-neutral-700/40 text-white flex items-center justify-center hover:bg-neutral-700/60 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Sofia Avatar */}
          <div className="w-9 h-9 rounded-full bg-orange-700 flex items-center justify-center text-stone-50 shadow">
            <Bot className="w-5 h-5" />
          </div>

          {/* Name & Online Status */}
          <div>
            <h1 className="text-base font-semibold font-['Poppins'] leading-5 tracking-wide text-white">
              Sofia
            </h1>
            <span className="text-xs font-medium font-['DM_Sans'] leading-4 text-green-500 block">
              ● Online · AI Dining Assistant
            </span>
          </div>
        </div>

        {/* AI Badge */}
        <div className="px-3 py-1.5 bg-zinc-900 rounded-[10px] border border-zinc-800 flex items-center gap-1 text-amber-500 text-xs font-medium font-['DM_Sans']">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>AI</span>
        </div>
      </div>

      {/* Main Messages & Suggestions Container (Only this section scrolls!) */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* Messages List */}
        {messages.map((m) => (
          <div key={m.id} className="flex gap-2.5 items-start">
            {m.sender === "sofia" && (
              <div className="w-7 h-7 rounded-full bg-orange-700 flex items-center justify-center text-stone-50 shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] p-3.5 text-xs font-normal font-['DM_Sans'] leading-relaxed whitespace-pre-line shadow ${
                m.sender === "sofia"
                  ? "bg-white/10 rounded-tl-xl rounded-tr-2xl rounded-bl-2xl rounded-br-2xl border border-white/10 text-white"
                  : "ml-auto bg-amber-500 text-white font-semibold rounded-2xl rounded-br-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {/* Quick Suggestion Pills */}
        <div className="pl-9 pt-2 flex flex-wrap gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-xs text-white text-xs font-medium font-['DM_Sans'] hover:bg-amber-500 hover:text-white transition active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area (Always 100% Fixed at Bottom above keyboard) */}
      <div className="shrink-0 p-4 bg-neutral-900 border-t border-stone-900 shadow-2xl z-30">
        <div className="w-full px-4 py-2.5 bg-white/10 rounded-[10px] border border-white/10 backdrop-blur-xs flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask Sofia anything (e.g. food list, prices, wine)..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onFocus={() => setTimeout(scrollToBottom, 300)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-transparent text-neutral-50 text-xs font-normal font-['DM_Sans'] placeholder-stone-400 focus:outline-none"
          />

          {/* Mic Button */}
          <button
            onClick={() => handleSendMessage("Show food list & prices")}
            title="Voice Input Simulation"
            className="w-8 h-8 rounded-[20px] bg-white/10 border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Send Arrow Button */}
          <button
            onClick={() => handleSendMessage()}
            className="w-8 h-8 rounded-[20px] bg-amber-500 text-white flex items-center justify-center hover:bg-amber-400 transition"
          >
            <Send className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
