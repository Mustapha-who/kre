import { AdminDashboard } from "@/components/backend-components/admin-dashboard";
import { getAllHousesForAdmin } from "@/lib/actions/admin-actions";

export default async function AdminPage() {
  const houses = await getAllHousesForAdmin();
  return <AdminDashboard houses={houses} />;
}
