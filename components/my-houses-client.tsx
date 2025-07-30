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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-base text-muted-foreground">Loading your houses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Home className="h-8 w-8 text-primary" />
            My Houses
          </h1>
          <p className="text-base text-muted-foreground mt-2">
            Manage and view all your property listings
          </p>
        </div>
        <Button onClick={handleAddMoreHouses} size="lg" className="flex items-center gap-2 shadow-md">
          <Plus className="h-5 w-5" />
          Add More Houses
        </Button>
      </div>

      {houses.length === 0 ? (
        <Card className="text-center p-8 bg-gradient-to-br from-background to-muted/30">
          <CardContent className="space-y-6">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Home className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">No houses posted yet</h3>
              <p className="text-base text-muted-foreground">
                Start by posting your first property listing
              </p>
            </div>
            <Button onClick={handleAddMoreHouses} size="lg" className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Post Your First House
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {houses.map((house) => (
            <Card key={house.houseId} className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-md">
              <div className="relative">
                {/* Image container */}
                <div className="w-full overflow-hidden">
                  <img 
                    src={
                      house.images[0]?.imageUrl
                        ? `data:image/jpeg;base64,${Buffer.from(house.images[0].imageUrl).toString("base64")}`
                        : '/placeholder-house.jpg'
                    }
                    alt={house.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              
              {/* Content area */}
              <CardContent className="p-4 space-y-3">
                <div>
                  <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {house.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{house.region.regionName}, {house.region.city}</span>
                  </div>
                </div>
                
                <div className="text-2xl font-bold text-primary">
                  {house.monthlyRent.toLocaleString()}dt
                  <span className="text-sm font-normal text-muted-foreground ml-1">/month</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span className="font-medium">{house.numberOfRooms} Beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span className="font-medium">{house.numberOfBathrooms} Baths</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {new Date(house.datePosted).toLocaleDateString()}</span>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {house.furnishingStatus}
                    </span>
                    <div className="flex gap-2">
                      <Badge 
                        variant={house.verificationStatus ? "default" : "secondary"} 
                        className="text-xs font-medium"
                      >
                        {house.verificationStatus ? '✓ Verified' : '⏳ Pending'}
                      </Badge>
                      <Badge 
                        variant={house.isAvailable ? "outline" : "destructive"} 
                        className="text-xs font-medium"
                      >
                        {house.isAvailable ? '🟢 Available' : '🔴 Rented'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

