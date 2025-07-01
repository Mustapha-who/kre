"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function SettingsUserInfo() {
  const [user, setUser] = useState<{ email: string; firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    }
    fetchUser();
  }, []);

  if (!user) {
    return <p className="text-muted-foreground">Loading user info...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2">
          <span className="font-semibold">Email:</span> {user.email}
        </div>
        <div className="mb-2">
          <span className="font-semibold">First Name:</span> {user.firstName}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Last Name:</span> {user.lastName}
        </div>
      </div>
      <Button variant="outline" className="mt-4" disabled>
        Reset my password
      </Button>
    </div>
  );
}
