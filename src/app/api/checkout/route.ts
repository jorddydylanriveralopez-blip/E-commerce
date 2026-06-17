import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStripe, getAppBaseUrl } from "@/lib/stripe";
import {
  isStripeConfigured,
  stripePaymentTypes,
  type PaymentMethodId,
} from "@/lib/payments";
import type { Category } from "@/lib/types";

type CheckoutItem = {
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

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Pasarela de pago no configurada. Usa WhatsApp o contacta soporte." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { items, paymentMethod } = body as {
      items?: CheckoutItem[];
      paymentMethod?: PaymentMethodId;
    };

    if (!items?.length) {
      return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    }

    const method: PaymentMethodId = paymentMethod ?? "card";

    if (method === "whatsapp") {
      return NextResponse.json(
        { error: "Usa confirmar compra para coordinar por WhatsApp" },
        { status: 400 }
      );
    }

    const invalid = items.some(
      (item) =>
        !item.price ||
        item.price <= 0 ||
        item.priceType === "negociable" ||
        !item.listingTitle ||
        !item.sellerId
    );

    if (invalid) {
      return NextResponse.json(
        { error: "Solo puedes pagar en línea artículos con precio fijo" },
        { status: 400 }
      );
    }

    const total = items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    if (total < 10) {
      return NextResponse.json(
        { error: "El monto mínimo para pago en línea es $10 MXN" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const baseUrl = getAppBaseUrl();

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "mxn",
        unit_amount: Math.round((item.price ?? 0) * 100),
        product_data: {
          name: item.listingTitle.slice(0, 120),
          images:
            item.listingImage?.startsWith("http")
              ? [item.listingImage]
              : undefined,
        },
      },
      quantity: 1,
    }));

    const paymentMethodTypes = stripePaymentTypes(method);

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "mxn",
      payment_method_types: paymentMethodTypes,
      line_items: lineItems,
      customer_email: session.user.email ?? undefined,
      success_url: `${baseUrl}/comprar/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/comprar`,
      metadata: {
        buyerId: session.user.id,
        buyerName: session.user.name ?? "Comprador",
        paymentMethod: method,
        cart: JSON.stringify(items).slice(0, 500),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("checkout POST error:", error);
    return NextResponse.json(
      { error: "No se pudo iniciar el pago. Intenta de nuevo." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 400 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json({ paid: false }, { status: 503 });
  }

  try {
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      paid: checkoutSession.payment_status === "paid",
      status: checkoutSession.payment_status,
    });
  } catch (error) {
    console.error("checkout GET error:", error);
    return NextResponse.json({ error: "No se pudo verificar el pago" }, { status: 500 });
  }
}
