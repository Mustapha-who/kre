"use client";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface FavoriteButtonProps {
  houseId: number;
  isDefaultFavorite?: boolean;
  onUnfavorite?: (houseId: number) => void;
}

export function FavoriteButton({ 
  houseId, 
  isDefaultFavorite = false, 
  onUnfavorite 
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(isDefaultFavorite);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    setIsFavorite(isDefaultFavorite);
  }, [isDefaultFavorite]);

  const toggleFavorite = async () => {
    if (isLoading) return;
    
    const newFavorite = !isFavorite;
    setIsLoading(true);
    
    // For unfavoriting on favorites page
    if (!newFavorite && onUnfavorite) {
      onUnfavorite(houseId);
    }
    
    setIsFavorite(newFavorite);
    
    try {
      const res = await fetch("/api/favorite", {
        method: newFavorite ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ houseId }),
        credentials: "include",
      });
      
      if (!res.ok) {
        // Revert if failed
        setIsFavorite(!newFavorite);
      }
    } catch {
      setIsFavorite(!newFavorite);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/90 hover:bg-white disabled:opacity-50"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite();
      }}
      disabled={isLoading}
    >
      <Heart 
        className={`h-4 w-4 transition-colors ${
          isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
        }`} 
      />
      <span className="sr-only">
        {isFavorite ? "Remove from favorites" : "Add to favorites"}
      </span>
    </Button>
  );
}