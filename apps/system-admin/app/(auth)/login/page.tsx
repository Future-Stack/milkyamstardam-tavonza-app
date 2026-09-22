"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import logo from "../../../public/logo.png";
import { loginAction } from "../../actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await loginAction(email, password);

    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    // The session cookie is set; re-render from the server so the proxy and the
    // admin layout both see it.
    router.replace("/");
    router.refresh();
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 shrink-0 rounded-full flex items-center justify-center bg-white/5 shadow-[0_0_20px_rgba(212,175,55,0.15)] mb-4">
          <Image src={logo} alt="Tavonza Logo" width={120} height={120} className="rounded-full" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Welcome Back</h1>
        <p className="text-sm text-gray-400">Sign in to the Tavonza Super Admin console</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tavonza.com"
              className="w-full bg-black/20 text-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 border border-white/5 transition-colors hover:border-white/10"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
            <Link href="/forgot-password" className="text-xs font-medium text-[#D4AF37] hover:text-[#C4A45D] transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/20 text-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 border border-white/5 transition-colors hover:border-white/10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 py-2">
          <input 
            type="checkbox" 
            id="remember"
            className="w-4 h-4 rounded bg-black/20 border-white/10 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
          />
          <label htmlFor="remember" className="text-sm text-gray-400 select-none">Remember me for 30 days</label>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 leading-snug">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C4A45D] text-[#090B10] px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</>
          ) : (
            <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
          )}
        </button>
      </form>
    </div>
  );
}
