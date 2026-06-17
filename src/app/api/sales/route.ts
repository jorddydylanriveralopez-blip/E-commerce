import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasDatabase } from "@/lib/db";
import { createSale, getSalesBySeller, getSellerSalesStats } from "@/lib/sales-db";
import { Category } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({
      sales: [],
      stats: { totalSales: 0, totalRevenue: 0, thisMonthCount: 0, pendingCount: 0 },
    });
  }

  try {
    const [sales, stats] = await Promise.all([
      getSalesBySeller(session.user.id),
      getSellerSalesStats(session.user.id),
    ]);
    return NextResponse.json({ sales, stats });
  } catch (error) {
    console.error("sales GET error:", error);
    return NextResponse.json({ error: "No se pudo cargar el historial" }, { status: 500 });
  }
}

type SaleItemInput = {
  sellerId: string;
  sellerName?: string;
  listingId?: string;
  listingTitle: string;
  listingImage?: string;
  category: Category;
  price?: number;
  priceType: string;
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
  }

  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "Base de datos no configurada" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { items, manual } = body as {
      items?: SaleItemInput[];
      manual?: SaleItemInput;
    };

    const buyerId = session.user.id;
    const buyerName = session.user.name ?? "Comprador";

    const toCreate: SaleItemInput[] = manual ? [manual] : items ?? [];

    if (toCreate.length === 0) {
      return NextResponse.json({ error: "Sin artículos para registrar" }, { status: 400 });
    }

    const created = [];

    for (const item of toCreate) {
      if (!item.listingTitle || !item.sellerId || !item.category) {
        continue;
      }

      if (manual && item.sellerId !== session.user.id) {
        return NextResponse.json({ error: "No puedes marcar ventas de otro vendedor" }, { status: 403 });
      }

      const sale = await createSale({
        sellerId: item.sellerId,
        sellerName: item.sellerName,
        buyerId: manual ? undefined : buyerId,
        buyerName: manual ? "Venta directa" : buyerName,
        listingId: item.listingId,
        listingTitle: item.listingTitle,
        listingImage: item.listingImage,
        category: item.category,
        price: item.price,
        priceType: item.priceType ?? "fijo",
        status: "completed",
      });

      if (sale) created.push(sale);
    }

    if (created.length === 0) {
      return NextResponse.json({ error: "No se registraron ventas" }, { status: 400 });
    }

    return NextResponse.json({ sales: created }, { status: 201 });
  } catch (error) {
    console.error("sales POST error:", error);
    return NextResponse.json({ error: "No se pudo registrar la venta" }, { status: 500 });
  }
}
