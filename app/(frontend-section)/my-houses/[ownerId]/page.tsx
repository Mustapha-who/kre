import { MyHousesClient } from "@/components/my-houses-client";

export default async function MyHousesPage({ params }: { params: Promise<{ ownerId: string }> }) {
  const { ownerId } = await params;
  return <MyHousesClient ownerId={ownerId} />;
}
