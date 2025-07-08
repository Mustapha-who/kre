'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Eye } from "lucide-react";

interface House {
  houseId: number;
  title: string;
  monthlyRent: number;
  verificationStatus: boolean;
  datePosted: Date;
  owner: {
    name: string;
    email: string;
  };
  region: {
    city: string;
    country: string;
  };
  images: Array<{
    imageUrl: Uint8Array;
  }>;
}

interface AdminDashboardProps {
  initialHouses: House[];
}

export function AdminDashboard({ initialHouses }: AdminDashboardProps) {
  const [houses, setHouses] = useState<House[]>(initialHouses);
  const [loading, setLoading] = useState(false);

  const handleVerifyHouse = async (houseId: number, status: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/houses/${houseId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus: status }),
      });

      if (res.ok) {
        // Update the house in the local state
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
      setLoading(false);
    }
  };

  const unverifiedHouses = houses.filter(h => !h.verificationStatus);
  const verifiedHouses = houses.filter(h => h.verificationStatus);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Pending Verification Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          Pending Verification ({unverifiedHouses.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unverifiedHouses.map((house) => (
            <Card key={house.houseId} className="border-orange-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{house.title}</CardTitle>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Pending
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {house.region.city}, {house.region.country}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm">Owner: {house.owner.name}</p>
                  <p className="text-sm">Rent: {house.monthlyRent.toLocaleString()}dt/month</p>
                  <p className="text-xs text-muted-foreground">
                    Posted: {house.datePosted instanceof Date ? house.datePosted.toLocaleDateString() : new Date(house.datePosted).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleVerifyHouse(house.houseId, true)}
                    className="flex-1"
                    disabled={loading}
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
      </div>

      {/* Verified Houses Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Verified Houses ({verifiedHouses.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {verifiedHouses.map((house) => (
            <Card key={house.houseId} className="border-green-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{house.title}</CardTitle>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Verified
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {house.region.city}, {house.region.country}
                </p>
                <p className="text-sm font-semibold">{house.monthlyRent.toLocaleString()}dt</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
