// components/favorites-grid.tsx
"use client";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { FavoriteButton } from "@/components/favorite-button";
import Link from "next/link";
import { useState } from "react";

interface House {
  houseId: number;
  title: string;
  monthlyRent: number;
  numberOfRooms: number;
  numberOfBathrooms: number;
  isAvailable: boolean;
  isFavorite: boolean;
  regionId: number;
  region: {
    regionId: number;
    regionName: string;
    area: number | null;
    city: string;
    country: string;
    street: string | null;
    postalCode: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  images: Array<{
    houseId: number;
    imageId: number;
    imageUrl: Uint8Array;
  }>;
}

interface FavoritesGridProps {
  initialHouses: House[];
}

export function FavoritesGrid({ initialHouses }: FavoritesGridProps) {
  const [houses, setHouses] = useState(initialHouses);

  const handleUnfavorite = (houseId: number) => {
    // Immediately remove from UI
    setHouses(prev => prev.filter(house => house.houseId !== houseId));
  };

  return (
    <main className="p-4 md:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      {houses.length === 0 ? (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          No favorite houses yet.
        </div>
      ) : (
        houses.map((house) => (
          <div 
            key={house.houseId} 
            className="group relative animate-in fade-in-50 duration-300"
          >
            <FavoriteButton 
              houseId={house.houseId} 
              isDefaultFavorite={true}
              onUnfavorite={handleUnfavorite}
            />
            <Link
              href={`/main/house/${house.houseId}`}
              className="hover:shadow-md transition-shadow duration-200 hover:translate-y-[-2px] block h-full"
            >
              <div className="w-full overflow-hidden">
                <img
                  src={
                    house.images[0]?.imageUrl
                      ? `data:image/jpeg;base64,${Buffer.from(house.images[0].imageUrl).toString("base64")}`
                      : '/placeholder-house.jpg'
                  }
                  alt={house.title}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2 flex-grow border rounded-b-lg shadow-sm bg-background">
                <CardTitle className="text-sm font-semibold line-clamp-1">{house.title}</CardTitle>
                <CardDescription className="text-xs mt-1 line-clamp-1">
                  {`${house.region.city}, ${house.region.country}`}
                </CardDescription>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {house.monthlyRent.toLocaleString()}dt / month
                </div>
                <ul className="mt-1 text-xs text-muted-foreground space-y-0.5">
                  <li className="flex items-center gap-1">
                    <span>{`${house.numberOfRooms} Beds`}</span>
                    <span>•</span>
                    <span>{`${house.numberOfBathrooms} Bath`}</span>
                  </li>
                  <li className={`flex items-center ${house.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${house.isAvailable ? 'bg-green-600' : 'bg-red-600'} mr-1`}></span>
                    {house.isAvailable ? 'Available' : 'Taken'}
                  </li>
                </ul>
              </div>
            </Link>
          </div>
        ))
      )}
    </main>
  );
}