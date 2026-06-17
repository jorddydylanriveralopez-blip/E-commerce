"use client";

import { CreditCard, MessageCircle, Store, Wallet } from "lucide-react";
import type { PaymentMethodId } from "@/lib/payments";
import { PAYMENT_METHODS } from "@/lib/payments";

const ICONS: Record<PaymentMethodId, React.ComponentType<{ className?: string }>> = {
  card: CreditCard,
  oxxo: Store,
  spei: Wallet,
  whatsapp: MessageCircle,
};

type PaymentMethodPickerProps = {
  value: PaymentMethodId;
  onChange: (id: PaymentMethodId) => void;
  stripeEnabled: boolean;
  onlineAvailable: boolean;
};

export function PaymentMethodPicker({
  value,
  onChange,
  stripeEnabled,
  onlineAvailable,
}: PaymentMethodPickerProps) {
  return (
    <div className="space-y-2">
      <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-neutral-700">
        Forma de pago
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {PAYMENT_METHODS.map((method) => {
          const Icon = ICONS[method.id];
          const isOnline = method.online;
          const disabled =
            isOnline && (!stripeEnabled || !onlineAvailable);
          const selected = value === method.id;

          return (
            <button
              key={method.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(method.id)}
              className={`relative flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                selected
                  ? "border-yaav-600 bg-yaav-50/80 ring-2 ring-yaav-600/25"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              } ${disabled ? "opacity-45 cursor-not-allowed" : ""}`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  selected ? "bg-yaav-600 text-white" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="font-display text-xs font-bold uppercase tracking-wide text-neutral-900">
                    {method.label}
                  </span>
                  {method.badge && (
                    <span className="rounded-sm bg-yaav-600 px-1 py-px text-[8px] font-bold uppercase text-white">
                      {method.badge}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-neutral-500">
                  {method.description}
                </span>
                {isOnline && !stripeEnabled && (
                  <span className="mt-1 block text-[10px] text-amber-700">
                    Pasarela en configuración
                  </span>
                )}
                {isOnline && stripeEnabled && !onlineAvailable && (
                  <span className="mt-1 block text-[10px] text-amber-700">
                    Requiere precio fijo en todos los artículos
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
