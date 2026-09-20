'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  LayoutDashboard,
  Smartphone,
  ChefHat,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  UtensilsCrossed,
  Layers,
  Bot,
  BarChart3,
  CreditCard,
  Receipt,
  Wine,
  QrCode,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Star,
  DollarSign,
  Activity,
  Award,
  Lock,
  ArrowUpRight,
  Calculator,
  Compass,
  FileCheck,
  RefreshCw,
  BellRing,
  Flame,
  CookingPot,
  Store,
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'owner' | 'kitchen' | 'waiter' | 'customer'>('owner');
  const [monthlyRevenue, setMonthlyRevenue] = useState(85000);
  const [tableCount, setTableCount] = useState(24);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // ROI calculations
  const estimatedRevenueGain = Math.round(monthlyRevenue * 0.182);
  const savedStaffHoursPerWeek = Math.round(tableCount * 0.65);
  const foodWasteSavedMonthly = Math.round(monthlyRevenue * 0.045);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden font-sans">
      {/* Ambient background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[700px] h-[700px] bg-indigo-500/10 rounded-full blur-[180px]" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1px] shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center p-2">
                <img
                  src="/assets/costomerpages/customer-page-icon.svg"
                  alt="Tavonza AI"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Tavonza
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  v3.0 AI
                </span>
              </div>
              <div className="text-[10px] font-medium text-zinc-400 tracking-wider uppercase">
                Hospitality Operating System
              </div>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden xl:flex items-center gap-7 text-sm font-medium text-zinc-300">
            <a href="#features" className="hover:text-amber-400 transition-colors">Features</a>
            <a href="#ecosystem" className="hover:text-amber-400 transition-colors">Live Ecosystem</a>
            <a href="#architecture" className="hover:text-amber-400 transition-colors">How It Works</a>
            <a href="#roi-calculator" className="hover:text-amber-400 transition-colors">ROI Calculator</a>
            <a href="#testimonials" className="hover:text-amber-400 transition-colors">Testimonials</a>
          </nav>

          {/* Right Direct Portal Launch Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/kitchen-dashboard"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-all hover:border-orange-500/40"
            >
              <ChefHat className="w-3.5 h-3.5 text-orange-400" />
              <span>Kitchen KDS</span>
            </Link>

            <Link
              href="/waiter-dashboard"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-all hover:border-emerald-500/40"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Waiter App</span>
            </Link>

            <Link
              href="/customer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-all hover:border-indigo-500/40"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>Customer QR</span>
            </Link>

            <Link
              href="/new-dashbord/owner/restaurants"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-amber-500/10 text-amber-300 hover:text-white hover:bg-amber-500/20 border border-amber-500/30 transition-all"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Restaurants (New)</span>
            </Link>

            <Link
              href="/owner-dashboard"
              className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Enter Owner OS</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-16 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Glowing Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/30 text-xs font-medium text-amber-300 mb-8 shadow-inner shadow-amber-500/10 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>Next-Generation Autonomous Hospitality AI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-zinc-400 font-normal">Milky Amsterdam Suite</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
          The Intelligent Operating System for <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400 bg-clip-text text-transparent">Modern Restaurants</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto font-normal leading-relaxed">
          Unify your Executive Suite, Kitchen Display Systems, Floor Waiters, and Diners with real-time AI agents, predictive demand forecasting, and touchless smart table dining.
        </p>

        {/* Direct Access 4-Portal Interactive Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left">
          {/* Card 1: Owner Dashboard */}
          <Link
            href="/owner-dashboard"
            className="group relative p-5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1">Executive Suite</div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">Owner Dashboard</h3>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                25+ operational modules: AI Briefings, POS, Recipe Costing, Cashflow & BI Analytics.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Open Owner OS</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          {/* Card 2: Kitchen Dashboard (KDS) */}
          <Link
            href="/kitchen-dashboard"
            className="group relative p-5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col justify-between"
          >
            <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-3">
                <ChefHat className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider mb-1">Back of House</div>
              <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">Kitchen Dashboard</h3>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                Chef Michael station: live order queue, station capacity gauge, inventory alerts & AI co-pilot.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-orange-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Kitchen KDS</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          {/* Card 3: Waiter Dashboard */}
          <Link
            href="/waiter-dashboard"
            className="group relative p-5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">Floor Operations</div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">Waiter Station</h3>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                Live assigned table floorplan, priority guest call alerts, live kitchen status & AI floor co-pilot.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Waiter Station</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          {/* Card 3B: New Waiter Dashboard (v2) */}
          <Link
            href="/new-dashbord/waiter"
            className="group relative p-5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-900 border border-amber-500/30 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 flex flex-col justify-between ring-1 ring-amber-500/20"
          >
            <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">New Design System</div>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-black">NEW</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">New Waiter Station</h3>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                All Figma layouts: Taking Orders, KDS Monitoring, Live Floor Alerts, and Bill Checkout.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Launch New Waiter UI</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          {/* Card 3C: New Cashier Station (v2) */}
          <Link
            href="/new-dashbord/cashier"
            className="group relative p-5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-900 border border-yellow-400/30 hover:border-yellow-400 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/20 flex flex-col justify-between ring-1 ring-yellow-400/20"
          >
            <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400 mb-3">
                <Receipt className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-[10px] font-semibold text-yellow-400 uppercase tracking-wider">POS &amp; Register</div>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-black">NEW</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-yellow-300 transition-colors">New Cashier Station</h3>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                Bill Queue, Walk-In Order Register, Shift History chits, and Live Notifications.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-yellow-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Cashier POS</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          {/* Card 3D: New Owner & Restaurants (Figma) */}
          <Link
            href="/new-dashbord/owner/restaurants"
            className="group relative p-5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-900 border border-amber-500/30 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 flex flex-col justify-between ring-1 ring-amber-500/20"
          >
            <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                <Store className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Multi-Outlet Hub</div>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-black">FIGMA</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">New Owner & Restaurants</h3>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                Complete multi-restaurant portfolio: Tavonza Downtown, Café Bistro, The Barrel Bar, branch management & modal workflows.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Owner & Restaurants</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          {/* Card 4: Customer QR Ordering */}
          <Link
            href="/customer"
            className="group relative p-5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between"
          >
            <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">Diner Experience</div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">Customer QR Menu</h3>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                12-step touchless dining: QR scan, Sofia AI sommelier chat, item customization & split bill pay.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Experience Guest Flow</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="mt-14 pt-10 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">99.98%</div>
            <div className="text-xs text-zinc-400 mt-1 font-medium">Cloud Uptime SLA</div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">+28.4%</div>
            <div className="text-xs text-zinc-400 mt-1 font-medium">Table Turn Velocity</div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">&lt; 1.2 min</div>
            <div className="text-xs text-zinc-400 mt-1 font-medium">Ticket Dispatch Speed</div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">+18.2%</div>
            <div className="text-xs text-zinc-400 mt-1 font-medium">Average Check Uplift</div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 col-span-2 sm:col-span-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 flex items-center justify-center gap-1">
              4.95 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div className="text-xs text-zinc-400 mt-1 font-medium">Guest Rating Average</div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE 4-IN-1 ECOSYSTEM SIMULATOR */}
      {/* ========================================================================= */}
      <section id="ecosystem" className="py-20 bg-zinc-950/60 border-y border-zinc-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Interactive Sandbox</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Four Unified Interfaces. One Seamless Brain.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400">
              Switch between perspectives to see how Tavonza coordinates owners, kitchen chefs, waitstaff, and guests in real time.
            </p>
          </div>

          {/* Tab Selector Buttons */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setActiveTab('owner')}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'owner'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Owner OS</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('kitchen')}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'kitchen'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                <span>Kitchen KDS</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('waiter')}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'waiter'
                    ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Waiter Station</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('customer')}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'customer'
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Guest QR Flow</span>
              </button>
            </div>
          </div>

          {/* Interactive Screen Display */}
          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            {activeTab === 'owner' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>EXECUTIVE DASHBOARD PREVIEW</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mt-1">Autonomous Operations & AI Intelligence</h4>
                  </div>
                  <Link
                    href="/owner-dashboard"
                    className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white transition-colors shadow-md"
                  >
                    <span>Launch Full Owner OS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
                    <div className="text-xs text-zinc-400 font-medium">Today's Revenue</div>
                    <div className="text-2xl font-bold text-white mt-1">$4,850.00</div>
                    <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs yesterday
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
                    <div className="text-xs text-zinc-400 font-medium">Table Occupancy</div>
                    <div className="text-2xl font-bold text-white mt-1">88%</div>
                    <div className="text-xs text-amber-400 mt-1 flex items-center gap-1 font-semibold">
                      <Layers className="w-3.5 h-3.5" /> 21 of 24 tables seated
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
                    <div className="text-xs text-zinc-400 font-medium">AI Daily Briefing</div>
                    <div className="text-xs text-zinc-300 mt-1 leading-relaxed">
                      "T-Bone Ribeye trending high. Restock dry-aged beef before 7:00 PM rush."
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-1.5 font-semibold">● 3 Actions Automated</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'kitchen' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-orange-400">
                      <ChefHat className="w-3.5 h-3.5" />
                      <span>KITCHEN & KDS DISPLAY PREVIEW</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mt-1">Chef Michael KDS Station & Real-Time Prep Queues</h4>
                  </div>
                  <Link
                    href="/kitchen-dashboard"
                    className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white transition-colors shadow-md"
                  >
                    <span>Launch Kitchen KDS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">Kitchen Load</span>
                      <span className="text-xs font-bold text-orange-400 font-mono">82%</span>
                    </div>
                    <div className="text-xl font-bold text-white mt-1">24 Active Tickets</div>
                    <div className="text-xs text-emerald-400 mt-1 font-mono">Avg Wait: 13 min</div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">Station Balance</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">4 Online</span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-1">Grill 8 • Fry 4 • Pizza 3</div>
                    <div className="text-xs text-yellow-400 mt-1">Grill peak balancing active</div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">Stock Alerts</span>
                      <span className="text-xs font-bold text-red-400 font-mono">1 Low</span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-1">Mozzarella Cheese (2.4kg)</div>
                    <div className="text-xs text-zinc-400 mt-1">Auto runner alert sent</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'waiter' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                      <Users className="w-3.5 h-3.5" />
                      <span>WAITER & FLOOR CO-PILOT PREVIEW</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mt-1">Live Table Grid, Urgency Alerts & AI Floor Copilot</h4>
                  </div>
                  <Link
                    href="/waiter-dashboard"
                    className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors shadow-md"
                  >
                    <span>Launch Waiter Station</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { table: 'Table 01', status: 'Seated', guests: '4 Guests', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' },
                    { table: 'Table 02', status: 'Kitchen Ready', guests: '2 Guests', color: 'border-amber-500/50 bg-amber-500/10 text-amber-400' },
                    { table: 'Table 03', status: 'Bill Requested', guests: '6 Guests', color: 'border-rose-500/50 bg-rose-500/10 text-rose-400' },
                    { table: 'Table 04', status: 'Available', guests: 'Ready for Seating', color: 'border-zinc-700 bg-zinc-950 text-zinc-400' },
                  ].map((t) => (
                    <div key={t.table} className={`p-3.5 rounded-xl border ${t.color} flex flex-col justify-between`}>
                      <div>
                        <div className="text-xs font-bold text-white">{t.table}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">{t.guests}</div>
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider mt-2.5">{t.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'customer' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>CUSTOMER QR DINING PREVIEW</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mt-1">12-Step Touchless Dining Journey & Sofia AI</h4>
                  </div>
                  <Link
                    href="/customer"
                    className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white transition-colors shadow-md"
                  >
                    <span>Launch Customer App</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs mb-2">
                      01
                    </div>
                    <div className="text-xs font-bold text-white">Instant Table Scan</div>
                    <div className="text-xs text-zinc-400 mt-1">Zero app download required. Instant high-res photo menu with allergen tags.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs mb-2">
                      02
                    </div>
                    <div className="text-xs font-bold text-white">Sofia AI Sommelier</div>
                    <div className="text-xs text-zinc-400 mt-1">Live AI concierge to recommend dishes, describe flavour profiles, and pair wines.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs mb-2">
                      03
                    </div>
                    <div className="text-xs font-bold text-white">Split Bill & Instant Pay</div>
                    <div className="text-xs text-zinc-400 mt-1">Diners split the check effortlessly, add custom tips, and leave reviews in 5 seconds.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. KEY CAPABILITIES & FEATURE MATRIX */}
      {/* ========================================================================= */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Enterprise Hospitality Suite</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
            Engineered for High-Volume Excellence
          </h2>
          <p className="mt-4 text-base text-zinc-400">
            From single boutique restaurants to nationwide multi-location hospitality groups, Tavonza eliminates operational friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/40 transition-all hover:shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Autonomous AI Agents</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Meet Sofia and the Tavonza agent fleet. From predicting raw ingredient spoilage to drafting responses to Google reviews and optimizing happy hour prices.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-emerald-500/40 transition-all hover:shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Smart KDS & Kitchen Routing</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Eliminate paper tickets. Color-coded countdown timers, auto-batched steak temperatures, and dedicated Bar Display Systems for mixologists.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-indigo-500/40 transition-all hover:shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Predictive Demand Modeling</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Tavonza factors local weather, day-of-week trends, and reservation volume to give chefs exact prep quantities and staffing recommendations.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-rose-500/40 transition-all hover:shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Tavonza Card & Payouts</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Integrated business spending card. Pay suppliers directly, automate receipt capturing, and access instant daily revenue payouts without standard delays.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-sky-500/40 transition-all hover:shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Recipe Costing & Inventory</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Track plate cost to the penny. Live ingredient depletions triggered as orders are punched, with automated purchase order generation for suppliers.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-purple-500/40 transition-all hover:shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Branch Architecture</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Seamlessly switch between downtown branches, franchise locations, or rooftop bars with role-based permissions and aggregated financial reports.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS / OPERATIONAL LIFECYCLE */}
      {/* ========================================================================= */}
      <section id="architecture" className="py-20 bg-zinc-950/80 border-t border-zinc-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">End-to-End Orchestration</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              How Tavonza Powers a Single Dinner Service
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400">
              Watch how an order flows seamlessly across all four dashboards from seating to checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: '01',
                title: 'Table Seating',
                desc: 'Guests scan the table QR code or are greeted by the server equipped with the Waiter Station tablet.',
                icon: QrCode,
                color: 'text-amber-400 bg-amber-500/10'
              },
              {
                step: '02',
                title: 'AI Recommendation',
                desc: 'Sofia AI suggests complementary wines and sides, driving an average +18.2% boost in check sizes.',
                icon: Bot,
                color: 'text-indigo-400 bg-indigo-500/10'
              },
              {
                step: '03',
                title: 'Instant KDS Fire',
                desc: 'Orders split automatically: appetizers to sauté, steaks to grill, cocktails to the bar display monitor.',
                icon: ChefHat,
                color: 'text-emerald-400 bg-emerald-500/10'
              },
              {
                step: '04',
                title: 'Floor Staff Alert',
                desc: 'Waiters receive a vibration alert the instant the food is plated with table number and guest notes.',
                icon: BellRing,
                color: 'text-sky-400 bg-sky-500/10'
              },
              {
                step: '05',
                title: 'Touchless Pay & BI',
                desc: 'Guests tap to pay with split check options. Revenue and inventory deplete into Owner BI in real time.',
                icon: BarChart3,
                color: 'text-purple-400 bg-purple-500/10'
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center font-bold text-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-500">{item.step}</span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. INTERACTIVE ROI CALCULATOR */}
      {/* ========================================================================= */}
      <section id="roi-calculator" className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-amber-500/30 shadow-2xl shadow-amber-500/5">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
            <Calculator className="w-4 h-4" />
            <span>ANNUAL ROI ESTIMATOR</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Calculate Your Venue's Projected Efficiency Gains
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            See the tangible revenue increase and labor hours saved with Tavonza AI hospitality automation.
          </p>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-2">
                  <span>Current Monthly Revenue</span>
                  <span className="text-amber-400 font-bold">${monthlyRevenue.toLocaleString()} / mo</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="350000"
                  step="5000"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
                  <span>$20K</span>
                  <span>$150K</span>
                  <span>$350K+</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-2">
                  <span>Number of Dining Tables</span>
                  <span className="text-emerald-400 font-bold">{tableCount} Tables</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="100"
                  step="2"
                  value={tableCount}
                  onChange={(e) => setTableCount(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
                  <span>6 Tables</span>
                  <span>50 Tables</span>
                  <span>100+ Tables</span>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs text-zinc-400">Monthly Revenue Growth</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">
                  +${estimatedRevenueGain.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">+18.2% via AI pairings</div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs text-zinc-400">Staff Hours Reclaimed</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  {savedStaffHoursPerWeek} hrs <span className="text-xs font-normal text-zinc-400">/ wk</span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Faster table turns</div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs text-zinc-400">Food Waste Cost Saved</div>
                <div className="text-2xl font-bold text-indigo-400 mt-1">
                  ${foodWasteSavedMonthly.toLocaleString()} <span className="text-xs font-normal text-zinc-400">/ mo</span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Predictive ingredient prep</div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs text-zinc-400">Projected Annual ROI</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  +${((estimatedRevenueGain + foodWasteSavedMonthly) * 12).toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">Net value unlocked</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. TESTIMONIALS & TRUSTED PARTNERS */}
      {/* ========================================================================= */}
      <section id="testimonials" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-800">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Client Testimonials</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Trusted by World-Class Hospitality Teams
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                "Tavonza transformed our dinner rush. Sofia AI recommends reserve wine pairings that our servers didn't even think of, driving our highest average check in 8 years."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                MA
              </div>
              <div>
                <div className="text-xs font-bold text-white">Chef Laurent Van Dijk</div>
                <div className="text-[10px] text-zinc-400">Executive Chef • Milky Amsterdam</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                "The Kitchen Display System and automated inventory depletion save us over 15 hours of manual stocktaking every single week. Food cost variance dropped to under 1.2%."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                GB
              </div>
              <div>
                <div className="text-xs font-bold text-white">Elena Rostova</div>
                <div className="text-[10px] text-zinc-400">General Manager • The Grand Bistro</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                "Having the Waiter Station on iPads synchronized with QR orders on tables gives our floor staff superpowers. Turnaround times plummeted, and reviews have never been higher."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                LL
              </div>
              <div>
                <div className="text-xs font-bold text-white">Marcus Thorne</div>
                <div className="text-[10px] text-zinc-400">Managing Director • Lumina Rooftop Lounge</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FAQ SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-800">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Frequently Asked Questions</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does Tavonza synchronize the Owner, Kitchen, Waiter, and Customer experiences?',
              a: 'Tavonza operates on a unified event-driven backend. When a customer orders via table QR or a server fires a ticket on the tablet, it instantly broadcasts to the Kitchen Display System (KDS), notifies the assigned waiter, and updates the Owner financial ledger and inventory levels.'
            },
            {
              q: 'Can Tavonza integrate with my existing POS or hardware?',
              a: 'Yes. Tavonza is built to work either as a standalone full-stack operating system with our built-in POS terminal or alongside existing POS printers, kitchen hardware, and payment terminals.'
            },
            {
              q: 'How does the Sofia AI Sommelier work?',
              a: 'Sofia is trained on your exact menu, ingredients, wine inventory, and pairing principles. Diners can ask questions in natural language like "What goes best with the dry-aged ribeye?" or "I have a peanut allergy, what can I eat?" and receive instant, tailored suggestions.'
            },
            {
              q: 'What is the Tavonza Card?',
              a: 'The Tavonza Card is an integrated business card linked to your daily payouts. You can set employee spend limits, auto-pay trusted suppliers, and automate receipt categorization directly within the Owner Dashboard.'
            }
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-amber-400 transition-colors cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${faqOpen === idx ? 'rotate-180 text-amber-400' : ''}`} />
              </button>
              {faqOpen === idx && (
                <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FINAL CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="py-20 relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-emerald-500/20 border border-amber-500/40 p-8 sm:p-16 text-center backdrop-blur-2xl relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Supercharge Your Restaurant Operations?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto">
            Experience the all-in-one AI operating system. Choose your portal below to explore live.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/owner-dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm shadow-xl shadow-amber-500/20 transition-transform transform hover:-translate-y-0.5 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Launch Owner OS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/kitchen-dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-white font-bold text-sm border border-zinc-700 transition-transform transform hover:-translate-y-0.5 cursor-pointer"
            >
              <ChefHat className="w-4 h-4 text-orange-400" />
              <span>Kitchen KDS</span>
            </Link>

            <Link
              href="/waiter-dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-white font-bold text-sm border border-zinc-700 transition-transform transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Waiter Station</span>
            </Link>

            <Link
              href="/customer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-white font-bold text-sm border border-zinc-700 transition-transform transform hover:-translate-y-0.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-indigo-400" />
              <span>Customer QR</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-zinc-950 border-t border-zinc-800/80 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black border border-zinc-800 p-1.5 flex items-center justify-center">
              <img
                src="/assets/costomerpages/customer-page-icon.svg"
                alt="Tavonza Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Tavonza AI Hospitality
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="text-[10px] text-zinc-500">© 2026 Milky Amsterdam. All rights reserved.</div>
            </div>
          </div>

          {/* Quick Route Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-medium">
            <Link href="/owner-dashboard" className="hover:text-amber-400 transition-colors">Owner OS</Link>
            <Link href="/kitchen-dashboard" className="hover:text-orange-400 transition-colors">Kitchen KDS</Link>
            <Link href="/waiter-dashboard" className="hover:text-emerald-400 transition-colors">Waiter Station</Link>
            <Link href="/customer" className="hover:text-indigo-400 transition-colors">Customer QR</Link>
            <Link href="/owner-dashboard/orders" className="hover:text-white transition-colors">Orders</Link>
            <Link href="/owner-dashboard/pos" className="hover:text-white transition-colors">POS</Link>
            <Link href="/owner-dashboard/kitchen-display" className="hover:text-white transition-colors">KDS</Link>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <Activity className="w-3.5 h-3.5" />
            <span>All Systems Operational (99.98%)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
