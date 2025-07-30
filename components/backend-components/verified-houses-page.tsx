'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminHouseDetailsView } from "./admin-house-details-view";

interface VerifiedHousesPageProps {
  houses: any[];
}

export function VerifiedHousesPage({ houses: initialHouses }: VerifiedHousesPageProps) {
  const [houses] = useState(initialHouses);
  const [selectedHouse, setSelectedHouse] = useState<any>(null);

  const handleViewDetails = (house: any) => {
    // Just use the house data we already have
    setSelectedHouse(house);
  };

  const handleBackToList = () => {
    setSelectedHouse(null);
  };

  const handleHouseAction = async (houseId: number, action: 'approve' | 'reject') => {
    // For verified houses page, we might want to handle this differently
    // or disable these actions since houses are already verified
    console.log('House action not applicable for verified houses');
  };

  // If a house is selected, show the details view
  if (selectedHouse) {
    return (
      <AdminHouseDetailsView 
        house={selectedHouse}
        onBack={handleBackToList}
        onHouseAction={handleHouseAction}
        actionLoading={false}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <h1 className="text-2xl font-bold">All Verified Houses</h1>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {houses.length}
          </Badge>
        </div>
      </div>

      {/* Houses Grid */}
      {houses.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <p className="text-lg font-medium">No verified houses</p>
              <p className="text-sm">Verified houses will appear here.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {houses.map((house) => (
            <Card key={house.houseId} className="overflow-hidden">
              {/* Show image directly from API or placeholder */}
              {house.images && house.images.length > 0 ? (
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={`/api/image/${house.images[0].imageId}`}
                    alt={house.title}
                    className="object-cover w-full h-full"
                  />
                  <Badge 
                    variant="default" 
                    className="absolute top-2 right-2 bg-green-100 text-green-800"
                  >
                    Verified
                  </Badge>
                </div>
              ) : (
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                  <div className="text-center text-green-700">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="text-sm font-medium">Verified Property</div>
                  </div>
                  <Badge 
                    variant="default" 
                    className="absolute top-2 right-2 bg-green-100 text-green-800"
                  >
                    Verified
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-1">{house.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {house.region.city}, {house.region.country}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Owner:</span>
                    <span className="font-medium">{house.owner.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rent:</span>
                    <span className="font-medium text-primary">
                      {house.monthlyRent.toLocaleString()}dt/month
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Posted:</span>
                    <span className="text-muted-foreground">
                      {new Date(house.datePosted).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewDetails(house)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
                   
               
