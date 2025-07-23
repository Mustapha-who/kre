"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Calendar, 
  User, 
  Mail, 
  Home, 
  Bed, 
  Bath, 
  Banknote,
  Building2
} from "lucide-react";

interface AdminHouseDetailsModalProps {
  house: any;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to safely convert image data to base64
function imageToBase64(imageData: any): string {
  if (!imageData) return '/placeholder-house.jpg';
  
  try {
    if (typeof imageData === 'string') {
      return imageData.startsWith('data:') ? imageData : `data:image/jpeg;base64,${imageData}`;
    }
    
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

export function AdminHouseDetailsModal({ house, isOpen, onClose }: AdminHouseDetailsModalProps) {
  if (!house) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-10xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Building2 className="h-6 w-6 text-primary" />
            House Details
          </DialogTitle>
          <DialogDescription className="text-base">
            Complete information about this property listing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Section with Image and Basic Info */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Main Image */}
            {house.images && house.images.length > 0 && (
              <div className="aspect-video overflow-hidden rounded-xl border shadow-sm">
                <img
                  src={imageToBase64(house.images[0].imageUrl)}
                  alt={house.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-bold leading-tight">{house.title}</h3>
                  <div className="flex gap-2 ml-4">
                    <Badge variant={house.verificationStatus ? "default" : "secondary"} className="text-sm">
                      {house.verificationStatus ? 'Verified' : 'Pending'}
                    </Badge>
                    <Badge variant={house.isAvailable ? "outline" : "destructive"} className="text-sm">
                      {house.isAvailable ? 'Available' : 'Rented'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{house.region.city}, {house.region.country}</span>
                </div>

                <div className="text-4xl font-bold text-primary">
                  {house.monthlyRent.toLocaleString()}dt
                  <span className="text-lg font-normal text-muted-foreground ml-2">/month</span>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                  <Bed className="h-6 w-6 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{house.numberOfRooms}</div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                  <Bath className="h-6 w-6 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{house.numberOfBathrooms}</div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          {house.description && (
            <div>
              <h4 className="text-xl font-semibold mb-3">About This Property</h4>
              <p className="text-base text-muted-foreground leading-relaxed bg-muted/20 p-4 rounded-lg">
                {house.description}
              </p>
            </div>
          )}

          {/* Property & Location Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Property Details */}
            <Card className="shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Property Details
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-muted">
                    <span className="text-muted-foreground">Furnishing Status</span>
                    <span className="font-medium">{house.furnishingStatus}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-muted">
                    <span className="text-muted-foreground">Date Posted</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{new Date(house.datePosted).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">Availability</span>
                    <span className={`font-medium ${house.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {house.isAvailable ? 'Available for Rent' : 'Currently Rented'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Owner Details */}
            <Card className="shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location & Contact
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-muted">
                    <span className="text-muted-foreground">Region</span>
                    <span className="font-medium">{house.region.regionName}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-muted">
                    <span className="text-muted-foreground">City</span>
                    <span className="font-medium">{house.region.city}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-muted">
                    <span className="text-muted-foreground">Country</span>
                    <span className="font-medium">{house.region.country}</span>
                  </div>
                  
                  {house.region.postalCode && (
                    <div className="flex items-center justify-between py-2 border-b border-muted">
                      <span className="text-muted-foreground">Postal Code</span>
                      <span className="font-medium">{house.region.postalCode}</span>
                    </div>
                  )}

                  <Separator className="my-3" />
                  
                  <div className="flex items-center justify-between py-2 border-b border-muted">
                    <span className="text-muted-foreground">Property Owner</span>
                    <span className="font-semibold">{house.owner.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">Contact Email</span>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{house.owner.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Images */}
          {house.images && house.images.length > 1 && (
            <div>
              <h4 className="text-xl font-semibold mb-4">Additional Photos</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {house.images.slice(1, 9).map((image: any, index: number) => (
                  <div key={index} className="aspect-video overflow-hidden rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={imageToBase64(image.imageUrl)}
                      alt={`${house.title} - Image ${index + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
              {house.images.length > 9 && (
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  +{house.images.length - 9} more photos available
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

