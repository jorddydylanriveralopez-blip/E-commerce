import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { hasDatabase } from "@/lib/db";
import { createSale } from "@/lib/sales-db";
import type { Category } from "@/lib/types";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 503 });
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Firma ausente" }, { status: 400 });
  }

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("stripe webhook signature error:", error);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object;
    const metadata = checkoutSession.metadata;

    if (!metadata?.cart || !hasDatabase()) {
      return NextResponse.json({ received: true });
    }

    try {
      const items = JSON.parse(metadata.cart) as Array<{
        sellerId: string;
        sellerName?: string;
        listingId?: string;
        listingTitle: string;
        listingImage?: string;
        category: Category;
        price?: number;
        priceType: string;
      }>;

      for (const item of items) {
        if (!item.sellerId || !item.listingTitle || !item.category) continue;

        await createSale({
          sellerId: item.sellerId,
          sellerName: item.sellerName,
          buyerId: metadata.buyerId,
          buyerName: metadata.buyerName,
          listingId: item.listingId,
          listingTitle: item.listingTitle,
          listingImage: item.listingImage,
          category: item.category,
          price: item.price,
          priceType: item.priceType ?? "fijo",
          status: "completed",
        });
      }
    } catch (error) {
      console.error("stripe webhook sale error:", error);
    }
  }

  return NextResponse.json({ received: true });
}
