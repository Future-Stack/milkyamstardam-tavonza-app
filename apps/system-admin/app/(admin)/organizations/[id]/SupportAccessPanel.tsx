"use client";

import { useState } from "react";
import { ShieldAlert, Key, Clock, CheckCircle2, Loader2, X } from "lucide-react";

/**
 * Temporary support-access control.
 *
 * The visual flow is unchanged, but the backend exposes no support-access
 * endpoint yet, so this is local-only state: nothing is requested, granted or
 * recorded server-side. The copy says so rather than implying an audit trail
 * that does not exist.
 */
export function SupportAccessPanel() {
  const [hasAccess, setHasAccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [duration, setDuration] = useState("1 Hour");

  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRequesting(true);
    setTimeout(() => {
      setIsRequesting(false);
      setHasAccess(true);
      setShowModal(false);
      setTicketNumber("");
      setDuration("1 Hour");
    }, 600);
  };

  return (
    <>
      <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
        {hasAccess && (
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-[#00F2FE] opacity-10 blur-[50px] rounded-full pointer-events-none"></div>
        )}

        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <ShieldAlert className={`w-5 h-5 ${hasAccess ? 'text-[#00F2FE]' : 'text-[#D4AF37]'}`} />
          Support Access
        </h2>

        {!hasAccess ? (
          <>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Super Admins do not have standing access to client data. You must request temporary access for support tickets.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C4A45D] text-[#090B10] py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]"
            >
              <Key className="w-5 h-5" />
              Request Temporary Access
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#00F2FE]/10 flex items-center justify-center mx-auto mb-4 border border-[#00F2FE]/20 relative">
              <div className="absolute inset-0 rounded-full border border-[#00F2FE]/40 animate-ping opacity-20"></div>
              <CheckCircle2 className="w-8 h-8 text-[#00F2FE]" />
            </div>
            <p className="text-lg font-bold text-white mb-1">Access Granted</p>
            <p className="text-sm font-medium text-[#00F2FE] mb-6 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] animate-pulse"></span>
              Expires in {duration.toLowerCase()}
            </p>
            <button
              onClick={() => setHasAccess(false)}
              className="w-full py-3 bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 text-sm font-semibold rounded-xl transition-colors border border-white/5"
            >
              Revoke Access Early
            </button>
          </div>
        )}

        <p className="mt-5 pt-5 border-t border-white/5 text-[11px] leading-relaxed text-gray-500">
          Not yet connected — the API has no support-access endpoint, so this
          does not grant access or write an audit entry.
        </p>
      </div>

      {/* Request Access Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#090B10]/80 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
          <div className="bg-[#11141D] border border-white/10 rounded-t-3xl md:rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Request Access</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              This form is not yet wired to the backend — submitting it will not
              grant access or record anything.
            </p>

            <form onSubmit={handleRequestAccess} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Support Ticket Number</label>
                <input
                  type="text"
                  required
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  placeholder="e.g. #1234"
                  className="w-full bg-black/20 text-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 border border-white/5 transition-colors hover:border-white/10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Access Duration</label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-black/20 text-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 border border-white/5 appearance-none cursor-pointer hover:border-white/10 transition-colors"
                  >
                    <option>1 Hour</option>
                    <option>4 Hours</option>
                    <option>24 Hours</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 mt-2 flex flex-col-reverse md:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isRequesting}
                  className="w-full md:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRequesting}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-[#D4AF37] text-[#090B10] hover:bg-[#C4A45D] transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-70"
                >
                  {isRequesting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Authorizing...</>
                  ) : (
                    "Confirm Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
