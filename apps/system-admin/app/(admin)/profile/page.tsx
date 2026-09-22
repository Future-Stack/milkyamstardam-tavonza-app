"use client";

import { useState } from "react";
import { User, Mail, Lock, Loader2, Save, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  // Personal Info State
  const [name, setName] = useState("Support Team");
  const [email, setEmail] = useState("admin@tavonza.com");
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [infoSuccess, setInfoSuccess] = useState(false);

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState(false);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingInfo(true);
    setTimeout(() => {
      setIsSavingInfo(false);
      setInfoSuccess(true);
      setTimeout(() => setInfoSuccess(false), 3000);
    }, 1500);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    setIsSavingSecurity(true);
    setTimeout(() => {
      setIsSavingSecurity(false);
      setSecuritySuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSecuritySuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
          Profile & Security
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Manage your personal account details and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-[#D4AF37] opacity-10 blur-[50px] rounded-full pointer-events-none"></div>
          
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-[#D4AF37]" />
            Personal Details
          </h2>

          <div className="flex items-center gap-6 mb-8">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group cursor-pointer">
              <img src="https://i.pravatar.cc/150?img=11" alt="Profile Avatar" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-semibold text-white">Change</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium mb-1">Avatar Image</p>
              <p className="text-xs text-gray-500">JPG or PNG. Max size 2MB.</p>
            </div>
          </div>

          <form onSubmit={handleSaveInfo} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/20 text-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 border border-white/5 transition-colors hover:border-white/10"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/20 text-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 border border-white/5 transition-colors hover:border-white/10"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              {infoSuccess ? (
                <div className="flex items-center gap-2 text-sm font-medium text-green-400 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" /> Saved successfully
                </div>
              ) : (
                <div></div>
              )}
              <button 
                type="submit"
                disabled={isSavingInfo}
                className="flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] text-white px-6 py-2.5 rounded-xl font-semibold transition-all border border-white/5 disabled:opacity-70"
              >
                {isSavingInfo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Security Settings */}
        <div className="bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-[#00F2FE] opacity-10 blur-[50px] rounded-full pointer-events-none"></div>
          
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00F2FE]" />
            Security Settings
          </h2>

          <form onSubmit={handleSaveSecurity} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Current Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/20 text-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#00F2FE]/50 border border-white/5 transition-colors hover:border-white/10"
                />
              </div>
            </div>
            
            <div className="h-px bg-white/5 my-6"></div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/20 text-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#00F2FE]/50 border border-white/5 transition-colors hover:border-white/10"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/20 text-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#00F2FE]/50 border border-white/5 transition-colors hover:border-white/10"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              {securitySuccess ? (
                <div className="flex items-center gap-2 text-sm font-medium text-green-400 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" /> Password updated
                </div>
              ) : (
                <div></div>
              )}
              <button 
                type="submit"
                disabled={isSavingSecurity}
                className="flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] text-white px-6 py-2.5 rounded-xl font-semibold transition-all border border-white/5 disabled:opacity-70"
              >
                {isSavingSecurity ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
