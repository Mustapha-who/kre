"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface UserInfo {
  isHouseOwner: boolean;
  ownerId?: number;
}

export function AddMoreHouses() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoreHouses = () => {
    if (userInfo?.ownerId) {
      router.push(`/my-houses/${userInfo.ownerId}`);
    }
  };

  // Don't render anything while loading or if user is not a house owner
  if (loading || !userInfo?.isHouseOwner) {
    return null;
  }

  return (
    <>
      <DropdownMenuItem>
        <button
          onClick={handleAddMoreHouses}
          className="w-full text-left cursor-pointer"
        >
          Add More Houses
        </button>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
    </>
  );
}
