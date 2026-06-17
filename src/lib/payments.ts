export type PaymentMethodId = "card" | "oxxo" | "spei" | "whatsapp";

export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  description: string;
  badge?: string;
  online: boolean;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "card",
    label: "Tarjeta",
    description: "Visa, Mastercard, Amex y débito",
    online: true,
  },
  {
    id: "oxxo",
    label: "OXXO",
    description: "Paga en efectivo con referencia",
    online: true,
  },
  {
    id: "spei",
    label: "Transferencia SPEI",
    description: "Transferencia bancaria instantánea",
    online: true,
  },
  {
    id: "whatsapp",
    label: "Coordinar con el Yaavser",
    description: "Cierra por WhatsApp sin cobro en línea",
    badge: "Gratis",
    online: false,
  },
];

export const PAYMENT_BRANDS = [
  "Visa",
  "Mastercard",
  "Amex",
  "OXXO",
  "SPEI",
] as const;

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()
  );
}

export function stripePaymentTypes(
  method: PaymentMethodId
): ("card" | "oxxo")[] {
  if (method === "oxxo") return ["oxxo"];
  if (method === "spei") return ["card"];
  return ["card"];
}

/** SPEI en Checkout usa flujo de tarjeta + instrucciones según cuenta Stripe MX */
export function paymentMethodLabel(method: PaymentMethodId): string {
  return PAYMENT_METHODS.find((m) => m.id === method)?.label ?? method;
}
