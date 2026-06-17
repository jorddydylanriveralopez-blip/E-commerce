import { ServiceListing } from "@/lib/types";
import { getListingById as getMockListingById, getListingsByCategory as getMockListingsByCategory } from "@/lib/data";
import { hasDatabase } from "@/lib/db";
import { getPublishedListingById, getPublishedListings } from "@/lib/listings-db";

function mergeListings(db: ServiceListing[], mock: ServiceListing[]) {
  const dbIds = new Set(db.map((l) => l.id));
  return [...db, ...mock.filter((l) => !dbIds.has(l.id))];
}

export async function getAllListings(category = "todos"): Promise<ServiceListing[]> {
  const mock = getMockListingsByCategory(category);
  if (!hasDatabase()) return mock;

  try {
    const published = await getPublishedListings(category);
    return mergeListings(published, mock);
  } catch (error) {
    console.error("getAllListings db error:", error);
    return mock;
  }
}

export async function resolveListingById(id: string): Promise<ServiceListing | undefined> {
  if (hasDatabase()) {
    try {
      const fromDb = await getPublishedListingById(id);
      if (fromDb) return fromDb;
    } catch (error) {
      console.error("resolveListingById db error:", error);
    }
  }
  return getMockListingById(id);
}
