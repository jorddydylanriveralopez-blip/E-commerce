import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasDatabase } from "@/lib/db";
import { getBuyerPurchaseStats, getPurchasesByBuyer } from "@/lib/sales-db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({
      purchases: [],
      stats: {
        totalPurchases: 0,
        totalSpent: 0,
        thisMonthCount: 0,
        productCount: 0,
        serviceCount: 0,
      },
    });
  }

  try {
    const [purchases, stats] = await Promise.all([
      getPurchasesByBuyer(session.user.id),
      getBuyerPurchaseStats(session.user.id),
    ]);
    return NextResponse.json({ purchases, stats });
  } catch (error) {
    console.error("purchases GET error:", error);
    return NextResponse.json({ error: "No se pudo cargar el historial" }, { status: 500 });
  }
}
