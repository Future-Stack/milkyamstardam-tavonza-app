import { apiGet } from "./api";
import type { Admin, AnalyticsOverview, AuditLog, GrowthResponse, Meta, Organization } from "./types";

export interface ListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  entityType?: string;
}

/**
 * Read helpers shared by the admin pages.
 *
 * Rows are keyed by the **admin** id throughout: `GET /organizations` returns
 * only `{id, name, slug, ownerId}`, so it cannot fill the client list's "Admin
 * Owner" column. `GET /admins` returns the admin *with* their owned
 * organizations, which covers both columns in one call.
 */
export async function listClients(
  params: ListParams = {},
): Promise<{ admins: Admin[]; meta: Meta | null }> {
  const { data, meta } = await apiGet<Admin[]>("/admins", {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    searchTerm: params.searchTerm,
    sort: "-createdAt",
  });

  return { admins: data ?? [], meta };
}

export async function getClient(adminId: string): Promise<Admin | null> {
  const { data } = await apiGet<Admin>(`/admins/${adminId}`);
  return data ?? null;
}

/** Total organizations on the platform — `limit: 1` because only `meta.total` is used. */
export async function countOrganizations(): Promise<number> {
  const { meta } = await apiGet<Organization[]>("/organizations", { page: 1, limit: 1 });
  return meta?.total ?? 0;
}

export async function listAuditLogs(
  params: ListParams = {},
): Promise<{ logs: AuditLog[]; meta: Meta | null }> {
  const { data, meta } = await apiGet<AuditLog[]>("/audit-logs", {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    entityType: params.entityType,
    searchTerm: params.searchTerm,
    sort: "-createdAt",
  });

  return { logs: data ?? [], meta };
}

/** `GET /analytics/overview` — platform KPIs for the super admin dashboard. */
export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const { data } = await apiGet<AnalyticsOverview>("/analytics/overview");
  return data;
}

/** `GET /analytics/growth` — zero-filled daily series of new clients and admins. */
export async function getGrowth(days = 30): Promise<GrowthResponse> {
  const { data } = await apiGet<GrowthResponse>("/analytics/growth", { days });
  return data;
}
