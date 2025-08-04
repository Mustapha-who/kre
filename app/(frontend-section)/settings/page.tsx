import { SettingsUserInfo } from "@/components/settings-user-info";
import { getUserData } from "@/lib/actions/user-actions";

export default async function SettingsPage() {
  let userData;

  try {
    userData = await getUserData();
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    // Fallback user data
    userData = {
      userId: 1,
      email: "user@example.com",
      firstName: "User",
      lastName: "Name",
      name: "User Name",
      isHouseOwner: false,
      isAdmin: false,
    };
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="bg-white rounded shadow p-6">
        <SettingsUserInfo userData={userData} />
      </div>
    </div>
  );
}
