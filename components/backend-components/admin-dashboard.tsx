'use client'
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Eye,Building2, AlertTriangle } from "lucide-react";
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

export function AdminDashboard() {
  const [houses, setHouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    try {
      const res = await fetch('/api/admin/houses');
      if (res.ok) {
        const data = await res.json();
        setHouses(data);
      }
    } catch (error) {
      console.error('Failed to fetch houses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyHouse = async (houseId: number, status: boolean) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/houses/${houseId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus: status }),
      });

      if (res.ok) {
        setHouses(prev => 
          prev.map(house => 
            house.houseId === houseId 
              ? { ...house, verificationStatus: status }
              : house
          )
        );
      }
    } catch (error) {
      console.error('Failed to update verification status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const unverifiedHouses = houses.filter(h => !h.verificationStatus);
  const verifiedHouses = houses.filter(h => h.verificationStatus);
  const totalHouses = houses.length;

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Stats Cards */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Houses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHouses}</div>
            <p className="text-xs text-muted-foreground">
              Total properties in system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unverifiedHouses.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{verifiedHouses.length}</div>
            <p className="text-xs text-muted-foreground">
              Approved properties
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Verification Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          <h2 className="text-xl font-semibold">Pending Verification</h2>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            {unverifiedHouses.length}
          </Badge>
        </div>
        
        {unverifiedHouses.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <p className="text-lg font-medium">All caught up!</p>
                <p className="text-sm">No houses pending verification.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {unverifiedHouses.map((house) => (
              <Card key={house.houseId} className="overflow-hidden">
                {house.images[0] && (
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={imageToBase64(house.images[0].imageUrl)}
                      alt={house.title}
                      className="object-cover w-full h-full"
                    />
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 right-2 bg-orange-100 text-orange-800"
                    >
                      Pending
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
                      size="sm"
                      onClick={() => handleVerifyHouse(house.houseId, true)}
                      className="flex-1"
                      disabled={actionLoading}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Verified Houses Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <h2 className="text-xl font-semibold">Recently Verified</h2>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {verifiedHouses.slice(0, 8).length}
          </Badge>
        </div>
        
        {verifiedHouses.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Building2 className="mx-auto h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No verified houses</p>
                <p className="text-sm">Verified houses will appear here.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {verifiedHouses.slice(0, 8).map((house) => (
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
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm line-clamp-1">{house.title}</CardTitle>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {house.region.city}, {house.region.country}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-semibold text-primary">
                    {house.monthlyRent.toLocaleString()}dt/month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {verifiedHouses.length > 8 && (
          <div className="text-center">
            <Link href="/admin/houses/verified">
              <Button variant="outline">
                View All Verified Houses ({verifiedHouses.length})
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}