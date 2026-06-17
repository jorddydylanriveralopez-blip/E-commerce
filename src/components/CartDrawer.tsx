"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import {
  type CartItem,
  getCartItems,
  CART_UPDATED_EVENT,
  removeFromCart,
} from "@/lib/cart";
import { formatPrice } from "@/lib/data";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    function sync() {
      setItems(getCartItems());
    }
    sync();
    window.addEventListener(CART_UPDATED_EVENT, sync);
    return () => window.removeEventListener(CART_UPDATED_EVENT, sync);
  }, []);

  useEffect(() => {
    if (open) setItems(getCartItems());
  }, [open]);

  return (
    <>
      <div
        className={`cart-drawer-backdrop ${open ? "cart-drawer-backdrop--open" : ""}`}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={`cart-drawer ${open ? "cart-drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        aria-hidden={!open}
      >
        <div className="cart-drawer-header">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yaavs-navy text-white">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="cart-drawer-title"
                className="font-display text-sm font-bold uppercase tracking-wider text-neutral-900"
              >
                Tu carrito
              </h2>
              <p className="text-xs text-neutral-500">
                {items.length === 0
                  ? "Sin productos aún"
                  : `${items.length} producto${items.length === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <ShoppingBag className="h-12 w-12 text-neutral-200" />
              <p className="mt-4 font-display text-sm font-bold uppercase tracking-wide text-neutral-700">
                Carrito vacío
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Agrega planes, chips o equipos para verlos aquí.
              </p>
              <Link
                href="/explorar?categoria=productos"
                onClick={onClose}
                className="btn-premium inline-flex mt-6 text-xs"
              >
                Explorar productos
              </Link>
            </div>
          ) : (
            <ul className="space-y-3 p-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/servicio/${item.id}`}
                      onClick={onClose}
                      className="font-display text-xs font-bold uppercase tracking-wide text-neutral-900 hover:text-yaav-600 line-clamp-2"
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
                    className="shrink-0 self-start p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                    aria-label={`Quitar ${item.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <Link
              href="/carrito"
              onClick={onClose}
              className="btn-outline-urban w-full justify-center text-xs"
            >
              Ver carrito completo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/comprar"
              onClick={onClose}
              className="btn-premium w-full justify-center text-xs"
            >
              Ir a comprar
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
