'use client'
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Eye, Building2, AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminHouseDetailsView } from "./admin-house-details-view";
import { verifyHouse } from "@/lib/actions/admin-actions";

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

interface AdminDashboardProps {
  houses: any[];
}

export function AdminDashboard({ houses: initialHouses }: AdminDashboardProps) {
  const [houses, setHouses] = useState(initialHouses);
  const [isPending, startTransition] = useTransition();
  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    houseId: number | null;
    houseTitle: string;
    action: 'approve' | 'reject';
  }>({
    isOpen: false,
    houseId: null,
    houseTitle: '',
    action: 'approve'
  });

  const handleVerifyHouse = async (houseId: number, status: boolean) => {
    const house = houses.find(h => h.houseId === houseId);
    setConfirmationDialog({
      isOpen: true,
      houseId,
      houseTitle: house?.title || 'this house',
      action: status ? 'approve' : 'reject'
    });
  };

  const confirmVerifyHouse = async () => {
    if (!confirmationDialog.houseId) return;
    
    startTransition(async () => {
      const result = await verifyHouse(
        confirmationDialog.houseId!, 
        confirmationDialog.action === 'approve'
      );

      if (result.success) {
        setHouses((prev: any[]) => 
          prev.map(house => 
            house.houseId === confirmationDialog.houseId 
              ? { ...house, verificationStatus: confirmationDialog.action === 'approve' }
              : house
          )
        );
      }
      
      setConfirmationDialog({
        isOpen: false,
        houseId: null,
        houseTitle: '',
        action: 'approve'
      });
    });
  };

  const cancelVerification = () => {
    setConfirmationDialog({
      isOpen: false,
      houseId: null,
      houseTitle: '',
      action: 'approve'
    });
  };

  const handleViewDetails = (house: any) => {
    // Just use the house data we already have instead of fetching detailed data
    setSelectedHouse(house);
  };

  const handleBackToList = () => {
    setSelectedHouse(null);
  };

  const handleHouseAction = async (houseId: number, action: 'approve' | 'reject') => {
    const status = action === 'approve';
    
    startTransition(async () => {
      const result = await verifyHouse(houseId, status);
      
      if (result.success) {
        // Update local state immediately for better UX
        setHouses((prev: any[]) => 
          prev.map(house => 
            house.houseId === houseId 
              ? { ...house, verificationStatus: status }
              : house
          )
        );
        
        if (selectedHouse?.houseId === houseId) {
          setSelectedHouse((prev: any) => ({
            ...prev,
            verificationStatus: status
          }));
        }
      } else {
        console.error('Failed to update verification status');
      }
    });
  };

  const unverifiedHouses = houses.filter(h => !h.verificationStatus);
  const verifiedHouses = houses.filter(h => h.verificationStatus);
  const totalHouses = houses.length;

  // If a house is selected, show the details view
  if (selectedHouse) {
    return (
      <AdminHouseDetailsView 
        house={selectedHouse}
        onBack={handleBackToList}
        onHouseAction={handleHouseAction}
        actionLoading={isPending}
      />
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4">
        {/* Stats Cards */}
        <div className="grid auto-rows-min gap-3 md:grid-cols-3">
          <Card className="p-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-sm font-medium">Total Houses</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-xl font-bold">{totalHouses}</div>
              <p className="text-xs text-muted-foreground">
                Total properties in system
              </p>
            </CardContent>
          </Card>
          <Card className="p-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-xl font-bold text-orange-600">{unverifiedHouses.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting verification
              </p>
            </CardContent>
          </Card>
          <Card className="p-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-xl font-bold text-green-600">{verifiedHouses.length}</div>
              <p className="text-xs text-muted-foreground">
                Approved properties
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Verification Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <h2 className="text-lg font-semibold">Pending Verification</h2>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
              {unverifiedHouses.length}
            </Badge>
          </div>
          
          {unverifiedHouses.length === 0 ? (
            <Card className="p-4">
              <CardContent className="pt-2">
                <div className="text-center text-muted-foreground">
                  <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                  <p className="text-sm font-medium">All caught up!</p>
                  <p className="text-xs">No houses pending verification.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {unverifiedHouses.map((house) => (
                <Card key={house.houseId} className="overflow-hidden">
                  {/* Placeholder for image */}
                  <div className="aspect-video relative overflow-hidden bg-muted flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">No Image</div>
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 right-2 bg-orange-100 text-orange-800 text-xs"
                    >
                      Pending
                    </Badge>
                  </div>
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm line-clamp-1">{house.title}</CardTitle>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {house.region.city}, {house.region.country}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Owner:</span>
                        <span className="font-medium">{house.owner.name}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Rent:</span>
                        <span className="font-medium text-primary">
                          {house.monthlyRent.toLocaleString()}dt/month
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
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
                        className="flex-1 h-8 text-xs"
                        disabled={isPending}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => handleVerifyHouse(house.houseId, false)}
                        disabled={isPending}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => handleViewDetails(house)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Verified Houses Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <h2 className="text-lg font-semibold">Recently Verified</h2>
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
              {verifiedHouses.slice(0, 8).length}
            </Badge>
          </div>
          
          {verifiedHouses.length === 0 ? (
            <Card className="p-4">
              <CardContent className="pt-2">
                <div className="text-center text-muted-foreground">
                  <Building2 className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm font-medium">No verified houses</p>
                  <p className="text-xs">Verified houses will appear here.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {verifiedHouses.slice(0, 8).map((house) => (
                <Card 
                  key={house.houseId} 
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleViewDetails(house)}
                >
                  {/* Placeholder for image */}
                  <div className="aspect-video relative overflow-hidden bg-muted flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">No Image</div>
                    <Badge 
                      variant="default" 
                      className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs"
                    >
                      Verified
                    </Badge>
                  </div>
                  <CardHeader className="pb-1 pt-2">
                    <CardTitle className="text-sm line-clamp-1">{house.title}</CardTitle>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {house.region.city}, {house.region.country}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
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
                <Button variant="outline" size="sm">
                  View All Verified Houses ({verifiedHouses.length})
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationDialog.isOpen} onOpenChange={cancelVerification}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmationDialog.action === 'approve' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
              {confirmationDialog.action === 'approve' ? 'Approve House' : 'Reject House'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmationDialog.action} 
              <span className="font-semibold"> "{confirmationDialog.houseTitle}"</span>?
              {confirmationDialog.action === 'approve' 
                ? ' This will make it visible to all users on the platform.'
                : ' This will prevent it from being displayed to users.'
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelVerification} disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant={confirmationDialog.action === 'approve' ? 'default' : 'destructive'}
              onClick={confirmVerifyHouse}
              disabled={isPending}
              className="flex items-center gap-2"
            >
              {isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
              ) : confirmationDialog.action === 'approve' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
              {confirmationDialog.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}