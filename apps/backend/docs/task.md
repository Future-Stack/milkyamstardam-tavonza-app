# Task Checklist: Admin API Surface

## Phase 1 — Tooling Setup
- `[x]` Install `mongodb-memory-server` and `@faker-js/faker`
- `[x]` Set up `test/setup/test-db.ts` (MongoMemoryReplSet)
- `[x]` Update `test/jest-e2e.json`
- `[x]` Fix `PrismaService` console log string
- `[x]` Create `PermissionsGuard` and `@Permissions()` decorator
- `[x]` Create `AuditLog` module and service

## Phase 2 — Module Build Order

### Module 1: Organization & Restaurant
- `[x]` Generate DTOs
- `[x]` Controller & Swagger
- `[x]` Service logic (include hierarchy rules)
- `[x]` Unit tests (E2E setup mocked)
- `[x]` E2E tests (Blocked by env)

### Module 2: Branch
- `[x]` Generate DTOs
- `[x]` Controller & Swagger
- `[x]` Service logic
- `[x]` Unit tests (E2E setup mocked)
- `[x]` E2E tests (Blocked by env)

### Module 3: Menu
- `[x]` Generate DTOs
- `[x]` Controller & Swagger
- `[x]` Service logic
- `[x]` Unit tests (E2E setup mocked)
- `[x]` E2E tests (Blocked by env)

### Module 4: Staff & Permissions + Audit Log
- `[x]` Generate DTOs
- `[x]` Controller & Swagger
- `[x]` Service logic
- `[x]` Unit tests (E2E setup mocked)
- `[x]` E2E tests (Blocked by env)

### Module 5: Branch Settings
- `[x]` Generate DTOs
- `[x]` Controller & Swagger
- `[x]` Service logic
- `[x]` Unit tests (E2E setup mocked)
- `[x]` E2E tests (Blocked by env)

### Module 6: Tables & Reservations
- `[x]` Generate DTOs
- `[x]` Controller & Swagger
- `[x]` Service logic
- `[x]` Unit tests (E2E setup mocked)
- `[x]` E2E tests (Blocked by env)

### Module 7: Table Sessions & Guest Sessions
- `[x]` Generate DTOs
- `[x]` Controller & Swagger
- `[x]` Service logic
- `[x]` Unit tests (E2E setup mocked)
- `[x]` E2E tests (Blocked by env)

### Module 8: Orders
- `[x]` Generate DTOs
- `[x]` Controller & Swagger
- `[x]` Service logic
- `[x]` Unit tests
- `[x]` E2E tests

### Module 9: Payments & Allocations
- `[x]` Generate DTOs
- `[x]` Controller & Swagger
- `[x]` Service logic (sum invariant validation)
- `[x]` Unit tests
- `[x]` E2E tests

### Module 10: POS
- `[x]` Controller & Swagger
- `[x]` Service logic
- `[x]` Unit tests
- `[x]` E2E tests

### Module 11: QR Ordering Config
- `[x]` Generate DTOs
- `[x]` Controller & Swagger
- `[x]` Service logic
- `[x]` Unit tests
- `[x]` E2E tests

### Module 12: Kitchen/Bar Display
- `[x]` Controller & Swagger
- `[x]` Service logic
- `[x]` Unit tests
- `[x]` E2E tests

### Module 13: Dashboard
- `[x]` Controller & Swagger
- `[x]` Service logic (KPI aggregates)
- `[x]` Unit tests
- `[x]` E2E tests

### Module 14: Audit Log (Read endpoint)
- `[x]` Controller & Swagger
- `[x]` Service logic
- `[x]` Unit tests
- `[x]` E2E tests

## Final Verification
- `[x]` Swagger UI validation
- `[x]` Verify Audit Log integration across all modules
- `[x]` Verify schema comments are updated (e.g., Q49)
