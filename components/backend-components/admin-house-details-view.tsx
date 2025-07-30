"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  MapPin, 
  Calendar, 
  User, 
  Mail, 
  Home, 
  Bed, 
  Bath, 
  Banknote,
  Building2,
  CheckCircle,
  X
} from "lucide-react";

interface AdminHouseDetailsViewProps {
  house: any;
  onBack: () => void;
  onHouseAction: (houseId: number, action: 'approve' | 'reject') => void;
  actionLoading: boolean;
}

export function AdminHouseDetailsView({ house, onBack, onHouseAction, actionLoading }: AdminHouseDetailsViewProps) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header with back button and actions - more compact */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Property Details</h1>
            <Badge variant={house.verificationStatus ? "default" : "secondary"} className="text-xs">
              {house.verificationStatus ? 'Verified' : 'Pending'}
            </Badge>
          </div>
        </div>

        {/* Action buttons for pending houses - smaller */}
        {!house.verificationStatus && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onHouseAction(house.houseId, 'approve')}
              disabled={actionLoading}
              className="flex items-center gap-2"
            >
              {actionLoading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
              ) : (
                <CheckCircle className="w-3 h-3" />
              )}
              Approve
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onHouseAction(house.houseId, 'reject')}
              disabled={actionLoading}
              className="flex items-center gap-2"
            >
              <X className="w-3 h-3" />
              Reject
            </Button>
          </div>
        )}
      </div>

      {/* Main content - more compact grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - Images - smaller and more compact */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Image - reduced height */}
          {house.images && house.images.length > 0 ? (
            <div className="space-y-3">
              <div className="aspect-[16/9] overflow-hidden rounded-lg border shadow-md">
                <img
                  src={`/api/image/${house.images[0].imageId}`}
                  alt={house.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Additional Images - smaller grid */}
              {house.images.length > 1 && (
                <div>
                  <h3 className="text-base font-semibold mb-2">
                    Additional Photos ({house.images.length - 1})
                  </h3>
                  <div className="grid grid-cols-6 gap-2">
                    {house.images.slice(1, 7).map((image: any, index: number) => (
                      <div key={index} className="aspect-square overflow-hidden rounded border">
                        <img
                          src={`/api/image/${image.imageId}`}
                          alt={`${house.title} - Image ${index + 2}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                  {house.images.length > 7 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      +{house.images.length - 7} more photos
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Placeholder for missing images
            <div className="space-y-3">
              <div className="aspect-[16/9] overflow-hidden rounded-lg border shadow-md bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-4xl mb-2">🏠</div>
                  <div>No Image Available</div>
                </div>
              </div>
            </div>
          )}

          {/* Description - more compact */}
          {house.description && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  About This Property
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {house.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column - Details - more compact cards */}
        <div className="space-y-4">
          {/* Basic Info - smaller */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div>
                <h2 className="text-lg font-bold leading-tight">{house.title}</h2>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  <span className="text-sm">{house.region.city}, {house.region.country}</span>
                </div>
                <div className="text-2xl font-bold text-primary mt-2">
                  {house.monthlyRent.toLocaleString()}dt
                  <span className="text-sm font-normal text-muted-foreground ml-1">/month</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge variant={house.verificationStatus ? "default" : "secondary"} className="text-xs">
                  {house.verificationStatus ? 'Verified' : 'Pending'}
                </Badge>
                <Badge variant={house.isAvailable ? "outline" : "destructive"} className="text-xs">
                  {house.isAvailable ? 'Available' : 'Rented'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Key Features - smaller cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <Bed className="h-6 w-6 text-primary mx-auto mb-1" />
                <div className="text-xl font-bold">{house.numberOfRooms}</div>
                <div className="text-xs text-muted-foreground">Bedrooms</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Bath className="h-6 w-6 text-primary mx-auto mb-1" />
                <div className="text-xl font-bold">{house.numberOfBathrooms}</div>
                <div className="text-xs text-muted-foreground">Bathrooms</div>
              </CardContent>
            </Card>
          </div>

          {/* Property Details - more compact */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                Property Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-muted text-sm">
                  <span className="text-muted-foreground">Furnishing</span>
                  <span className="font-medium">{house.furnishingStatus}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-muted text-sm">
                  <span className="text-muted-foreground">Posted</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">{new Date(house.datePosted).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`font-medium ${house.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {house.isAvailable ? 'Available' : 'Rented'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Details - more compact */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Location
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-muted text-sm">
                  <span className="text-muted-foreground">Region</span>
                  <span className="font-medium">{house.region.regionName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-muted text-sm">
                  <span className="text-muted-foreground">City</span>
                  <span className="font-medium">{house.region.city}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-muted text-sm">
                  <span className="text-muted-foreground">Country</span>
                  <span className="font-medium">{house.region.country}</span>
                </div>
                {house.region.postalCode && (
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-muted-foreground">Postal Code</span>
                    <span className="font-medium">{house.region.postalCode}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Owner Information - more compact */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Owner Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-muted text-sm">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-semibold">{house.owner.name}</span>
                </div>
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-primary" />
                    <span className="font-medium text-xs">{house.owner.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
            