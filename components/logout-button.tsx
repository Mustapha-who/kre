"use client";
export function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/login";
  };
  return (
    <button type="button" className="w-full text-left" onClick={handleLogout}>
      Logout
    </button>
  );
}
