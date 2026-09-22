"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ChefHat,
  UtensilsCrossed,
  Receipt,
  Wine,
  Building2,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface RoleOption {
  id: string;
  name: string;
  route: string;
}

const ROLES: RoleOption[] = [
  { id: "owner", name: "Owner / Executive", route: "/owner-dashboard" },
  { id: "manager", name: "General Manager", route: "/manager-dashboard" },
  { id: "kitchen", name: "Kitchen Display (KDS)", route: "/kitchen-dashboard/dashboard" },
  { id: "waiter", name: "Waiter POS & Service", route: "/waiter-dashboard" },
  { id: "cashier", name: "Cashier & Billing", route: "/cashier-dashboard" },
  { id: "bartender", name: "Bartender & Drinks", route: "/bartender-dashboard" },
];

export default function SignIn() {
  const router = useRouter();
  const [roleId, setRoleId] = useState<string>("owner");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    const selected = ROLES.find((r) => r.id === roleId) || ROLES[0];
    setIsLoading(true);
    toast.info(`Authenticating ${selected.name}...`);

    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Access granted! Redirecting to ${selected.name}`);
      router.push(selected.route);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white flex font-sans overflow-hidden">
      {/* ───────────────────────────────────────────────────────────
          LEFT SIDE: Restaurant Showcase Hero (Hidden on Mobile)
      ─────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative flex-col justify-between p-12 overflow-hidden border-r border-neutral-800/80">
        {/* Background Restaurant Image with High-End Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        {/* Multi-layer Dark Gradient for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-transparent to-neutral-950/90" />

        {/* Ambient Warm Golden Glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Top Header / Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-neutral-950 font-bold" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white font-['Inter']">
              TAVONZA AI
            </span>
            <span className="block text-[10px] tracking-widest text-amber-400 font-semibold uppercase">
              Hospitality Intelligence
            </span>
          </div>
        </div>

        {/* Center Content: Restaurant Feature Showcase */}
        <div className="relative z-10 flex flex-col gap-6 max-w-lg my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium w-fit">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Next-Gen Restaurant Cloud Operations</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight font-['Inter']">
            Intelligent Floor Control, KDS Dispatch & Real-Time POS
          </h1>

          <p className="text-sm text-neutral-300 leading-relaxed">
            Synchronize line cooks, service staff, bartenders, and management with real-time AI automation and zero-latency operational pipelines.
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-md">
              <ChefHat className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="text-xs text-neutral-200 font-medium">Live Kitchen Tickets</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-md">
              <UtensilsCrossed className="w-4 h-4 text-yellow-400 shrink-0" />
              <span className="text-xs text-neutral-200 font-medium">Instant Waiter POS</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-md">
              <Receipt className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-neutral-200 font-medium">Cashier Split Billing</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-md">
              <Wine className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-xs text-neutral-200 font-medium">Bar Station Routing</span>
            </div>
          </div>
        </div>

        {/* Bottom Status Footer */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-neutral-800/60 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Multi-Branch Cloud Node Online</span>
          </div>
          <span className="font-mono text-[11px] text-neutral-500">v2.4 — Enterprise</span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          RIGHT SIDE: Sign In Form
      ─────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-14 relative z-10 my-auto">
        <div className="w-full max-w-md flex flex-col gap-7">
          {/* Mobile Header (Shown on Small Screens) */}
          <div className="flex lg:hidden items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-neutral-950 font-bold" />
            </div>
            <div>
              <span className="text-base font-bold text-white">TAVONZA AI</span>
              <span className="block text-[9px] tracking-wider text-amber-400 font-medium uppercase">
                Hospitality Operations
              </span>
            </div>
          </div>

          {/* Form Header */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-white font-['Inter']">
              Staff & Operations Login
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Enter your credentials and select your terminal station to access your shift workspace.
            </p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Operational Station Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-300">Terminal Station / Role</label>
              <div className="relative">
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="w-full h-11 px-3.5 bg-neutral-900 border border-neutral-800 focus:border-amber-400 rounded-xl text-xs text-white focus:outline-none transition cursor-pointer appearance-none"
                >
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id} className="bg-neutral-900 text-white py-1">
                      {r.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-300">Staff Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@restaurant.com"
                  className="w-full h-11 pl-10 pr-3.5 bg-neutral-900 border border-neutral-800 focus:border-amber-400 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-neutral-300">Password / PIN</label>
                <button
                  type="button"
                  onClick={() => toast.info("Please request a password reset from your General Manager.")}
                  className="text-[11px] text-neutral-400 hover:text-amber-400 transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-11 pl-10 pr-10 bg-neutral-900 border border-neutral-800 focus:border-amber-400 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-neutral-500 hover:text-neutral-300 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 py-0.5">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-neutral-900 border-neutral-800 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-xs text-neutral-400 cursor-pointer select-none">
                Remember this terminal device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/10 active:scale-[0.99] mt-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-2 text-center">
            <span className="text-[11px] text-neutral-500">
              Protected by Tavonza Role-Based Access Control (RBAC) & TLS 1.3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
