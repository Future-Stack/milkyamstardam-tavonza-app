# Frontend Developer Scope Constraint

- The user is a **Frontend Developer**.
- **STRICT RULE**: NEVER modify files in `apps/backend` (NestJS source code, Prisma schema, DBML, migrations, controllers, services, etc.).
- Use `apps/backend/prisma/schema.prisma` or `apps/backend/prisma/dbml/schema.dbml` strictly for **read-only reference** to inspect data types, models, and API schemas.
- All edits, new features, UI components, and code changes MUST be done strictly within frontend applications:
  - `apps/web/`
  - `apps/customer/`
  - `packages/ui/`
