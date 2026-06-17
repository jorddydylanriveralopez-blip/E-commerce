"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import {
  type CartItem,
  clearCart,
  getCartItems,
  CART_UPDATED_EVENT,
  removeFromCart,
} from "@/lib/cart";
import { formatPrice } from "@/lib/data";

export default function CarritoPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    function sync() {
      setItems(getCartItems());
    }
    sync();
    window.addEventListener(CART_UPDATED_EVENT, sync);
    return () => window.removeEventListener(CART_UPDATED_EVENT, sync);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/explorar"
        className="inline-flex items-center gap-2 text-sm font-medium text-yaav-600 hover:text-yaav-800 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Seguir explorando
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yaavs-navy text-white">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900">
            Mi carrito
          </h1>
          <p className="text-sm text-neutral-500">
            {items.length === 0
              ? "Aquí verás los productos que guardes"
              : `${items.length} producto${items.length === 1 ? "" : "s"} guardado${items.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
          <ShoppingBag className="mx-auto h-12 w-12 text-neutral-300" />
          <p className="mt-4 text-neutral-600">Tu carrito está vacío por ahora.</p>
          <p className="mt-1 text-sm text-neutral-400">
            Explora productos y agrégalos para verlos aquí.
          </p>
          <Link href="/explorar?categoria=productos" className="btn-premium inline-flex mt-6">
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/servicio/${item.id}`}
                    className="font-display text-sm font-bold uppercase tracking-wide text-neutral-900 hover:text-yaav-600 line-clamp-2"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-1 text-sm font-semibold text-yaav-600">
                    {formatPrice(item.price, item.priceType)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="shrink-0 self-start p-2 text-neutral-400 hover:text-red-600 transition-colors"
                  aria-label={`Quitar ${item.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/explorar?categoria=productos" className="btn-outline-urban flex-1 text-center">
              Agregar más
            </Link>
            <Link href="/comprar" className="btn-premium flex-1 text-center justify-center">
              Ir a comprar
            </Link>
          </div>
          <button
            type="button"
            onClick={() => clearCart()}
            className="w-full px-6 py-3 text-xs font-display font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Vaciar carrito
          </button>
        </div>
      )}
    </div>
  );
}
