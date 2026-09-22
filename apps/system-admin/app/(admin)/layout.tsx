import { AdminLayout } from "../components/AdminLayout";
import { requireSuperAdmin } from "../lib/dal";

export default async function AdminRouteGroup({ children }: { children: React.ReactNode }) {
  // The console is SUPER_ADMIN-only. This is the real check — proxy.ts only
  // verifies that a cookie is present.
  const user = await requireSuperAdmin();

  return (
    <AdminLayout user={{ name: user.name, email: user.email, avatar: user.avatar ?? null }}>
      {children}
    </AdminLayout>
  );
}
