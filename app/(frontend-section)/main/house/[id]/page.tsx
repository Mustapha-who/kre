import { getHouseById } from "@/services/houseService";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Home, Bath, Sofa } from "lucide-react";
import { PhotoGallery } from "@/components/photo-gallery";

export default async function HouseDetailsPage(props: { params: Promise<{ id: string | string[] }> }) {
  const { id } = await props.params;
  const idParam = Array.isArray(id) ? id[0] : id;
  const houseId = Number(idParam);
  if (isNaN(houseId)) return notFound();

  const house = await getHouseById(houseId);
  if (!house) return notFound();

  const mainImage = house.images[0]?.imageUrl || '/placeholder-house.jpg';
  const thumbnailImages = house.images.slice(1, 5);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Enhanced Images Gallery */}
      <div className="mb-8">
        <PhotoGallery
          images={house.images}
          mainImage={mainImage}
          houseTitle={house.title}
          thumbnailImages={thumbnailImages}
        />
      </div>

      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{house.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{house.region ? `${house.region.city}, ${house.region.country}` : "Location not specified"}</span>
            </div>
          </div>
          <Badge variant={house.isAvailable ? "default" : "destructive"} className="self-start">
            {house.isAvailable ? "Available" : "Not Available"}
          </Badge>
        </div>

        <Separator className="my-4" />

        {/* Key Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Posted</p>
              <p className="font-medium">{new Date(house.datePosted).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Rent</p>
              <p className="font-medium text-primary">{house.monthlyRent.toLocaleString()} dt</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-muted/50">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rooms</p>
              <p className="font-medium">{house.numberOfRooms}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-muted/50">
              <Bath className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bathrooms</p>
              <p className="font-medium">{house.numberOfBathrooms}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-line">
            {house.description || "No description provided"}
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sofa className="h-4 w-4" />
              {house.furnishingStatus}
            </Badge>
            {/* Add more features as needed */}
          </div>
        </CardContent>
      </Card>

      {/* Owner Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Owner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{house.owner.name}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{house.owner.email}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{house.owner.phoneNumber || "Not provided"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}