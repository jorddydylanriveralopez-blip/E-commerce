import type { ServiceListing } from "@/lib/types";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  priceType: ServiceListing["priceType"];
  image: string;
  addedAt: string;
};

const STORAGE_KEY = "yaavstore-cart";
export const CART_UPDATED_EVENT = "yaavstore:cart-updated";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function getCartItems(): CartItem[] {
  return readCart();
}

export function getCartCount(): number {
  return readCart().length;
}

export function addToCart(listing: ServiceListing) {
  const items = readCart();
  if (items.some((item) => item.id === listing.id)) return;
  items.push({
    id: listing.id,
    title: listing.title,
    price: listing.price,
    priceType: listing.priceType,
    image: listing.image,
    addedAt: new Date().toISOString(),
  });
  writeCart(items);
}

export function removeFromCart(id: string) {
  writeCart(readCart().filter((item) => item.id !== id));
}

export function clearCart() {
  writeCart([]);
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    if (item.priceType === "negociable") return sum;
    return sum + item.price;
  }, 0);
}
