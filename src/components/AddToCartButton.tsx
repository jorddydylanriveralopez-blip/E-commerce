"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import type { ServiceListing } from "@/lib/types";
import { addToCart, getCartItems, CART_UPDATED_EVENT } from "@/lib/cart";
import { useCart } from "@/components/CartProvider";

interface AddToCartButtonProps {
  listing: ServiceListing;
}

export function AddToCartButton({ listing }: AddToCartButtonProps) {
  const [inCart, setInCart] = useState(false);
  const { openCart } = useCart();

  useEffect(() => {
    function sync() {
      setInCart(getCartItems().some((item) => item.id === listing.id));
    }
    sync();
    window.addEventListener(CART_UPDATED_EVENT, sync);
    return () => window.removeEventListener(CART_UPDATED_EVENT, sync);
  }, [listing.id]);

  if (inCart) {
    return (
      <button
        type="button"
        onClick={openCart}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-yaav-600 bg-yaav-50 px-4 py-3 text-xs font-display font-bold uppercase tracking-wider text-yaav-700 hover:bg-yaav-100 transition-colors"
      >
        <Check className="h-4 w-4" />
        Ver en mi carrito
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        addToCart(listing);
        openCart();
      }}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-yaavs-navy bg-yaavs-navy px-4 py-3 text-xs font-display font-bold uppercase tracking-wider text-white hover:bg-yaavs-navy-light transition-colors"
    >
      <ShoppingCart className="h-4 w-4" />
      Agregar al carrito
    </button>
  );
}
