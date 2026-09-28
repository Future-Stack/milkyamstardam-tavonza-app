"use client";

import React, { useState, useEffect } from "react";
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
  ArrowRight,
  Loader2,
  CheckCircle2,
  KeyRound,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { loginUser } from "@/redux/features/authApi";

// Predefined demo accounts from backend seed
const DEMO_ACCOUNTS = [
  { role: "Admin", email: "owner@tavonza.demo", pass: "Demo1234!", label: "Admin", icon: Building2, color: "text-amber-400 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20" },
  { role: "Branch Mgr", email: "manager@tavonza.demo", pass: "Demo1234!", label: "Manager", icon: Sparkles, color: "text-blue-400 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20" },
  { role: "Waiter", email: "waiter@tavonza.demo", pass: "Demo1234!", label: "Waiter", icon: UtensilsCrossed, color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20" },
  { role: "Kitchen", email: "kitchen@tavonza.demo", pass: "Demo1234!", label: "Kitchen", icon: ChefHat, color: "text-orange-400 border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20" },
  { role: "Bartender", email: "bartender@tavonza.demo", pass: "Demo1234!", label: "Bartender", icon: Wine, color: "text-purple-400 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20" },
  { role: "Cashier", email: "cashier@tavonza.demo", pass: "Demo1234!", label: "Cashier", icon: Receipt, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20" },
];

export function getDestinationRoute(user: any): string {
  if (!user) return "/admin-dashboard";
  const role = user.role;
  if (role === "RESTAURANT_OWNER" || role === "SUPER_ADMIN" || role === "ADMIN") {
    return "/admin-dashboard";
  }
  if (role === "BRANCH_MANAGER") return "/manager-dashboard";
  if (role === "REGIONAL_MANAGER") return "/assistant-manager-dashboard";
  if (role === "WAITER" || role === "HOST") return "/waiter-dashboard";
  if (role === "KITCHEN_STAFF") return "/kitchen-dashboard";
  if (role === "BARTENDER") return "/bartender-dashboard";
  if (role === "CASHIER") return "/cashier-dashboard";

  if (role === "STAFF") {
    const primaryAssignment = user.assignments?.[0];
    const staffRole = primaryAssignment?.role;
    switch (staffRole) {
      case "BRANCH_MANAGER":
        return "/manager-dashboard";
      case "REGIONAL_MANAGER":
        return "/assistant-manager-dashboard";
      case "WAITER":
      case "HOST":
        return "/waiter-dashboard";
      case "KITCHEN_STAFF":
        return "/kitchen-dashboard";
      case "BARTENDER":
        return "/bartender-dashboard";
      case "CASHIER":
        return "/cashier-dashboard";
      default:
        return "/manager-dashboard";
    }
  }
  return "/admin-dashboard";
}

export default function SignIn() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // If already authenticated, smoothly redirect to their role dashboard
  useEffect(() => {
    if (isInitialized && isAuthenticated && user) {
      const target = getDestinationRoute(user);
      router.replace(target);
    }
  }, [isInitialized, isAuthenticated, user, router]);

  const handleQuickFill = (demo: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(demo.email);
    setPassword(demo.pass);
    toast.info(`Filled credentials for ${demo.role}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Authenticating credentials with Tavonza API...");

    try {
      const resultAction = await dispatch(
        loginUser({
          email: email.trim().toLowerCase(),
          password,
        })
      );

      if (loginUser.fulfilled.match(resultAction)) {
        const loggedInUser = resultAction.payload?.user;
        const userName = loggedInUser?.name || "Staff Member";
        toast.success(`Access granted! Welcome, ${userName}.`, { id: toastId });

        const targetRoute = getDestinationRoute(loggedInUser);
        router.push(targetRoute);
      } else {
        const errorMsg = (resultAction.payload as string) || "Invalid email or password.";
        toast.error(errorMsg, { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
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
          <span className="font-mono text-[11px] text-neutral-500">v2.4 — Enterprise RBAC</span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          RIGHT SIDE: Sign In Form
      ─────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-14 relative z-10 my-auto overflow-y-auto max-h-screen">
        <div className="w-full max-w-md flex flex-col gap-6 py-4">
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
              Enter your credentials to access your restaurant operations workspace.
            </p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  onClick={() => router.push("/forgot-password")}
                  className="text-[11px] text-neutral-400 hover:text-amber-400 transition cursor-pointer"
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
                  className="absolute right-3 text-neutral-500 hover:text-neutral-300 p-1 cursor-pointer"
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
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials (Fast-Switch for Testing) */}
          {/* <div className="flex flex-col gap-2 pt-2 border-t border-neutral-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400">
                Demo Accounts Quick-Fill
              </span>
              <span className="text-[10px] text-amber-400 font-mono">1-Click Test</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((demo) => {
                const Icon = demo.icon;
                return (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => handleQuickFill(demo)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition cursor-pointer ${demo.color}`}
                  >
                    <Icon className="w-3 h-3 shrink-0" />
                    <span className="truncate">{demo.label}</span>
                  </button>
                );
              })}
            </div>
          </div> */}

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
