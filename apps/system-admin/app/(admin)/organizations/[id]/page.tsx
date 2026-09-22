"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Key, Clock, FileText, CheckCircle2, Loader2, X } from "lucide-react";
import { useState } from "react";

export default function OrganizationDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // State for Access Request
  const [hasAccess, setHasAccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [duration, setDuration] = useState("1 Hour");
  
  // Local Audit Log State
  const [logs, setLogs] = useState([
     { id: 1, action: "Support Access Expired", time: "2 days ago", details: "Previous access token expired automatically.", type: "expired" },
     { id: 2, action: "Support Access Granted", time: "2 days ago", details: "Super Admin (Support Team) requested 1 hour access. Reason: Ticket #8910.", type: "granted" },
     { id: 3, action: "Organization Created", time: "Oct 12, 2023", details: "Super Admin onboarded Bella Italia.", type: "created" },
  ]);

  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRequesting(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsRequesting(false);
      setHasAccess(true);
      setShowModal(false);
      
      // Prepend new log
      setLogs([{
        id: Date.now(),
        action: "Support Access Granted",
        time: "Just now",
        details: `Super Admin (Support Team) requested ${duration} access. Reason: Ticket ${ticketNumber}.`,
        type: "granted"
      }, ...logs]);
      
      // Reset form
      setTicketNumber("");
      setDuration("1 Hour");
    }, 1500);
  };
  
  const handleRevoke = () => {
    setHasAccess(false);
    setLogs([{
      id: Date.now(),
      action: "Support Access Revoked",
      time: "Just now",
      details: "Access revoked early by Super Admin.",
      type: "expired"
    }, ...logs]);
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/organizations"
          className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">
            Organization Details
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            ID: {id} • Bella Italia
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Support Access Control & Client Info */}
        <div className="lg:col-span-1 space-y-6">
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
                  Expires in 59 minutes
                </p>
                <button 
                  onClick={handleRevoke}
                  className="w-full py-3 bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 text-sm font-semibold rounded-xl transition-colors border border-white/5"
                >
                  Revoke Access Early
                </button>
              </div>
            )}
          </div>

          <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 shadow-2xl">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Client Info</h2>
            <div className="space-y-4 text-sm">
               <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
                 <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Admin Owner</span>
                 <span className="text-gray-200 font-medium">maria@bellaitalia.com</span>
               </div>
               <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
                 <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Status</span>
                 <span className="text-green-400 font-bold tracking-wide">Active</span>
               </div>
               <div className="flex flex-col gap-1">
                 <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Created Date</span>
                 <span className="text-gray-200 font-medium">Oct 12, 2023</span>
               </div>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="lg:col-span-2">
          <div className="bg-white/[0.02] rounded-3xl border border-white/5 overflow-hidden h-full shadow-2xl flex flex-col">
            <div className="p-6 md:p-8 border-b border-white/5 bg-black/20">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
                <FileText className="w-5 h-5 text-gray-400" />
                Client Audit Log
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Every access event by a Super Admin is permanently logged here.
              </p>
            </div>
            
            <div className="p-6 md:p-8 flex-1">
              <div className="relative border-l border-white/10 ml-3 space-y-8">
                
                {logs.map((log, i) => (
                  <div key={log.id} className={`relative pl-6 sm:pl-8 ${i === 0 ? 'animate-in fade-in slide-in-from-top-4 duration-500' : ''}`}>
                    <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-[#090B10] ${
                      log.type === 'granted' ? 'bg-[#00F2FE] shadow-[0_0_10px_#00F2FE]' : 
                      log.type === 'created' ? 'bg-[#D4AF37]' : 
                      'bg-gray-600'
                    }`}></div>
                    
                    <div className="bg-white/[0.02] p-4 md:p-5 rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-colors">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0 mb-2">
                        <span className="text-sm font-bold text-white">{log.action}</span>
                        <span className="text-xs font-mono text-gray-500 tracking-wider">{log.time}</span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{log.details}</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>

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
              This action will grant you administrative privileges for this client. It will be permanently recorded in the audit trail.
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

    </div>
  );
}
