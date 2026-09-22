import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";

import { formatDate, relativeTime } from "../../../lib/format";
import { getClient, listAuditLogs } from "../../../lib/queries";
import { ClientStatusButton } from "./ClientStatusButton";
import { SupportAccessPanel } from "./SupportAccessPanel";

export default async function OrganizationDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const admin = await getClient(id);
  if (!admin) notFound();

  const organizations = admin.ownedOrganizations ?? [];
  const primary = organizations[0];
  const organizationIds = new Set(organizations.map((org) => org.id));

  // `AuditLogFilterDto` declares no `entityId`, and the global ValidationPipe
  // runs with `whitelist: true`, so an entityId query param would be stripped
  // before the service saw it. Filter by entityType server-side and narrow to
  // this client's organizations here.
  const { logs } = await listAuditLogs({ entityType: "Organization", limit: 50 });
  const clientLogs = logs.filter((log) => organizationIds.has(log.entityId));

  const isActive = admin.status === "ACTIVE";

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
            {primary?.name ?? admin.name}
            {organizations.length > 1 && ` +${organizations.length - 1} more`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Support Access Control & Client Info */}
        <div className="lg:col-span-1 space-y-6">
          <SupportAccessPanel />

          <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 shadow-2xl">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Client Info</h2>
            <div className="space-y-4 text-sm">
               <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
                 <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Admin Owner</span>
                 <span className="text-gray-200 font-medium break-all">{admin.email}</span>
               </div>
               <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
                 <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Status</span>
                 <span className={isActive ? "text-green-400 font-bold tracking-wide" : "text-gray-400 font-bold tracking-wide"}>
                   {isActive ? "Active" : "Inactive"}
                 </span>
               </div>
               <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
                 <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Contact</span>
                 <span className="text-gray-200 font-medium">{admin.contactNo || "—"}</span>
               </div>
               <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
                 <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                   Organization{organizations.length > 1 ? "s" : ""}
                 </span>
                 <span className="text-gray-200 font-medium">
                   {organizations.length > 0
                     ? organizations.map((org) => org.name).join(", ")
                     : "—"}
                 </span>
               </div>
               <div className="flex flex-col gap-1">
                 <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Created Date</span>
                 <span className="text-gray-200 font-medium">{formatDate(admin.createdAt)}</span>
               </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <ClientStatusButton adminId={admin.id} isActive={isActive} />
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
                Organization events recorded for this client.
              </p>
            </div>

            <div className="p-6 md:p-8 flex-1">
              {clientLogs.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No audit entries recorded for this client yet.
                </p>
              ) : (
                <div className="relative border-l border-white/10 ml-3 space-y-8">
                  {clientLogs.map((log, i) => (
                    <div key={log.id} className={`relative pl-6 sm:pl-8 ${i === 0 ? 'animate-in fade-in slide-in-from-top-4 duration-500' : ''}`}>
                      <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-[#090B10] ${
                        log.action.includes('CREATED') ? 'bg-[#D4AF37]' : 'bg-[#00F2FE] shadow-[0_0_10px_#00F2FE]'
                      }`}></div>

                      <div className="bg-white/[0.02] p-4 md:p-5 rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-colors">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0 mb-2">
                          <span className="text-sm font-bold text-white">
                            {log.action.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs font-mono text-gray-500 tracking-wider">
                            {relativeTime(log.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {log.actor?.name ?? "System"} · {log.entityType}
                          {log.metadata ? ` · ${JSON.stringify(log.metadata)}` : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
