import Link from "next/link";
import { Building, Plus, ChevronRight, ChevronLeft } from "lucide-react";

import { listClients } from "../../lib/queries";
import { SearchField } from "../../components/SearchField";

const PAGE_SIZE = 20;

export default async function OrganizationsList({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  const { admins, meta } = await listClients({
    page,
    limit: PAGE_SIZE,
    searchTerm: query || undefined,
  });

  const rows = admins.map((admin) => {
    const organization = admin.ownedOrganizations?.[0];
    return {
      // Keyed by the admin id: the detail page reads GET /admins/:id, which
      // returns the admin *plus* their organizations in one call.
      id: admin.id,
      name: organization?.name ?? `${admin.name}'s organization`,
      admin: admin.email,
      extraOrganizations: Math.max(0, (admin.ownedOrganizations?.length ?? 0) - 1),
      isActive: admin.status === "ACTIVE",
    };
  });

  const totalPages = meta?.totalPage ?? 1;
  const total = meta?.total ?? rows.length;

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
         <div className="p-4 md:p-6 border-b border-white/5 bg-black/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
           <SearchField
             basePath="/organizations"
             initialQuery={query}
             placeholder="Search by admin name, email or contact..."
           />
           <span className="text-xs text-gray-500 uppercase tracking-wider">
             {total} {total === 1 ? "client" : "clients"}
           </span>
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
                  {rows.length > 0 ? rows.map((org) => (
                     <tr key={org.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-5 font-medium text-white flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-400 group-hover:border-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors">
                             <Building className="w-5 h-5" />
                           </div>
                           <span>
                             {org.name}
                             {org.extraOrganizations > 0 && (
                               <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                 +{org.extraOrganizations} more
                               </span>
                             )}
                           </span>
                        </td>
                        <td className="px-6 py-5 text-gray-400">{org.admin}</td>
                        <td className="px-6 py-5">
                           <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-transparent group-hover:border-white/5 ${
                             org.isActive
                               ? "text-green-400 bg-green-500/10"
                               : "text-gray-400 bg-white/5"
                           }`}>
                              {org.isActive ? "Active" : "Inactive"}
                           </span>
                        </td>
                        <td className="px-6 py-5">
                           {/* No support-access API exists on the backend yet. */}
                           <span
                             className="text-xs text-gray-500 font-medium"
                             title="The backend has no support-access endpoint yet"
                           >
                             Not available
                           </span>
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
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        {query ? `No clients found matching "${query}"` : "No clients onboarded yet."}
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Mobile Card-Stack View */}
         <div className="md:hidden divide-y divide-white/5">
           {rows.length > 0 ? rows.map((org) => (
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
                 <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-lg ${
                   org.isActive ? "text-green-400 bg-green-500/10" : "text-gray-400 bg-white/5"
                 }`}>
                    {org.isActive ? "Active" : "Inactive"}
                 </span>
               </div>

               <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5 mb-3">
                 <span className="text-xs text-gray-500 font-medium">Support Access:</span>
                 <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Not available</span>
               </div>

               <Link
                 href={`/organizations/${org.id}`}
                 className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/[0.03] hover:bg-white/[0.06] text-gray-300 rounded-xl text-sm font-medium transition-colors border border-white/5"
               >
                 View Details
               </Link>
             </div>
           )) : (
             <div className="p-12 text-center text-gray-500 text-sm">
               {query ? `No clients found matching "${query}"` : "No clients onboarded yet."}
             </div>
           )}
         </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-black/20">
            <PageLink page={page - 1} disabled={page <= 1} query={query} label="Previous" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Page {page} of {totalPages}
            </span>
            <PageLink page={page + 1} disabled={page >= totalPages} query={query} label="Next" align="right" />
          </div>
        )}
      </div>
    </div>
  );
}

function PageLink({
  page,
  disabled,
  query,
  label,
  align = "left",
}: {
  page: number;
  disabled: boolean;
  query: string;
  label: string;
  align?: "left" | "right";
}) {
  const className = `inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
    disabled ? "text-gray-600 pointer-events-none" : "text-[#D4AF37] hover:text-[#C4A45D]"
  }`;

  if (disabled) {
    return (
      <span className={className}>
        {align === "left" && <ChevronLeft className="w-4 h-4" />}
        {label}
        {align === "right" && <ChevronRight className="w-4 h-4" />}
      </span>
    );
  }

  const params = new URLSearchParams();
  if (query) params.set("q", query);
  params.set("page", String(page));

  return (
    <Link href={`/organizations?${params.toString()}`} className={className}>
      {align === "left" && <ChevronLeft className="w-4 h-4" />}
      {label}
      {align === "right" && <ChevronRight className="w-4 h-4" />}
    </Link>
  );
}
