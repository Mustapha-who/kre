import { getHouseById } from "@/services/houseService";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default async function HouseDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const houseId = Number(id);
  if (isNaN(houseId)) return notFound();

  const house = await getHouseById(houseId);

  if (!house) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      {/* Images Gallery */}
      <div className="mb-4">
        <div className="flex gap-2 overflow-x-auto">
          {house.images.length > 0 ? (
            house.images.map((img) => (
              <div key={img.imageId} className="min-w-[160px] max-w-xs border-muted">
                <CardContent className="p-0">
                  <img
                    src={img.imageUrl}
                    alt={house.title}
                    className="h-32 w-full object-cover rounded-md"
                  />
                </CardContent>
              </div>
            ))
          ) : (
            <Card className="min-w-[160px] max-w-xs border-muted">
              <CardContent className="p-0">
                <img
                  src="https://via.placeholder.com/400x200"
                  alt="No images"
                  className="h-32 w-full object-cover rounded-md"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* House Info */}
      <h1 className="text-xl font-bold mb-1">{house.title}</h1>
      <div className="text-muted-foreground text-sm mb-2">
        {house.region ? `${house.region.city}, ${house.region.country}` : ""}
      </div>
      <div className="flex flex-wrap gap-3 mb-3 text-xs">
        <span>
          <span className="font-semibold">Posted:</span>{" "}
          {new Date(house.datePosted).toLocaleDateString()}
        </span>
        <span>
          <span className="font-semibold">Price:</span>{" "}
          <span className="text-primary font-bold">{house.monthlyRent.toLocaleString()}dt</span>
        </span>
        <span>
          <span className="font-semibold">Rooms:</span> {house.numberOfRooms}
        </span>
        <span>
          <span className="font-semibold">Bathrooms:</span> {house.numberOfBathrooms}
        </span>
        <span>
          <span className="font-semibold">Furnishing:</span> {house.furnishingStatus}
        </span>
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            house.isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {house.isAvailable ? "Available" : "Not Available"}
        </span>
      </div>

      {/* Owner Info */}
      <Card className="mb-3">
        <CardContent className="py-2 px-3 flex flex-col md:flex-row md:items-center gap-2">
          <div className="flex-1">
            <div className="font-semibold">Owner: {house.owner.name}</div>
            <div className="text-xs text-muted-foreground">{house.owner.email}</div>
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {house.owner.phoneNumber}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardContent className="py-3 px-3">
          <div className="font-semibold mb-1">Description:</div>
          <div className="text-xs text-muted-foreground">{house.description}</div>
        </CardContent>
      </Card>
    </div>
  );
}
