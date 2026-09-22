"use client";

import { useState } from "react";
import { Search, Filter, ShieldCheck, Download, ChevronRight } from "lucide-react";

export default function GlobalAuditLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock State
  const initialLogs = [
     { id: 1, time: "2026-09-22 09:45", actor: "Support Team", action: "Access Granted", target: "Bella Italia (ORG-12)", context: "Ticket #8992 (1 Hour)", color: "text-[#00F2FE]", bg: "bg-[#00F2FE]/10" },
     { id: 2, time: "2026-09-21 14:20", actor: "System", action: "Access Expired", target: "Sushi Paradise (ORG-04)", context: "Auto-revoked (Expired)", color: "text-gray-400", bg: "bg-gray-500/10" },
     { id: 3, time: "2026-09-21 13:20", actor: "Support Team", action: "Access Granted", target: "Sushi Paradise (ORG-04)", context: "Ticket #8911 (1 Hour)", color: "text-[#00F2FE]", bg: "bg-[#00F2FE]/10" },
     { id: 4, time: "2026-09-19 10:15", actor: "Support Team", action: "Org Created", target: "Burger Joint (ORG-55)", context: "Onboarding flow", color: "text-green-400", bg: "bg-green-500/10" },
     { id: 5, time: "2026-09-18 16:44", actor: "System", action: "Access Revoked", target: "Pizza Hat (ORG-19)", context: "Manual Revocation", color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10" },
  ];

  // Derived State (Filtering)
  const filteredLogs = initialLogs.filter(log => 
    log.target.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3 tracking-tight">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
            </div>
            Global Audit Logs
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xl">
            Immutable log of all Super Admin access events across all client organizations.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.06] text-gray-300 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors border border-white/5 w-full sm:w-auto">
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      <div className="bg-white/[0.02] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
         {/* Toolbar */}
         <div className="p-4 md:p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/20">
           <div className="relative w-full sm:w-96">
             <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search by admin, ID, or client..."
               className="bg-white/[0.03] text-sm text-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 w-full border border-white/5 transition-all hover:bg-white/[0.05]"
             />
           </div>
           <button className="flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.06] text-gray-300 px-4 py-2.5 rounded-xl text-sm transition-colors border border-white/5 w-full sm:w-auto">
             <Filter className="w-4 h-4" />
             Filter
           </button>
         </div>
         
         {/* Desktop Table View (Hidden on mobile) */}
         <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="text-xs text-gray-500 bg-white/[0.01] uppercase tracking-widest border-b border-white/5">
                  <tr>
                     <th className="px-6 py-5 font-semibold">Timestamp</th>
                     <th className="px-6 py-5 font-semibold">Actor</th>
                     <th className="px-6 py-5 font-semibold">Action</th>
                     <th className="px-6 py-5 font-semibold">Target / Client</th>
                     <th className="px-6 py-5 font-semibold">Context</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                     <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-5 text-gray-400 font-mono text-xs tracking-wider">{log.time}</td>
                        <td className="px-6 py-5 text-gray-200 font-medium">{log.actor}</td>
                        <td className="px-6 py-5">
                           <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-transparent group-hover:border-white/5 transition-colors ${log.color} ${log.bg}`}>
                             {log.action}
                           </span>
                        </td>
                        <td className="px-6 py-5 text-gray-300">{log.target}</td>
                        <td className="px-6 py-5 text-gray-500">{log.context}</td>
                     </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No logs found matching "{searchQuery}"</td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Mobile Card-Stack View (Hidden on desktop) */}
         <div className="md:hidden divide-y divide-white/5">
           {filteredLogs.length > 0 ? filteredLogs.map((log) => (
             <div key={log.id} className="p-4 space-y-3 hover:bg-white/[0.02] transition-colors">
               <div className="flex items-start justify-between gap-2">
                 <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg ${log.color} ${log.bg}`}>
                   {log.action}
                 </span>
                 <span className="text-[10px] font-mono text-gray-500">{log.time}</span>
               </div>
               
               <div>
                 <p className="text-sm font-medium text-white">{log.target}</p>
                 <p className="text-xs text-gray-400 mt-1">Actor: {log.actor}</p>
               </div>
               
               <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                 <p className="text-xs text-gray-400 font-mono flex items-center justify-between">
                   <span>{log.context}</span>
                   <ChevronRight className="w-3 h-3 text-gray-600" />
                 </p>
               </div>
             </div>
           )) : (
             <div className="p-12 text-center text-gray-500 text-sm">No logs found matching "{searchQuery}"</div>
           )}
         </div>
      </div>
    </div>
  );
}
