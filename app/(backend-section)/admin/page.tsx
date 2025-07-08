import { getAllHousesForAdmin } from "@/services/adminHouseService";
import { AdminDashboard } from "@/components/admin-dashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

async function verifyAdminAuth() {
  const cookieStore =  await cookies();
  const token = cookieStore.get("admin-token")?.value;
  
  if (!token) {
    redirect("/login");
  }
  
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { adminId?: number; role?: string };
    if (payload.role !== "admin" || !payload.adminId) {
      redirect("/login");
    }
    return payload.adminId;
  } catch {
    redirect("/login");
  }
}

export default async function AdminPage() {
  await verifyAdminAuth();
  const houses = await getAllHousesForAdmin();

  return <AdminDashboard initialHouses={houses} />;
}
