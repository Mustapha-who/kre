'use client'
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Helper function to safely convert image data to base64
function imageToBase64(imageData: any): string {
  if (!imageData) return '/placeholder-house.jpg';
  
  try {
    // If it's already a string (URL or base64), return as is
    if (typeof imageData === 'string') {
      return imageData.startsWith('data:') ? imageData : `data:image/jpeg;base64,${imageData}`;
    }
    
    // Handle object with numeric keys (like {0: 255, 1: 216, ...})
    if (imageData && typeof imageData === 'object') {
      const keys = Object.keys(imageData);
      if (keys.every(key => !isNaN(Number(key)))) {
        const dataArray = keys.map(key => imageData[key]);
        const uint8Array = new Uint8Array(dataArray);
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        const base64 = btoa(binary);
        return `data:image/jpeg;base64,${base64}`;
      }
    }
    
    return '/placeholder-house.jpg';
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return '/placeholder-house.jpg';
  }
}

export function VerifiedHousesPage() {
  const [houses, setHouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerifiedHouses();
  }, []);

  const fetchVerifiedHouses = async () => {
    try {
      const res = await fetch('/api/admin/houses/verified');
      if (res.ok) {
        const data = await res.json();
        setHouses(data);
      }
    } catch (error) {
      console.error('Failed to fetch verified houses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
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
              {house.images[0] && (
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={imageToBase64(house.images[0].imageUrl)}
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
                  <Button variant="outline" size="sm" className="flex-1">
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
