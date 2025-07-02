"use client";
import { useRouter } from "next/navigation";
export function SettingsButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="w-full text-left cursor-pointer"
      onClick={() => router.push("/settings")}
    >
      Settings
    </button>
  );
}
