import Link from "next/link";
import { Filter, ShieldCheck, Download, ChevronRight, ChevronLeft } from "lucide-react";

import { formatTimestamp } from "../../lib/format";
import { listAuditLogs } from "../../lib/queries";
import { SearchField } from "../../components/SearchField";

const PAGE_SIZE = 25;

/** Badge colour per action kind, matching the original design's palette. */
function actionStyle(action: string): string {
  const value = action.toUpperCase();
  if (value.includes("DELETE") || value.includes("REVOKE") || value.includes("EXPIRED")) {
    return "text-[#D4AF37] bg-[#D4AF37]/10";
  }
  if (value.includes("CREATE")) return "text-green-400 bg-green-500/10";
  if (value.includes("UPDATE") || value.includes("CHANGE") || value.includes("LOGIN")) {
    return "text-[#00F2FE] bg-[#00F2FE]/10";
  }
  return "text-gray-400 bg-gray-500/10";
}

function contextOf(metadata: unknown): string {
  if (!metadata || typeof metadata !== "object") return "—";
  const entries = Object.entries(metadata as Record<string, unknown>);
  if (entries.length === 0) return "—";
  return entries.map(([key, value]) => `${key}: ${String(value)}`).join(" · ");
}

export default async function GlobalAuditLogs({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  const { logs, meta } = await listAuditLogs({
    page,
    limit: PAGE_SIZE,
    searchTerm: query || undefined,
  });

  const rows = logs.map((log) => ({
    id: log.id,
    time: formatTimestamp(log.createdAt),
    actor: log.actor?.name ?? "System",
    action: log.action,
    target: `${log.entityType} · ${log.entityId.slice(-6)}`,
    context: log.metadata ? contextOf(log.metadata) : log.entityId,
  }));

  const totalPages = meta?.totalPage ?? 1;
  const total = meta?.total ?? rows.length;

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
        <button
          disabled
          title="Export is not available — the API has no export endpoint"
          className="flex items-center justify-center gap-2 bg-white/[0.03] text-gray-500 px-5 py-2.5 rounded-xl font-medium text-sm border border-white/5 w-full sm:w-auto cursor-not-allowed opacity-60"
        >
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      <div className="bg-white/[0.02] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
         {/* Toolbar */}
         <div className="p-4 md:p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/20">
           <SearchField
             basePath="/audit-logs"
             initialQuery={query}
             placeholder="Search by action or entity type..."
           />
           <div className="flex items-center gap-4">
             <span className="text-xs text-gray-500 uppercase tracking-wider">
               {total} {total === 1 ? "entry" : "entries"}
             </span>
             <button
               disabled
               title="Filtering is not available — the API has no filter endpoint"
               className="flex items-center justify-center gap-2 bg-white/[0.03] text-gray-500 px-4 py-2.5 rounded-xl text-sm border border-white/5 cursor-not-allowed opacity-60"
             >
               <Filter className="w-4 h-4" />
               Filter
             </button>
           </div>
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
                  {rows.length > 0 ? rows.map((log) => (
                     <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-5 text-gray-400 font-mono text-xs tracking-wider">{log.time}</td>
                        <td className="px-6 py-5 text-gray-200 font-medium">{log.actor}</td>
                        <td className="px-6 py-5">
                           <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-transparent group-hover:border-white/5 transition-colors ${actionStyle(log.action)}`}>
                             {log.action}
                           </span>
                        </td>
                        <td className="px-6 py-5 text-gray-300">{log.target}</td>
                        <td className="px-6 py-5 text-gray-500">{log.context}</td>
                     </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        {query ? `No logs found matching "${query}"` : "No audit entries recorded yet."}
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Mobile Card-Stack View (Hidden on desktop) */}
         <div className="md:hidden divide-y divide-white/5">
           {rows.length > 0 ? rows.map((log) => (
             <div key={log.id} className="p-4 space-y-3 hover:bg-white/[0.02] transition-colors">
               <div className="flex items-start justify-between gap-2">
                 <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg ${actionStyle(log.action)}`}>
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
             <div className="p-12 text-center text-gray-500 text-sm">
               {query ? `No logs found matching "${query}"` : "No audit entries recorded yet."}
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
    <Link href={`/audit-logs?${params.toString()}`} className={className}>
      {align === "left" && <ChevronLeft className="w-4 h-4" />}
      {label}
      {align === "right" && <ChevronRight className="w-4 h-4" />}
    </Link>
  );
}
