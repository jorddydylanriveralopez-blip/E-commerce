"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Gift } from "lucide-react";
import { yaavImages } from "@/lib/images";

export const FATHERS_DAY_EVENT = "yaavstore:fathers-day-dismissed";

export function FathersDayPromo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setOpen(false);
    window.dispatchEvent(new Event(FATHERS_DAY_EVENT));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 safe-bottom">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={dismiss} aria-hidden />

      <div
        className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl border border-neutral-200"
        role="dialog"
        aria-labelledby="fathers-day-title"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 z-10 p-2 text-white/90 hover:text-white bg-black/30 hover:bg-black/50 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative h-44 sm:h-52">
          <Image
            src={yaavImages.bannerServicios}
            alt=""
            width={800}
            height={400}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 hero-banner-overlay" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-flex items-center gap-1.5 bg-yaav-600 text-white px-2.5 py-1 text-[10px] font-display font-bold uppercase tracking-[0.15em]">
              <Gift className="h-3 w-3" />
              Día del Padre
            </span>
          </div>
        </div>

        <div className="px-6 sm:px-8 py-6 sm:py-8 text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-yaav-600">
            Promoción especial
          </p>
          <h2
            id="fathers-day-title"
            className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900 mt-2"
          >
            ¡Feliz Día del Padre!
          </h2>
          <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
            Regálale conexión: planes prepago, equipos y chips con ofertas de Yaavsers en tu zona.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/explorar?categoria=servicios" className="btn-premium" onClick={dismiss}>
              Ver promociones
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex items-center justify-center px-6 py-3 text-xs font-display font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
