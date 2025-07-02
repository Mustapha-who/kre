"use client";
export function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/login";
  };
  return (
    <button  type="button" className="w-full text-left cursor-pointer" onClick={handleLogout}>
      Logout
    </button>
  );
}
