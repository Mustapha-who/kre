import { CardTitle, CardDescription} from "@/components/ui/card";
import { getHouses, searchHouses } from "@/services/houseService";
import Link from "next/link";

interface SearchParams {
  q?: string | string[];
}

interface MainPageProps {
  searchParams: Promise<SearchParams>;
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

  return (
    <main className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {houses.length === 0 ? (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          No houses found for your search criteria
        </div>
      ) : (
        houses.map((house) => (
          <Link
            key={house.houseId}
            href={`/main/house/${house.houseId}`}
            className="hover:shadow-md transition-shadow duration-200 hover:translate-y-[-2px] block h-full"
          >
            {/* Image container with no spacing */}
            <div className="w-full overflow-hidden" >
              <img 
                src={house.images[0]?.imageUrl || '/placeholder-house.jpg'}
                alt={house.title}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* Content area */}
            <div className="p-4 flex-grow border rounded-b-lg shadow-sm bg-background">
              <CardTitle className="text-lg font-semibold line-clamp-1">{house.title}</CardTitle>
              <CardDescription className="text-sm mt-1 line-clamp-1">
                {`${house.region.city}, ${house.region.country}`}
              </CardDescription>
              <div className="mt-2 text-md font-semibold text-primary">
                {house.monthlyRent.toLocaleString()}dt / month
              </div>
              <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <span>{`${house.numberOfRooms} Beds`}</span>
                  <span>•</span>
                  <span>{`${house.numberOfBathrooms} Bath`}</span>
                  <span>•</span>
                  <span className="capitalize">{house.furnishingStatus.toLowerCase()}</span>
                </li>
                <li className={`flex items-center ${house.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${house.isAvailable ? 'bg-green-600' : 'bg-red-600'} mr-2`}></span>
                  {house.isAvailable ? 'Available Now' : 'Not Available'}
                </li>
              </ul>
            </div>
          </Link>
        ))
      )}
    </main>
  );
}