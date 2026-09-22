"use client";

import { useState } from "react";
import Link from "next/link";
import { Building, Plus, Search, MoreVertical, ChevronRight } from "lucide-react";

export default function OrganizationsList() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const initialOrgs = [
     { id: "1", name: "Bella Italia", admin: "maria@bellaitalia.com", status: "Active", access: "Inactive", statusColor: "text-green-400 bg-green-500/10", activeAccess: false },
     { id: "2", name: "Sushi Paradise", admin: "kenji@sushiparadise.com", status: "Active", access: "Active (59m)", statusColor: "text-green-400 bg-green-500/10", activeAccess: true },
     { id: "3", name: "Burger Joint", admin: "bob@burgerjoint.com", status: "Onboarding", access: "Inactive", statusColor: "text-[#D4AF37] bg-[#D4AF37]/10", activeAccess: false },
  ];

  const filteredOrgs = initialOrgs.filter(org => 
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    org.admin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
            Client Organizations
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Manage onboarding and support access for all clients on the platform.
          </p>
        </div>
        <Link 
          href="/organizations/new"
          className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C4A45D] text-[#090B10] px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Onboard New Client
        </Link>
      </div>

      <div className="bg-white/[0.02] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
         <div className="p-4 md:p-6 border-b border-white/5 bg-black/20">
           <div className="relative w-full sm:w-96">
             <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search clients..."
               className="bg-white/[0.03] text-sm text-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 w-full border border-white/5 transition-all hover:bg-white/[0.05]"
             />
           </div>
         </div>
         
         {/* Desktop Table View */}
         <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="text-xs text-gray-500 bg-white/[0.01] uppercase tracking-widest border-b border-white/5">
                  <tr>
                     <th className="px-6 py-5 font-semibold">Organization</th>
                     <th className="px-6 py-5 font-semibold">Admin Owner</th>
                     <th className="px-6 py-5 font-semibold">Status</th>
                     <th className="px-6 py-5 font-semibold">Support Access</th>
                     <th className="px-6 py-5 font-semibold text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {filteredOrgs.length > 0 ? filteredOrgs.map((org) => (
                     <tr key={org.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-5 font-medium text-white flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-400 group-hover:border-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors">
                             <Building className="w-5 h-5" />
                           </div>
                           {org.name}
                        </td>
                        <td className="px-6 py-5 text-gray-400">{org.admin}</td>
                        <td className="px-6 py-5">
                           <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-transparent group-hover:border-white/5 ${org.statusColor}`}>
                              {org.status}
                           </span>
                        </td>
                        <td className="px-6 py-5">
                           {org.activeAccess ? (
                             <span className="flex items-center gap-2 text-xs font-medium text-[#00F2FE] bg-[#00F2FE]/10 px-3 py-1.5 rounded-lg w-max border border-[#00F2FE]/20">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE] animate-pulse"></div>
                               {org.access}
                             </span>
                           ) : (
                             <span className="text-xs text-gray-500 font-medium">{org.access}</span>
                           )}
                        </td>
                        <td className="px-6 py-5 text-right">
                           <Link href={`/organizations/${org.id}`} className="inline-flex items-center gap-1 text-[#D4AF37] hover:text-[#C4A45D] font-medium mr-4 group-hover:underline">
                             View Details
                             <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0" />
                           </Link>
                        </td>
                     </tr>
                  )) : (
                     <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No organizations found matching "{searchQuery}"</td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Mobile Card-Stack View */}
         <div className="md:hidden divide-y divide-white/5">
           {filteredOrgs.length > 0 ? filteredOrgs.map((org) => (
             <div key={org.id} className="p-4 hover:bg-white/[0.02] transition-colors">
               <div className="flex items-start justify-between mb-3">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-400">
                     <Building className="w-5 h-5" />
                   </div>
                   <div>
                     <h3 className="text-white font-medium">{org.name}</h3>
                     <p className="text-xs text-gray-400 mt-0.5">{org.admin}</p>
                   </div>
                 </div>
                 <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-lg ${org.statusColor}`}>
                    {org.status}
                 </span>
               </div>
               
               <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5 mb-3">
                 <span className="text-xs text-gray-500 font-medium">Support Access:</span>
                 {org.activeAccess ? (
                   <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#00F2FE]">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] animate-pulse"></div>
                     {org.access}
                   </span>
                 ) : (
                   <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{org.access}</span>
                 )}
               </div>
               
               <Link 
                 href={`/organizations/${org.id}`} 
                 className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/[0.03] hover:bg-white/[0.06] text-gray-300 rounded-xl text-sm font-medium transition-colors border border-white/5"
               >
                 View Details
               </Link>
             </div>
           )) : (
             <div className="p-12 text-center text-gray-500 text-sm">No organizations found matching "{searchQuery}"</div>
           )}
         </div>
      </div>
    </div>
  );
}
