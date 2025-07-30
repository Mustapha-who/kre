"use client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still redirect even if API call fails
      router.push("/login");
    }
  };

  return (
    <button onClick={handleLogout} className="cursor-pointer w-full text-left">
      Log out
    </button>
  );
}
