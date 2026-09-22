import { AdminLayout } from "../components/AdminLayout";

export default function AdminRouteGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
