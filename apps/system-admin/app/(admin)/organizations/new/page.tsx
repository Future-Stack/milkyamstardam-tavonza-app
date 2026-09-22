"use client";

import Link from "next/link";
import { ArrowLeft, Building, User, Mail, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { onboardClientAction } from "../../../actions/admins";

export default function NewOrganization() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    orgName: "",
    adminName: "",
    adminEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // POST /admins creates the ADMIN and their one organization together.
    const result = await onboardClientAction({
      adminName: formData.adminName.trim(),
      adminEmail: formData.adminEmail.trim(),
      organizationName: formData.orgName.trim(),
    });

    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    setIsSuccess(true);
    router.push("/organizations");
    router.refresh();
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/organizations"
          className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">
            Onboard New Client
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Create a new organization record and its initial owner Admin account.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/[0.02] p-6 md:p-10 rounded-3xl border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
        
        {/* Success Overlay */}
        {isSuccess && (
          <div className="absolute inset-0 z-10 bg-[#090B10]/80 backdrop-blur-md flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
             </div>
             <h2 className="text-xl font-bold text-white mb-2">Organization Created</h2>
             <p className="text-gray-400 text-sm">Redirecting to client list...</p>
          </div>
        )}

        {/* Organization Details */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
            <Building className="w-4 h-4 text-[#D4AF37]" />
            Organization Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Organization Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Bella Italia"
                className="w-full bg-black/20 text-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 border border-white/5 transition-colors hover:border-white/10"
                value={formData.orgName}
                onChange={e => setFormData({...formData, orgName: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Initial Admin Details */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
            <User className="w-4 h-4 text-[#00F2FE]" />
            Initial Owner Admin
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Admin Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-black/20 text-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 border border-white/5 transition-colors hover:border-white/10"
                  value={formData.adminName}
                  onChange={e => setFormData({...formData, adminName: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  className="w-full bg-black/20 text-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 border border-white/5 transition-colors hover:border-white/10"
                  value={formData.adminEmail}
                  onChange={e => setFormData({...formData, adminEmail: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {error ? (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-300 leading-snug">{error}</p>
            </div>
          ) : (
            <p className="text-xs text-gray-500 leading-relaxed">
              The admin will be created with the default password and must change it after their first sign-in.
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C4A45D] text-[#090B10] px-8 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSubmitting ? "Creating..." : "Create Organization"}
          </button>
        </div>
      </form>
    </div>
  );
}
