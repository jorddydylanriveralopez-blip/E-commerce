import { Category, ServiceListing } from "@/lib/types";
import { yaavImages } from "@/lib/images";
import { getSql } from "@/lib/db";

type ListingRow = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: Category;
  price: string | null;
  price_type: ServiceListing["priceType"];
  location: string;
  whatsapp: string;
  tags: string[] | null;
  image: string | null;
  featured: boolean;
  views: number;
  created_at: string;
  author_name: string;
  author_image: string | null;
};

function defaultImage(category: Category) {
  return category === "productos" ? yaavImages.smartphone : yaavImages.planPospago;
}

function rowToListing(row: ListingRow): ServiceListing {
  const image = row.image ?? defaultImage(row.category);
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    price: row.price ? Number(row.price) : 0,
    priceType: row.price_type,
    image,
    images: [image],
    provider: {
      id: row.user_id,
      name: row.author_name,
      avatar:
        row.author_image ??
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      location: row.location,
      whatsapp: row.whatsapp,
      rating: 5,
      reviewCount: 0,
      verified: false,
      memberSince: new Date(row.created_at).getFullYear().toString(),
      bio: "Yaavser en Yaavstore",
    },
    tags: row.tags ?? [],
    featured: row.featured,
    createdAt: row.created_at.slice(0, 10),
    views: row.views,
  };
}

export async function createListing(input: {
  userId: string;
  authorName: string;
  authorImage?: string | null;
  title: string;
  description: string;
  category: Category;
  price?: number;
  priceType: ServiceListing["priceType"];
  location: string;
  whatsapp: string;
  tags?: string[];
}) {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO listings (
      user_id, author_name, author_image, title, description, category,
      price, price_type, location, whatsapp, tags
    )
    VALUES (
      ${input.userId},
      ${input.authorName},
      ${input.authorImage ?? null},
      ${input.title},
      ${input.description},
      ${input.category},
      ${input.price ?? null},
      ${input.priceType},
      ${input.location},
      ${input.whatsapp},
      ${input.tags ?? []}
    )
    RETURNING *
  `;

  return rowToListing(rows[0] as ListingRow);
}

export async function getPublishedListings(category?: string): Promise<ServiceListing[]> {
  const sql = getSql();

  const rows =
    category && category !== "todos"
      ? await sql`
          SELECT * FROM listings
          WHERE category = ${category}
          ORDER BY created_at DESC
        `
      : await sql`
          SELECT * FROM listings
          ORDER BY created_at DESC
        `;

  return (rows as ListingRow[]).map(rowToListing);
}

export async function getPublishedListingById(id: string): Promise<ServiceListing | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM listings WHERE id = ${id}::uuid LIMIT 1
  `;
  const row = rows[0] as ListingRow | undefined;
  if (!row) return null;
  return rowToListing(row);
}
