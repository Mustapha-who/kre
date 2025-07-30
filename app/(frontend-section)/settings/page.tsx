import { SettingsUserInfo } from "@/components/settings-user-info";
import { Suspense } from "react";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="bg-white rounded shadow p-6">
        
        <SettingsUserInfo />
        
      </div>
    </div>
  );
}
