"use client";

import { useActionState, useRef, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Loader2,
  Save,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Camera,
} from "lucide-react";

import { updateMyProfileAction } from "../../actions/admins";
import { changePasswordAction, requestEmailChangeAction } from "../../actions/auth";
import type { ActionResult } from "../../lib/types";

export interface ProfileUser {
  name: string;
  email: string;
  contactNo: string;
  avatar: string | null;
}

type Tab = "profile" | "security";

/** Shared status line: green on success, red on failure, nothing while idle. */
function Status({ result }: { result: ActionResult | null }) {
  if (!result) return <div />;

  const Icon = result.success ? CheckCircle2 : AlertCircle;
  return (
    <div
      className={`flex items-start gap-2 text-sm font-medium ${
        result.success ? "text-green-400" : "text-red-400"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />
      <span className="leading-snug">{result.message}</span>
    </div>
  );
}

export function ProfileForms({ user }: { user: ProfileUser }) {
  const [tab, setTab] = useState<Tab>("profile");

  const [profileState, profileAction, isSavingProfile] = useActionState(
    updateMyProfileAction,
    null,
  );
  const [emailState, emailAction, isSavingEmail] = useActionState(
    requestEmailChangeAction,
    null,
  );
  const [passwordState, passwordAction, isSavingPassword] = useActionState(
    changePasswordAction,
    null,
  );

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const shownAvatar = avatarPreview ?? user.avatar;

  const handleAvatarPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Segmented control */}
      <div
        role="tablist"
        aria-label="Profile sections"
        className="flex items-center gap-1.5 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl w-fit"
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = tab === id;
          return (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]/60 ${
                isActive
                  ? "bg-[#D4AF37] text-[#090B10] shadow-[0_0_18px_rgba(212,175,55,0.28)]"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {tab === "profile" ? (
        <section
          role="tabpanel"
          aria-label="Profile"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {/* Personal information */}
          <div className="bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-[#D4AF37] opacity-10 blur-[50px] rounded-full pointer-events-none"></div>

            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#D4AF37]" />
              Personal Details
            </h2>

            <form action={profileAction} className="space-y-5">
              <div className="flex items-center gap-6 mb-8">
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  aria-label="Change avatar"
                  className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60"
                >
                  {shownAvatar ? (
                    <img src={shownAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center bg-[#D4AF37]/15 text-[#D4AF37] text-xl font-bold uppercase">
                      {user.name.slice(0, 2)}
                    </span>
                  )}
                  <span className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </span>
                </button>
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-1">Avatar Image</p>
                  <p className="text-xs text-gray-500">JPG or PNG. Uploaded when you save.</p>
                </div>
                <input
                  ref={fileInput}
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleAvatarPick}
                  className="hidden"
                />
              </div>

              <div>
                <label htmlFor="profile-name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    required
                    defaultValue={user.name}
                    className="w-full bg-black/20 text-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 border border-white/5 transition-colors hover:border-white/10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="profile-contact" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id="profile-contact"
                    type="text"
                    name="contactNo"
                    defaultValue={user.contactNo}
                    placeholder="Optional"
                    className="w-full bg-black/20 text-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 border border-white/5 transition-colors hover:border-white/10"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-4">
                <Status result={profileState} />
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="shrink-0 flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] text-white px-6 py-2.5 rounded-xl font-semibold transition-all border border-white/5 disabled:opacity-70"
                >
                  {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Email — its own form, because it goes through the confirmation-link flow */}
          <div className="bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-[#00F2FE] opacity-10 blur-[50px] rounded-full pointer-events-none"></div>

            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#00F2FE]" />
              Email Address
            </h2>

            <form action={emailAction} className="space-y-5">
              <div>
                <label htmlFor="profile-email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  New Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id="profile-email"
                    type="email"
                    name="newEmail"
                    required
                    defaultValue={user.email}
                    className="w-full bg-black/20 text-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#00F2FE]/50 border border-white/5 transition-colors hover:border-white/10"
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-black/20 border border-white/5 p-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Your address only changes once you open the confirmation link we send to the new
                  inbox. Until then <span className="text-gray-300">{user.email}</span> stays active.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between gap-4">
                <Status result={emailState} />
                <button
                  type="submit"
                  disabled={isSavingEmail}
                  className="shrink-0 flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] text-white px-6 py-2.5 rounded-xl font-semibold transition-all border border-white/5 disabled:opacity-70"
                >
                  {isSavingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Send Confirmation
                </button>
              </div>
            </form>
          </div>
        </section>
      ) : (
        <section
          role="tabpanel"
          aria-label="Security"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden max-w-2xl">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-[#00F2FE] opacity-10 blur-[50px] rounded-full pointer-events-none"></div>

            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00F2FE]" />
              Change Password
            </h2>

            <form action={passwordAction} className="space-y-5">
              <div>
                <label htmlFor="current-password" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id="current-password"
                    type="password"
                    name="currentPassword"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full bg-black/20 text-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#00F2FE]/50 border border-white/5 transition-colors hover:border-white/10"
                  />
                </div>
              </div>

              <div className="h-px bg-white/5 my-6"></div>

              <div>
                <label htmlFor="new-password" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id="new-password"
                    type="password"
                    name="newPassword"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    className="w-full bg-black/20 text-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#00F2FE]/50 border border-white/5 transition-colors hover:border-white/10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id="confirm-password"
                    type="password"
                    name="confirmPassword"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Repeat the new password"
                    className="w-full bg-black/20 text-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#00F2FE]/50 border border-white/5 transition-colors hover:border-white/10"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-4">
                <Status result={passwordState} />
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="shrink-0 flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] text-white px-6 py-2.5 rounded-xl font-semibold transition-all border border-white/5 disabled:opacity-70"
                >
                  {isSavingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
