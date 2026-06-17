"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, MessageCircle, ShieldCheck } from "lucide-react";
import {
  type CartItem,
  getCartItems,
  getCartSubtotal,
  CART_UPDATED_EVENT,
} from "@/lib/cart";
import { formatPrice } from "@/lib/data";

export default function ComprarPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    function sync() {
      const next = getCartItems();
      setItems(next);
      if (next.length === 0) router.replace("/carrito");
    }
    sync();
    window.addEventListener(CART_UPDATED_EVENT, sync);
    return () => window.removeEventListener(CART_UPDATED_EVENT, sync);
  }, [router]);

  const subtotal = getCartSubtotal(items);
  const hasNegotiable = items.some((item) => item.priceType === "negociable");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/carrito"
        className="inline-flex items-center gap-2 text-sm font-medium text-yaav-600 hover:text-yaav-800 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al carrito
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yaav-600 text-white">
          <CreditCard className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900">
            Comprar
          </h1>
          <p className="text-sm text-neutral-500">
            Revisa tu pedido y confirma con el Yaavser
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <ul className="divide-y divide-neutral-100">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                <Image src={item.image} alt={item.title} fill className="object-cover" sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-xs font-bold uppercase tracking-wide text-neutral-900 line-clamp-2">
                  {item.title}
                </p>
                <p className="mt-1 text-sm font-semibold text-yaav-600">
                  {formatPrice(item.price, item.priceType)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Subtotal estimado</span>
            <span className="font-display font-bold text-neutral-900">
              {subtotal > 0 ? formatPrice(subtotal, "fijo") : "Por confirmar"}
            </span>
          </div>
          {hasNegotiable && (
            <p className="text-xs text-neutral-500">
              Algunos precios son negociables — el Yaavser te confirmará el total final.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-yaav-200 bg-yaav-50 p-4 flex gap-3">
        <ShieldCheck className="h-5 w-5 text-yaav-600 shrink-0 mt-0.5" />
        <p className="text-sm text-neutral-700 leading-relaxed">
          Al confirmar, te pondremos en contacto con cada Yaavser por WhatsApp para cerrar tu compra de forma segura.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Link href="/entrar" className="btn-premium w-full justify-center text-xs">
          <MessageCircle className="h-4 w-4" />
          Confirmar y contactar vendedor
        </Link>
        <Link
          href="/explorar?categoria=productos"
          className="text-center text-xs font-display font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 py-3 transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
