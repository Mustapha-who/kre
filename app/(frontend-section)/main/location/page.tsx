import { CardTitle, CardDescription } from "@/components/ui/card";
import { getHousesByLocation } from "@/services/houseService";
import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface SearchParams {
  country?: string;
  city?: string;
}

interface LocationPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function LocationPage({ searchParams }: LocationPageProps) {
  const { country, city } = await searchParams;

  if (!country || !city) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-center py-10 text-muted-foreground">
          Invalid location parameters
        </div>
      </div>
    );
  }

  const houses = await getHousesByLocation(country, city);

  return (
    <main className="p-4 md:p-6">
      {/* Back button and header */}
      <div className="mb-6">
        <Link href="/main">
          <Button variant="ghost" size="sm" className="cursor-pointer mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Locations
          </Button>
        </Link>
        <div className="border-l-4 border-primary pl-4">
          <h1 className="text-2xl font-bold text-foreground">{country} – {city}</h1>
          <p className="text-sm text-muted-foreground">{houses.length} properties available</p>
        </div>
      </div>

      {/* Houses Grid */}
      {houses.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No houses found in this location
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {houses.map((house) => (
            <div key={house.houseId} className="group relative">
              <FavoriteButton houseId={house.houseId} isDefaultFavorite={!!house.isDefaultFavorite} />
              
              <Link
                href={`/main/house/${house.houseId}`}
                className="hover:shadow-md transition-shadow duration-200 hover:translate-y-[-2px] block h-full"
              >
                <div className="w-full overflow-hidden">
                  <img 
                    src={
                      house.images[0]?.imageUrl
                        ? typeof house.images[0].imageUrl === "string"
                          ? house.images[0].imageUrl
                          : `data:image/jpeg;base64,${Buffer.from(house.images[0].imageUrl).toString("base64")}`
                        : '/placeholder-house.jpg'
                    }
                    alt={house.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2 flex-grow border rounded-b-lg shadow-sm bg-background">
                  <CardTitle className="text-sm font-semibold line-clamp-1">{house.title}</CardTitle>
                  <CardDescription className="text-xs mt-1 line-clamp-1">
                    {house.region.regionName && `${house.region.regionName}`}
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
          ))}
        </div>
      )}
    </main>
  );
}
