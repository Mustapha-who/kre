import { VerifiedHousesPage } from "@/components/backend-components/verified-houses-page";
import { getVerifiedHouses } from "@/lib/actions/admin-actions";

export default async function VerifiedHousesPageWrapper() {
  const houses = await getVerifiedHouses();
  return <VerifiedHousesPage houses={houses} />; 
}