import { SettingsUserInfo } from "@/components/settings-user-info";
import { getAdminData } from "@/lib/actions/admin-actions";

export default async function AdminSettingsPage() {
  const adminData = await getAdminData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">Admin Settings</h1>
      </div>
      
      <div className="flex justify-center">
        <SettingsUserInfo userData={adminData} />
      </div>
    </div>
  );
}
