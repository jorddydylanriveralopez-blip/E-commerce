import { Category } from "@/lib/types";
import { getSql, hasDatabase } from "@/lib/db";

export type SaleStatus = "completed" | "pending" | "cancelled";

export type SaleRecord = {
  id: string;
  sellerId: string;
  sellerName?: string;
  buyerId?: string;
  buyerName?: string;
  listingId?: string;
  listingTitle: string;
  listingImage?: string;
  category: Category;
  price?: number;
  priceType: string;
  status: SaleStatus;
  soldAt: string;
};

type SaleRow = {
  id: string;
  seller_id: string;
  seller_name: string | null;
  buyer_id: string | null;
  buyer_name: string | null;
  listing_id: string | null;
  listing_title: string;
  listing_image: string | null;
  category: string;
  price: string | null;
  price_type: string;
  status: string;
  sold_at: string;
};

function rowToSale(row: SaleRow): SaleRecord {
  return {
    id: row.id,
    sellerId: row.seller_id,
    sellerName: row.seller_name ?? undefined,
    buyerId: row.buyer_id ?? undefined,
    buyerName: row.buyer_name ?? undefined,
    listingId: row.listing_id ?? undefined,
    listingTitle: row.listing_title,
    listingImage: row.listing_image ?? undefined,
    category: row.category as Category,
    price: row.price ? Number(row.price) : undefined,
    priceType: row.price_type,
    status: row.status as SaleStatus,
    soldAt: row.sold_at,
  };
}

export type CreateSaleInput = {
  sellerId: string;
  sellerName?: string;
  buyerId?: string;
  buyerName?: string;
  listingId?: string;
  listingTitle: string;
  listingImage?: string;
  category: Category;
  price?: number;
  priceType: string;
  status?: SaleStatus;
};

export async function createSale(input: CreateSaleInput): Promise<SaleRecord | null> {
  if (!hasDatabase()) return null;

  const sql = getSql();
  const rows = await sql`
    INSERT INTO sales (
      seller_id, seller_name, buyer_id, buyer_name, listing_id, listing_title,
      listing_image, category, price, price_type, status
    )
    VALUES (
      ${input.sellerId},
      ${input.sellerName ?? null},
      ${input.buyerId ?? null},
      ${input.buyerName ?? null},
      ${input.listingId ?? null},
      ${input.listingTitle},
      ${input.listingImage ?? null},
      ${input.category},
      ${input.price ?? null},
      ${input.priceType},
      ${input.status ?? "completed"}
    )
    RETURNING *
  `;

  return rowToSale(rows[0] as SaleRow);
}

export async function getSalesBySeller(sellerId: string): Promise<SaleRecord[]> {
  if (!hasDatabase()) return [];

  const sql = getSql();
  const rows = await sql`
    SELECT * FROM sales
    WHERE seller_id = ${sellerId}
    ORDER BY sold_at DESC
  `;

  return (rows as SaleRow[]).map(rowToSale);
}

export async function getSellerSalesStats(sellerId: string) {
  const sales = await getSalesBySeller(sellerId);
  const completed = sales.filter((s) => s.status === "completed");

  const totalRevenue = completed.reduce((sum, s) => {
    if (s.priceType === "negociable" || !s.price) return sum;
    return sum + s.price;
  }, 0);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonth = completed.filter((s) => new Date(s.soldAt) >= monthStart);

  return {
    totalSales: completed.length,
    totalRevenue,
    thisMonthCount: thisMonth.length,
    pendingCount: sales.filter((s) => s.status === "pending").length,
  };
}

export async function getPurchasesByBuyer(buyerId: string): Promise<SaleRecord[]> {
  if (!hasDatabase()) return [];

  const sql = getSql();
  const rows = await sql`
    SELECT * FROM sales
    WHERE buyer_id = ${buyerId}
    ORDER BY sold_at DESC
  `;

  return (rows as SaleRow[]).map(rowToSale);
}

export async function getBuyerPurchaseStats(buyerId: string) {
  const purchases = await getPurchasesByBuyer(buyerId);
  const completed = purchases.filter((p) => p.status === "completed");

  const totalSpent = completed.reduce((sum, p) => {
    if (p.priceType === "negociable" || !p.price) return sum;
    return sum + p.price;
  }, 0);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonth = completed.filter((p) => new Date(p.soldAt) >= monthStart);
  const productCount = completed.filter((p) => p.category === "productos").length;
  const serviceCount = completed.filter((p) => p.category === "servicios").length;

  return {
    totalPurchases: completed.length,
    totalSpent,
    thisMonthCount: thisMonth.length,
    productCount,
    serviceCount,
  };
}
