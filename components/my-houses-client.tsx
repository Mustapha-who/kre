"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Home, Calendar, MapPin, Bed, Bath } from "lucide-react";
import { HouseWithRegion } from "@/services/houseOwnerService";

interface MyHousesClientProps {
  ownerId: string;
}

export function MyHousesClient({ ownerId }: MyHousesClientProps) {
  const [houses, setHouses] = useState<HouseWithRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchHouses();
  }, [ownerId]);

  const fetchHouses = async () => {
    try {
      const response = await fetch(`/api/houses/owner/${ownerId}`);
      if (response.ok) {
        const data = await response.json();
        setHouses(data);
      }
    } catch (error) {
      console.error('Failed to fetch houses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoreHouses = () => {
    router.push(`/sign-up-house/${ownerId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="mt-3 text-sm text-muted-foreground">Loading your houses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Home className="h-6 w-6" />
            My Houses
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and view all your property listings
          </p>
        </div>
        <Button onClick={handleAddMoreHouses} className="flex items-center gap-2 h-9">
          <Plus className="h-4 w-4" />
          Add More Houses
        </Button>
      </div>

      {houses.length === 0 ? (
        <Card className="text-center p-6">
          <CardContent className="space-y-3">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Home className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-base font-semibold">No houses posted yet</h3>
              <p className="text-sm text-muted-foreground">
                Start by posting your first property listing
              </p>
            </div>
            <Button onClick={handleAddMoreHouses} className="flex items-center gap-2 h-9">
              <Plus className="h-4 w-4" />
              Post Your First House
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {houses.map((house) => (
            <div key={house.houseId} className="group relative">
              <div className="hover:shadow-md transition-shadow duration-200 hover:translate-y-[-2px] block h-full">
                {/* Image container */}
                <div className="w-full overflow-hidden">
                  <img 
                    src={
                      house.images[0]?.imageUrl
                        ? `data:image/jpeg;base64,${Buffer.from(house.images[0].imageUrl).toString("base64")}`
                        : '/placeholder-house.jpg'
                    }
                    alt={house.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Content area */}
                <div className="p-3 flex-grow border rounded-b-lg shadow-sm bg-background">
                  <CardTitle className="text-sm font-semibold line-clamp-1">{house.title}</CardTitle>
                  <CardDescription className="text-xs mt-1 line-clamp-1">
                    {house.region.regionName && `${house.region.regionName}`}
                  </CardDescription>
                  <div className="mt-1 text-sm font-semibold text-primary">
                    {house.monthlyRent.toLocaleString()}dt / month
                  </div>
                  <ul className="mt-1 text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      <span>{`${house.numberOfRooms} Beds`}</span>
                      <span>•</span>
                      <Bath className="h-3 w-3" />
                      <span>{`${house.numberOfBathrooms} Bath`}</span>
                    </li>
                    <li className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(house.datePosted).toLocaleDateString()}
                    </li>
                  </ul>
                  
                  {/* Status badges moved to bottom */}
                  <div className="flex gap-1 mt-2">
                    <Badge variant={house.verificationStatus ? "default" : "secondary"} className="text-xs">
                      {house.verificationStatus ? 'Verified' : 'Pending'}
                    </Badge>
                    <Badge variant={house.isAvailable ? "outline" : "destructive"} className="text-xs">
                      {house.isAvailable ? 'Available' : 'Rented'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

