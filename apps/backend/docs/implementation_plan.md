# Complete Admin API Surface — Implementation Plan

## Goal

Build every Admin-facing REST endpoint (14 modules) against the finalized `schema.prisma` (MongoDB), with Swagger docs and full test coverage. Each module follows Steps A–E (DTOs → Controller+Swagger → Service → Unit tests → E2E tests) in dependency order.

---

## User Review Required

> [!IMPORTANT]
> **Missing task doc**: The referenced `docs/admin-operations-order-flow.md` does not exist in the repo. Only 3 requirement docs exist under `docs/`. The schema will be treated as the sole specification per the prompt's own priority rule ("where schema disagrees, schema wins"). If you have this file elsewhere, please share it.

> [!WARNING]
> **Missing dev dependencies**: `mongodb-memory-server`, `@faker-js/faker` are **not installed**. They must be added before E2E tests can run. I will install them in Phase 1.

---

## Open Questions

> [!IMPORTANT]
> **Q1 — Permission guard architecture**: The existing `RolesGuard` checks only `GlobalRole` (SUPER_ADMIN, ADMIN, etc.). The new Staff & Permissions module requires checking `PermissionAction` grants on `StaffAssignment` (per-branch, per-staff). This needs a **new `PermissionsGuard`** and a `@Permissions()` decorator that reads the staff's assignment for the target branch. **Proposed approach**: Create a `PermissionsGuard` that extracts `branchId` from route params and looks up the caller's `StaffAssignment.permissions[]` for that branch. The existing `RolesGuard` stays for platform-level routes (SUPER_ADMIN/ADMIN). Confirm this is acceptable.

> [!IMPORTANT]
> **Q2 — Order number generation**: `Order.orderNumber` is `@unique` and described as "human-readable, e.g. per-branch daily sequence". **Proposed**: format `{branchId-short}-{YYMMDD}-{sequence}`, with sequence derived from a counter or `count+1` within a transaction. Confirm or specify preferred format.

> [!IMPORTANT]
> **Q3 — Audit log scope**: The spec says "every module that performs a sensitive action must call into audit log." Should audit logging be **synchronous** (in the same transaction) or **async** (event-emitter fire-and-forget)? Synchronous is safer for compliance but adds latency. **Proposed**: Use NestJS `EventEmitter` (already installed) for async audit log writes — fast and decoupled, with the trade-off that a crash between the action and the event could lose the log entry.

---

## Phase 1 — Tooling Setup

### Install missing dependencies

```bash
pnpm add -D mongodb-memory-server @faker-js/faker
```

### Swagger — already configured ✅

- `DocumentBuilder` + `SwaggerModule.setup('/api/docs')` in [main.ts](file:///home/euhan/projects/milky.server/src/main.ts#L72-L99)
- Bearer auth via `addBearerAuth('JWT-auth')`
- All new controllers will use `@ApiBearerAuth('JWT-auth')`

### E2E test infrastructure

#### [NEW] `test/setup/test-db.ts`
- `MongoMemoryReplSet` (not standalone) for real transaction support
- Exports `setupTestDb()` / `teardownTestDb()` helpers
- Generates a Prisma client connected to the replica set

#### [MODIFY] `test/jest-e2e.json`
- Add `moduleNameMapper` for `@/` path alias (matches `tsconfig.json`)
- Add `globalSetup` / `globalTeardown` pointing to the replica set lifecycle

### New shared infrastructure files

#### [NEW] `src/modules/permissions/permissions.guard.ts`
- Checks `PermissionAction[]` from `StaffAssignment` for the request's `branchId`
- Falls through if caller is ADMIN/SUPER_ADMIN/RESTAURANT_OWNER (they bypass branch-level permissions)

#### [NEW] `src/modules/permissions/permissions.decorator.ts`
- `@Permissions(...actions: PermissionAction[])` metadata decorator

#### [NEW] `src/modules/audit-log/audit-log.service.ts`
- `log(params: { actorId, branchId?, action, entityType, entityId, metadata? })` — writes to `AuditLog`
- Called via `EventEmitter` pattern: services emit `'audit.log'` events, this service listens

#### [NEW] `src/modules/audit-log/audit-log.module.ts`
- Global module, exported so all other modules can inject or emit to it

---

## Phase 2 — Module Build Order

Each module gets: DTOs (Step A) → Controller+Swagger (Step B) → Service (Step C) → Unit tests (Step D) → E2E tests (Step E).

All files go under `src/modules/<module-name>/` following the existing pattern: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.constant.ts`, `dto/*.dto.ts`.

---

### Module 1: Organization & Restaurant

**Models**: `Organization`, `Restaurant`
**Dependencies**: None

#### Endpoints

| Method | Path | Summary |
|--------|------|---------|
| POST | `/organizations` | Create organization (SUPER_ADMIN) |
| GET | `/organizations` | List organizations |
| GET | `/organizations/:id` | Get organization details |
| PATCH | `/organizations/:id` | Update organization |
| DELETE | `/organizations/:id` | Delete organization (fail if has restaurants) |
| POST | `/organizations/:orgId/restaurants` | Create restaurant |
| GET | `/restaurants` | List restaurants (filter: orgId) |
| GET | `/restaurants/:id` | Get restaurant with branches |
| PATCH | `/restaurants/:id` | Update restaurant |
| DELETE | `/restaurants/:id` | Delete restaurant (fail if has branches) |

#### Key business rules
- Enforce strict hierarchy: Organizations own Restaurants.
- Prevent deletion of Organizations that have active Restaurants.
- Prevent deletion of Restaurants that have active Branches.

---

### Module 2: Branch

**Models**: `Branch`
**Dependencies**: Organization & Restaurant (Module 1)

#### Endpoints

| Method | Path | Summary |
|--------|------|---------|
| POST | `/restaurants/:restId/branches` | Create branch |
| GET | `/branches` | List branches (filter: restaurantId, isActive) |
| GET | `/branches/:id` | Get branch details |
| PATCH | `/branches/:id` | Update branch |
| DELETE | `/branches/:id` | Delete branch (fail if has active tables/orders) |

#### Key business rules
- Branch creation requires a valid `restaurantId`.
- Branch deletion blocked if there are ongoing operational dependencies (e.g., active orders, seated tables).

---

### Module 3: Menu

**Models**: `MenuCategory`, `MenuItem`, `ModifierGroup`, `Modifier`
**Dependencies**: Restaurant (Module 1)

#### Endpoints

| Method | Path | Summary |
|--------|------|---------|
| POST | `/menu-categories` | Create category |
| GET | `/menu-categories` | List categories (by restaurantId, paginated) |
| GET | `/menu-categories/:id` | Get category |
| PATCH | `/menu-categories/:id` | Update category |
| DELETE | `/menu-categories/:id` | Delete category (fail if has items) |
| POST | `/menu-items` | Create item (with modifierGroups inline) |
| GET | `/menu-items` | List items (filter: restaurantId, categoryId, isAvailable) |
| GET | `/menu-items/:id` | Get item with modifiers |
| PATCH | `/menu-items/:id` | Update item |
| PATCH | `/menu-items/:id/availability` | Toggle isAvailable |
| DELETE | `/menu-items/:id` | Soft-delete or hard-delete |
| POST | `/menu-items/:id/modifier-groups` | Add modifier group |
| PATCH | `/modifier-groups/:id` | Update modifier group |
| DELETE | `/modifier-groups/:id` | Delete modifier group |
| POST | `/modifier-groups/:id/modifiers` | Add modifier |
| PATCH | `/modifiers/:id` | Update modifier |
| DELETE | `/modifiers/:id` | Delete modifier |

#### Key business rules
- `displayOrder` for category/item sorting
- MenuItem scoped to `restaurantId` + `categoryId` — validate both exist
- ModifierGroup: validate `minSelect <= maxSelect`

---

### Module 4: Staff & Permissions + Audit Log

**Models**: `Staff`, `StaffAssignment`, `Admin`, `Owner`, `AuditLog`
**Dependencies**: Branch (Module 2) (Audit Log built alongside)

#### Staff/Assignment Endpoints

| Method | Path | Summary |
|--------|------|---------|
| POST | `/staff` | Create staff user (creates User + Staff) |
| GET | `/staff` | List staff (paginated, filterable) |
| GET | `/staff/:id` | Get staff with assignments |
| PATCH | `/staff/:id` | Update staff profile |
| DELETE | `/staff/:id` | Remove staff |
| POST | `/staff-assignments` | Assign staff to branch with role |
| GET | `/staff-assignments` | List assignments (filter: branchId, staffId) |
| PATCH | `/staff-assignments/:id` | Update role/isActive |
| PATCH | `/staff-assignments/:id/permissions` | Grant/revoke PermissionAction[] |
| DELETE | `/staff-assignments/:id` | Remove assignment |

#### Key business rules
- `StaffAssignment` is `@@unique([staffId, branchId])` — 409 on duplicate
- Permissions are per-assignment, NOT per-role. Grant/revoke endpoint accepts `{ grant: PermissionAction[], revoke: PermissionAction[] }` and patches the array
- All permission changes emit audit log events
- Owner CRUD for restaurant owners (simpler, similar pattern)

#### Audit Log Endpoints

| Method | Path | Summary |
|--------|------|---------|
| GET | `/audit-logs` | Query audit logs (filter: branchId, actorId, entityType, action, date range) |
| GET | `/audit-logs/:id` | Get single audit log entry |

- **No standalone write endpoint** — only the internal `AuditLogService.log()` method
- Every subsequent module calls `AuditLogService` for sensitive actions

---

### Module 5: Branch Settings

**Model**: `BranchSetting` (1:1 with Branch, `branchId @unique`)
**Dependencies**: Branch (Module 2)

#### Endpoints

| Method | Path | Summary |
|--------|------|---------|
| GET | `/branches/:branchId/settings` | Get branch settings |
| PUT | `/branches/:branchId/settings` | Upsert branch settings |

#### Key business rules
- Single document per branch — the PUT is an **upsert** against `branchId @unique`
- `requireOtpPerGuest` defaults `true` — Q49 is resolved: each guest authenticates independently via their own OTP. The `false` branch keeps the field and conditional structure but has no working functionality for MVP
- `orderAcceptanceMode` defaults `WAITER_APPROVAL`
- All fields from the schema: `orderAcceptanceMode`, `backupAccepterRoles`, `hideUnavailableItems`, `allowMultipleGuestSessions`, `requireOtpPerGuest`, `allowSplitBill`, `allowGuestCheckoutWithoutAccount`, `autoCloseIdleSessionMins`, `currency`, `taxPercent`, `serviceChargePct`, `tipEnabled`, `reservationsEnabled`, `waitlistEnabled`

---

### Module 6: Tables & Reservations

**Models**: `Table`, `Reservation`, `WaiterTableAssignment`
**Dependencies**: Branch (Module 2), Menu (display only), Staff (for waiter assignments)

#### Table Endpoints

| Method | Path | Summary |
|--------|------|---------|
| POST | `/tables` | Create table |
| GET | `/tables` | List tables (filter: branchId, serviceStatus, operationalFlag, floor) |
| GET | `/tables/:id` | Get table with current session info |
| PATCH | `/tables/:id` | Update table (label, capacity, shape, floor) |
| PATCH | `/tables/:id/status` | Update serviceStatus / operationalFlag |
| DELETE | `/tables/:id` | Delete table (fail if has active session) |

#### Reservation Endpoints

| Method | Path | Summary |
|--------|------|---------|
| POST | `/reservations` | Create reservation |
| GET | `/reservations` | List (filter: branchId, status, date range, tableId) |
| GET | `/reservations/:id` | Get reservation |
| PATCH | `/reservations/:id` | Update reservation |
| PATCH | `/reservations/:id/status` | Change status (CONFIRM, SEAT, COMPLETE, CANCEL, NO_SHOW) |
| DELETE | `/reservations/:id` | Cancel/delete reservation |

#### Waiter Assignment Endpoints

| Method | Path | Summary |
|--------|------|---------|
| POST | `/waiter-assignments` | Create assignment (validate no overlapping sessions) |
| GET | `/waiter-assignments` | List (filter: branchId, waiterId, tableId, date) |
| PATCH | `/waiter-assignments/:id` | Update (reschedule, revoke via isActive=false) |
| DELETE | `/waiter-assignments/:id` | Remove assignment |

#### Key business rules
- Waiter session overlap validation: no two active assignments for the same table with overlapping `[sessionStart, sessionEnd]`
- Table deletion blocked if `tableSessions` has any ACTIVE session
- Reservation status machine: PENDING→CONFIRMED→SEATED→COMPLETED, PENDING→CANCELLED, CONFIRMED→NO_SHOW

---

### Module 7: Table Sessions & Guest Sessions

**Models**: `TableSession`, `GuestSession`, `TableAuthOtp`
**Dependencies**: Tables (Module 6), Branch Settings (Module 5)

#### Endpoints

| Method | Path | Summary |
|--------|------|---------|
| POST | `/table-sessions/request-otp` | Request OTP for table (new or join) |
| POST | `/table-sessions/verify-otp` | Verify OTP → create/join session |
| GET | `/table-sessions` | List sessions (filter: branchId, tableId, status) |
| GET | `/table-sessions/:id` | Get session with guests, orders |
| PATCH | `/table-sessions/:id/close` | Close table session |
| GET | `/table-sessions/:id/guests` | List guest sessions |
| PATCH | `/guest-sessions/:id/status` | Update guest status (LEFT, CLOSED) |

#### Key business rules (Step F specifics)

**Opening a session** (`TableAuthOtp.tableSessionId` is null):
1. Verify OTP
2. Create `TableSession` (status: ACTIVE) + first `GuestSession` (isHostGuest: true)
3. Set `Table.serviceStatus` → OCCUPIED
4. Enforce: only ONE active `TableSession` per table (409 if exists)

**Joining a session** (`TableAuthOtp.tableSessionId` is populated):
1. Verify OTP
2. Create new `GuestSession` under existing `TableSession` (isHostGuest: false)
3. Do NOT create second `TableSession`

**Join-eligibility check** (before creating join-type OTP):
- If table has ACTIVE `TableSession`: check if `GuestSession` count < `TableSession.partySize` (when partySize is set), else eligible by default
- If ineligible: return named error `TABLE_SESSION_FULL` (not generic 4xx)
- **This is a placeholder for an unspecified policy** — the capacity-based default

**Closing a table session**:
- Only permitted when: ALL `GuestSession` statuses are CLOSED or LEFT, AND all `Order` `OrderItem`s are in terminal status
- Do NOT build force-close/override path (policy question still open)
- Set `Table.serviceStatus` → AVAILABLE, `TableSession.status` → COMPLETED

**Q49 resolution**: Update the stale comment on `GuestSession.otpVerifiedAt` to state Q49 is resolved (per-guest OTP is the confirmed path)

---

### Module 8: Orders

**Models**: `Order`, `OrderItem`, `OrderStatusChangeLog`, `OrderItemStatusChangeLog`
**Dependencies**: Menu (3), Table/Guest Sessions (7), Branch Settings (5)

#### Endpoints

| Method | Path | Summary |
|--------|------|---------|
| POST | `/orders` | Create order |
| GET | `/orders` | List orders (filter: branchId, tableId, status, channel, date range) |
| GET | `/orders/:id` | Get order with items |
| PATCH | `/orders/:id/accept` | Accept order (waiter/manager/admin) |
| PATCH | `/orders/:id/reject` | Reject order (with reason code + note) |
| PATCH | `/orders/:id/status` | Update order status |
| PATCH | `/orders/:id/cancel` | Cancel order |
| POST | `/orders/:id/items` | Add items to existing order |
| PATCH | `/order-items/:id/status` | Update item status |
| GET | `/orders/:id/status-log` | Get status change history |

#### Key business rules
- **`Order.acceptanceMode` is a snapshot** — copy `BranchSetting.orderAcceptanceMode` at creation time onto the order. Never read BranchSetting after creation for acceptance behavior
- Generate unique `orderNumber` per transaction
- `OrderItem` stores `productNameSnapshot`, `unitPrice`, `subtotal` from MenuItem at order time
- `OrderItem.stationType` denormalized from MenuItem's station type
- Status change logs: every status transition creates `OrderStatusChangeLog` / `OrderItemStatusChangeLog`
- Cancellation authority staged by role (Customer before acceptance, Waiter before prep, Manager/Admin override)
- Rejection: populate `rejectionReasonCode` + optional `rejectionReason`, link resubmissions via `resubmittedFromId`
- Audit log: order cancellation, rejection, discount application

---

### Module 9: Payments & Allocations

**Models**: `Payment`, `PaymentAllocation`
**Dependencies**: Orders (8), Guest Sessions (7)

#### Endpoints

| Method | Path | Summary |
|--------|------|---------|
| POST | `/payments` | Create payment (with allocations, in transaction) |
| GET | `/payments` | List payments (filter: orderId, tableSessionId, status) |
| GET | `/payments/:id` | Get payment with allocations |
| POST | `/payments/:id/refund` | Process refund |

#### Key business rules (Step G specifics)

**Transaction + sum check**: Every Payment creation runs in a transaction with its PaymentAllocation rows. Before commit: `sum(allocations.amount) === payment.amount`. Roll back if mismatch.

**Four scopes** — each is a distinct code path with its own E2E test:

| Scope | Behavior |
|-------|----------|
| `ORDER` | Settle one order in full — one allocation, no split |
| `ORDER_ITEMS` | Settle specific items — one allocation per item, sum = sum of item subtotals |
| `GUEST_SESSION` | Settle everything one guest ordered — payer can differ from payee |
| `TABLE_SESSION` | Settle every open GuestSession — `paidForGuestIds` contains all guests |

- Update `Order.paymentStatus` and `Order.amountPaid` after payment
- Payment method values from existing `PaymentMethod` enum only (CASH, CARD, MOBILE_WALLET, ONLINE_GATEWAY)
- Audit log: refunds, payment creation

---

### Module 10: POS

**Dependencies**: Orders (8), Payments (9)

#### Endpoints

| Method | Path | Summary |
|--------|------|---------|
| GET | `/pos/active-orders` | Orders needing POS attention (SERVED + UNPAID) |
| POST | `/pos/settle` | Quick-settle from POS (wraps Payment creation) |
| GET | `/pos/shift-summary` | Current shift revenue/transaction summary |

- Thin orchestration layer over Orders + Payments services
- No new models — uses existing Order, Payment

---

### Module 11: QR Ordering Config

**Dependencies**: Tables (6), Branch Settings (5)

#### Endpoints

| Method | Path | Summary |
|--------|------|---------|
| POST | `/tables/:id/qr-code` | Generate/regenerate `qrCodeToken` |
| GET | `/tables/:id/qr-code` | Get current QR code data |
| PATCH | `/branches/:branchId/qr-settings` | Toggle self-order settings |

- `Table.qrCodeToken` is `@unique` — generate UUID or crypto-random token
- QR encodes table + branch context for the frontend

---

### Module 12: Kitchen/Bar Display

**Dependencies**: Orders (8)

#### Endpoints

| Method | Path | Summary |
|--------|------|---------|
| GET | `/kitchen-display` | Get pending/preparing items (stationType=KITCHEN) |
| GET | `/bar-display` | Get pending/preparing items (stationType=BAR) |
| PATCH | `/display-items/:id/status` | Mark item preparing/ready/unavailable |

- Read-mostly, filtered by `OrderItem.stationType` + status
- Grouped by order, with time-in-queue indicators
- Real-time updates via WebSocket are out of scope for this pass (REST only)

---

### Module 13: Dashboard

**Dependencies**: All above modules

#### Endpoints

| Method | Path | Summary |
|--------|------|---------|
| GET | `/dashboard/overview` | KPIs: total orders, revenue, avg order value, active tables |
| GET | `/dashboard/orders-by-status` | Order count grouped by status |
| GET | `/dashboard/revenue-by-day` | Daily revenue for date range |
| GET | `/dashboard/top-items` | Most ordered menu items |
| GET | `/dashboard/staff-performance` | Orders served per waiter |
| GET | `/dashboard/table-utilization` | Table occupancy rates |

- All scoped to `branchId` (with optional cross-branch for ADMIN)
- Aggregate queries using Prisma `groupBy` / `aggregate`
- No new models

---

### Module 14: Audit Log (read endpoint)

Built alongside Module 4 (service + listener), but the read endpoint is listed here for completeness.

- `GET /audit-logs` — paginated, filterable query
- Every module above emits audit events for sensitive actions

---

## Cross-Cutting Concerns

### Audit log integration per module

| Module | Auditable Actions |
|--------|------------------|
| Organization & Restaurant | Org/Restaurant created/updated/deleted |
| Branch | Branch created/updated/deleted |
| Menu | Item created/updated/deleted, availability toggled |
| Staff | Staff created/deleted, assignment changed, permissions granted/revoked |
| Branch Settings | Settings updated |
| Tables | Table created/deleted, status changed, reassignment |
| Table Sessions | Session opened/closed |
| Orders | Order accepted/rejected/cancelled, discount applied, status changed |
| Payments | Payment created, refund processed |
| POS | Settle action |

### AppModule registration

Each new module will be imported into [app.module.ts](file:///home/euhan/projects/milky.server/src/app/app.module.ts). The `PermissionsGuard` will be added as a global guard alongside the existing `AuthGuard` and `RolesGuard`.

### Schema comment updates

- `GuestSession.otpVerifiedAt` comment: update from "open question Q49" → "Q49 resolved: per-guest OTP is the confirmed path. requireOtpPerGuest defaults true."
- Any schema-vs-task-doc discrepancies noted in code comments

---

## File Count Estimate

| Category | Estimated Files |
|----------|----------------|
| Module source files (14 modules × ~5 files) | ~70 |
| DTO files (14 modules × ~3 DTOs) | ~42 |
| Unit test files | ~14 |
| E2E test files | ~14 |
| Shared infrastructure (guards, audit, test setup) | ~8 |
| **Total** | **~148 files** |

---

## Verification Plan

### Automated Tests

1. **Unit tests**: `pnpm test` — mock PrismaClient, cover success + every business rule failure
2. **E2E tests**: `pnpm test:e2e` — supertest against MongoMemoryReplSet, seeded with `@faker-js/faker`
3. **Build check**: `pnpm build` — ensure no TypeScript errors
4. **Per-module test run**: Each module's tests run individually before marking done

### Key E2E test scenarios

- Table Session: open → join → join-full-error → close
- Payment: one E2E per scope (ORDER, ORDER_ITEMS, GUEST_SESSION, TABLE_SESSION)
- Payment allocation sum invariant: test that mismatched sum is rejected
- Order acceptance mode snapshot: create order, change branch setting, verify order retains original mode

### Manual Verification

- Swagger UI at `/api/docs` — confirm all tags, operations, response codes visible
- Each module's Swagger tag confirmed present

---

## What is NOT in scope

- Force-close/override for TableSession (policy question open)
- "Accepting new guests" beyond capacity-based default
- JARVIS, Analytics/BI beyond basic Dashboard KPIs
- Finance, Loyalty, Marketing, Documents, Marketplace, Tavonza Card
- Alternative API documentation tools
- WebSocket real-time updates (REST only this pass)
