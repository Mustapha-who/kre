import { getFavoriteHouses } from "@/services/houseService";
import { FavoritesGrid } from "@/components/favorites-grid";

export default async function FavoritesPage() {
  const houses = await getFavoriteHouses();

  return <FavoritesGrid initialHouses={houses} />;
}