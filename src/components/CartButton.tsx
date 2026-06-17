"use client";

import { useCart } from "@/components/CartProvider";
import { ShoppingCart } from "lucide-react";

interface CartButtonProps {
  compact?: boolean;
}

export function CartButton({ compact = false }: CartButtonProps) {
  const { count, openCart } = useCart();
  const pulse = count === 0;

  return (
    <button
      type="button"
      onClick={openCart}
      className={`cart-btn group relative flex items-center justify-center rounded-full transition-colors ${
        compact
          ? "h-9 w-9 text-white/80 hover:text-white"
          : "h-10 w-10 min-h-[44px] min-w-[44px] text-white/80 hover:text-white"
      }`}
      aria-label={count > 0 ? `Carrito con ${count} productos` : "Ver mi carrito"}
      title="Mi carrito"
    >
      {pulse && <span className="cart-btn-ring" aria-hidden />}
      <span className={`cart-btn-icon ${pulse ? "cart-btn-icon--pulse" : ""}`}>
        <ShoppingCart className="h-5 w-5" strokeWidth={2} />
      </span>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-yaav-600 px-1 text-[10px] font-bold text-white ring-2 ring-yaavs-navy">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
