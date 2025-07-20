// main/page.tsx
import { Suspense } from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { getHouses, searchHouses } from "@/services/houseService";
import { SearchBar } from "@/components/search-bar";
import Link from "next/link";
import { HouseSubmittedModal } from "@/components/house-submitted-modal";
import { FavoriteButton } from "@/components/favorite-button";

interface SearchParams {
  q?: string | string[];
}

interface MainPageProps {
  searchParams: Promise<SearchParams>;
}

function SearchBarFallback() {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-muted-foreground animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by city, region, country, or postal code..."
          className="w-full pl-10 pr-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent opacity-50 text-foreground placeholder:text-muted-foreground"
          disabled
        />
      </div>
    </div>
  );
}

export default async function MainPage({ 
  searchParams 
}: MainPageProps) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q;
  const searchTerm = q === undefined ? undefined : 
                   Array.isArray(q) ? q[0] : q;
  
  const houses = searchTerm
    ? await searchHouses(searchTerm)
    : await getHouses();

  // Group houses by country and city
  const groupedHouses = houses.reduce((acc, house) => {
    const locationKey = `${house.region.country} – ${house.region.city}`;
    if (!acc[locationKey]) {
      acc[locationKey] = [];
    }
    acc[locationKey].push(house);
    return acc;
  }, {} as Record<string, typeof houses>);

  const PREVIEW_LIMIT = 6;
  const MAX_SECTIONS = 7; // Maximum number of location sections to display

  return (
    <>
      <HouseSubmittedModal />
      <main className="p-4 md:p-6 space-y-8">
        {/* Enhanced Search Bar - Only on main page */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Find Your Perfect Home
            </h1>
            <p className="text-muted-foreground">
              Discover rental properties in your desired location
            </p>
          </div>
          <Suspense fallback={<SearchBarFallback />}>
            <SearchBar />
          </Suspense>
        </div>

        {Object.keys(groupedHouses).length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No houses found for your search criteria
          </div>
        ) : (
          Object.entries(groupedHouses).slice(0, MAX_SECTIONS).map(([location, locationHouses]) => {
            const previewHouses = locationHouses.slice(0, PREVIEW_LIMIT);
            const hasMore = locationHouses.length > PREVIEW_LIMIT;
            const [country, city] = location.split(' – ');

            return (
              <div key={location} className="space-y-4">
                {/* Location Header - now clickable */}
                <div className="border-l-4 border-primary pl-4">
                  <Link 
                    href={`/main/location?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}`}
                    className="hover:text-primary transition-colors group"
                  >
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-primary cursor-pointer">
                      {location}
                      {hasMore && (
                        <span className="text-sm text-muted-foreground ml-2 group-hover:text-primary/70">
                          (+{locationHouses.length - PREVIEW_LIMIT} more)
                        </span>
                      )}
                    </h2>
                  </Link>
                  <p className="text-sm text-muted-foreground">{locationHouses.length} properties</p>
                </div>
                
                {/* Houses Grid for this location - limited preview */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                  {previewHouses.map((house) => (
                    <div key={house.houseId} className="group relative">
                      <FavoriteButton houseId={house.houseId} isDefaultFavorite={!!house.isDefaultFavorite} />
                      
                      <Link
                        href={`/main/house/${house.houseId}`}
                        className="hover:shadow-md transition-shadow duration-200 hover:translate-y-[-2px] block h-full"
                      >
                        {/* Image container */}
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
                        {/* Content area */}
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
              </div>
            );
          })
        )}
      </main>
    </>
  );
}