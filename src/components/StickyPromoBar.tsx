"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "yaavstore-sticky-promo-dismissed";

export function StickyPromoBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm safe-bottom">
      <div className="flex items-start gap-3 bg-white border border-neutral-200 px-4 py-3 shadow-lg">
        <div className="flex-1 min-w-0">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
            ¿Eres nuevo aquí?
          </p>
          <p className="text-xs sm:text-sm text-neutral-700 mt-0.5 leading-snug">
            Publica tu primer servicio <strong className="font-semibold">gratis</strong> — sin comisión
          </p>
          <Link
            href="/publicar"
            className="inline-block mt-2 text-xs font-display font-bold uppercase tracking-wider text-yaavs-navy underline underline-offset-2 hover:no-underline"
          >
            Empezar →
          </Link>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 p-1 text-neutral-400 hover:text-neutral-900 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
