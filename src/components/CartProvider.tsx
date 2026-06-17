"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { CART_UPDATED_EVENT, getCartCount } from "@/lib/cart";

type CartContextValue = {
  open: boolean;
  count: number;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  const syncCount = useCallback(() => {
    setCount(getCartCount());
  }, []);

  useEffect(() => {
    syncCount();
    window.addEventListener(CART_UPDATED_EVENT, syncCount);
    window.addEventListener("storage", syncCount);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCount);
      window.removeEventListener("storage", syncCount);
    };
  }, [syncCount]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const value: CartContextValue = {
    open,
    count,
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
