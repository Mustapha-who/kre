"use client";
import React from "react";
import { useRouter } from "next/navigation";

export function SettingsButtonAdmin({ children }: { children?: React.ReactNode }) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/settings-admin");
  };

  return (
    <div
      className="w-full text-left cursor-pointer flex items-center gap-2"
      onClick={handleClick}
    >
      {children || "Settings"}
    </div>
  );
}
