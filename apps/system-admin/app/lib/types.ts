export type GlobalRole = "SUPER_ADMIN" | "ADMIN" | "RESTAURANT_OWNER" | "STAFF" | "CUSTOMER";

export type UserStatus = "ACTIVE" | "INACTIVE";

/** Standard pagination envelope the backend returns in `meta`. */
export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

/** Organization as embedded on an admin (`ownedOrganizations` in adminSelect). */
export interface OwnedOrganization {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

/** Mirrors AdminProfileResponseDto from the backend. */
export interface Admin {
  id: string;
  email: string;
  name: string;
  contactNo?: string | null;
  role: GlobalRole;
  status: UserStatus;
  avatar?: string | null;
  ownedOrganizations: OwnedOrganization[];
  admin?: { intro: string } | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * The subset of `GET /auth/get-me` that is safe to render.
 *
 * The endpoint returns the raw Prisma user row, which includes the bcrypt
 * hash on `password`. It is dropped in the DAL and never reaches a component.
 */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: GlobalRole;
  status: UserStatus;
  avatar?: string | null;
  contactNo?: string | null;
  createdAt: string;
}

export interface AuditLogActor {
  id: string;
  name: string;
  role: GlobalRole;
  email: string;
}

export interface AuditLog {
  id: string;
  branchId?: string | null;
  actorId: string;
  actor?: AuditLogActor | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

/** Result shape every server action returns to its form. */
export interface ActionResult {
  success: boolean;
  message: string;
}

/** Mirrors AnalyticsOverviewDto from `GET /analytics/overview`. */
export interface AnalyticsOverview {
  organizations: { total: number; newLast30Days: number };
  restaurants: { total: number; active: number; organizationsWithoutRestaurant: number };
  branches: { total: number; active: number };
  admins: { total: number; active: number; inactive: number; newLast30Days: number };
  users: { total: number; newLast30Days: number; byRole: { role: GlobalRole; count: number }[] };
  onboarding: {
    adminsWithoutRestaurant: number;
    adminsWithoutBranch: number;
    completionRate: number;
  };
  activity: { auditEventsLast24h: number; activeActorsLast24h: number };
}

export interface GrowthPoint {
  date: string;
  organizations: number;
  admins: number;
}

/** Mirrors GrowthResponseDto from `GET /analytics/growth`. */
export interface GrowthResponse {
  days: number;
  series: GrowthPoint[];
  totals: { organizations: number; admins: number; customers: number };
}
