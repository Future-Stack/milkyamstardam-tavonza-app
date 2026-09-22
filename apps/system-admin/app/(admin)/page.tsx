import Link from "next/link";
import { Users, Store, UserCog, Activity, AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";

import { GrowthChart } from "./GrowthChart";
import { relativeTime } from "../lib/format";
import { getAnalyticsOverview, getGrowth, listAuditLogs } from "../lib/queries";

/** 1,284 / 12.9K / 1.2M — compact so a 6-digit figure does not blow out the tile. */
function compact(value: number): string {
  if (value < 1000) return String(value);
  if (value < 1_000_000) {
    const thousands = value / 1000;
    return `${thousands >= 100 ? Math.round(thousands) : Math.round(thousands * 10) / 10}K`;
  }
  return `${Math.round((value / 1_000_000) * 10) / 10}M`;
}

function eventType(action: string): "info" | "warning" | "success" | "default" {
  const value = action.toUpperCase();
  if (value.includes("DELETE") || value.includes("REVOKE") || value.includes("FAIL")) return "warning";
  if (value.includes("CREATE") || value.includes("COMPLETE") || value.includes("SUCCESS")) return "success";
  if (value.includes("UPDATE") || value.includes("LOGIN") || value.includes("CHANGE")) return "info";
  return "default";
}

export default async function PlatformHealth() {
  const [overview, growth, { logs }] = await Promise.all([
    getAnalyticsOverview(),
    getGrowth(30),
    listAuditLogs({ limit: 5 }),
  ]);

  const { organizations, restaurants, admins, users, onboarding, activity } = overview;

  const events = logs.map((log) => ({
    id: log.id,
    time: relativeTime(log.createdAt),
    event: `${log.action.replace(/_/g, " ").toLowerCase()} · ${log.entityType}`,
    detail: log.actor?.name ? `by ${log.actor.name}` : "system",
    type: eventType(log.action),
  }));

  const tiles = [
    {
      label: "Client organizations",
      value: compact(organizations.total),
      detail: organizations.newLast30Days > 0
        ? `+${organizations.newLast30Days} in the last 30 days`
        : "None added in 30 days",
      icon: Users,
      accent: "text-[#D4AF37]",
      accentBg: "bg-[#D4AF37]/10 border-[#D4AF37]/20",
    },
    {
      label: "Restaurants",
      value: compact(restaurants.total),
      detail: `${restaurants.active} active · ${restaurants.organizationsWithoutRestaurant} client${
        restaurants.organizationsWithoutRestaurant === 1 ? "" : "s"
      } with none`,
      icon: Store,
      accent: "text-[#00F2FE]",
      accentBg: "bg-[#00F2FE]/10 border-[#00F2FE]/20",
    },
    {
      label: "Platform users",
      value: compact(users.total),
      detail: `+${compact(users.newLast30Days)} in the last 30 days`,
      icon: Activity,
      accent: "text-gray-300",
      accentBg: "bg-white/5 border-white/10",
    },
    {
      label: "Client admins",
      value: compact(admins.total),
      detail: admins.inactive > 0 ? `${admins.inactive} suspended` : "All active",
      icon: UserCog,
      accent: "text-gray-300",
      accentBg: "bg-white/5 border-white/10",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative overflow-hidden rounded-3xl p-6 md:p-10 border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#00F2FE] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-[#D4AF37] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            Platform Overview
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
            Monitor client onboarding, tenant growth and platform activity across the Tavonza network.
          </p>
        </div>

        <Link
          href="/organizations"
          className="relative z-10 shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 transition-colors"
        >
          View all clients
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all duration-300 group"
          >
            <div className={`w-fit p-3 rounded-2xl border ${tile.accentBg} mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <tile.icon className={`w-5 h-5 ${tile.accent}`} />
            </div>
            <h3 className="text-4xl font-bold mb-1 tracking-tight text-white">{tile.value}</h3>
            <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wider">
              {tile.label}
            </p>
            <p className="text-xs text-gray-500 mt-3 leading-snug">{tile.detail}</p>
          </div>
        ))}
      </div>

      <GrowthChart series={growth.series} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Onboarding health */}
        <div className="bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <h2 className="text-lg font-bold text-white tracking-tight mb-1">Onboarding health</h2>
          <p className="text-sm text-gray-500 mb-8">
            How many clients have stood up a live branch.
          </p>

          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">{onboarding.completionRate}%</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Live</span>
          </div>
          <div className="h-2 rounded-full bg-[#D4AF37]/15 overflow-hidden mb-8">
            <div
              className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, onboarding.completionRate))}%` }}
            />
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-400 flex items-center gap-2.5">
                <Store className="w-4 h-4 text-gray-500 shrink-0" />
                No restaurant yet
              </span>
              <span className="text-gray-200 font-semibold tabular-nums">
                {onboarding.adminsWithoutRestaurant}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-400 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-gray-500 shrink-0" />
                No branch yet
              </span>
              <span className="text-gray-200 font-semibold tabular-nums">
                {onboarding.adminsWithoutBranch}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5">
              <span className="text-gray-400 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gray-500 shrink-0" />
                Audit events (24h)
              </span>
              <span className="text-gray-200 font-semibold tabular-nums">
                {activity.auditEventsLast24h}
              </span>
            </div>
          </div>
        </div>

        {/* Recent events */}
        <div className="lg:col-span-2 bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              Recent platform events
            </h2>
            <Link
              href="/audit-logs"
              className="text-xs font-semibold text-[#D4AF37] hover:text-[#C4A45D] transition-colors shrink-0"
            >
              View all
            </Link>
          </div>

          <div className="space-y-1">
            {events.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No platform events recorded yet.
              </p>
            ) : (
              events.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 py-3.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] -mx-4 px-4 rounded-xl transition-colors"
                >
                  <span className="text-xs text-gray-500 sm:w-24 shrink-0 uppercase tracking-wider">
                    {log.time}
                  </span>
                  <span
                    className={`w-fit px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-lg border ${
                      log.type === "info"
                        ? "bg-[#00F2FE]/10 text-[#00F2FE] border-[#00F2FE]/20"
                        : log.type === "warning"
                          ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20"
                          : log.type === "success"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-white/5 text-gray-400 border-white/10"
                    }`}
                  >
                    {log.type}
                  </span>
                  <span className="text-gray-300 text-sm md:text-base font-medium">{log.event}</span>
                  <span className="text-xs text-gray-500 sm:ml-auto shrink-0">{log.detail}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
