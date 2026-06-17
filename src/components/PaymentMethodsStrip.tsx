import { PAYMENT_BRANDS } from "@/lib/payments";

export function PaymentMethodsStrip({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${compact ? "" : "justify-center"}`}
      aria-label="Formas de pago aceptadas"
    >
      {!compact && (
        <span className="text-[10px] font-display font-bold uppercase tracking-[0.14em] text-neutral-500 mr-1">
          Pagos seguros
        </span>
      )}
      {PAYMENT_BRANDS.map((brand) => (
        <span
          key={brand}
          className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-[10px] font-display font-bold uppercase tracking-wider text-neutral-600"
        >
          {brand}
        </span>
      ))}
    </div>
  );
}
