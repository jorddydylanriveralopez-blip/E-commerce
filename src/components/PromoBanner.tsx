"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { yaavImages } from "@/lib/images";

const slides = [
  {
    id: "explorar",
    label: "Planes pospago y prepago Yaavs",
    href: "/explorar?categoria=servicios",
    image: yaavImages.bannerServicios,
    imageMobile: yaavImages.bannerServiciosMobile,
  },
  {
    id: "publicar",
    label: "Publica tu servicio de telefonía gratis",
    href: "/publicar",
    image: yaavImages.bannerPublicar,
    imageMobile: yaavImages.bannerPublicarMobile,
  },
  {
    id: "destacados",
    label: "Equipos, chips y accesorios",
    href: "/explorar?categoria=productos",
    image: yaavImages.bannerEquipos,
    imageMobile: yaavImages.bannerEquiposMobile,
  },
] as const;

function SlideDots({
  active,
  onSelect,
  compact = false,
}: {
  active: number;
  onSelect: (index: number) => void;
  compact?: boolean;
}) {
  return (
    <div className={`flex items-center ${compact ? "gap-1.5" : "gap-2"}`}>
      {slides.map((item, index) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(index)}
          className={
            compact
              ? "flex h-8 w-8 items-center justify-center"
              : "min-h-[44px] min-w-[44px] flex items-center justify-center p-3 md:min-h-0 md:min-w-0 md:p-0"
          }
          aria-label={`Ir al banner ${index + 1}`}
        >
          <span
            className={`block h-0.5 rounded-full transition-all ${
              index === active
                ? compact
                  ? "w-6 bg-white"
                  : "w-8 bg-white"
                : compact
                  ? "w-3 bg-white/45"
                  : "w-4 bg-white/50"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function PromoBanner() {
  const [active, setActive] = useState(0);
  const touchStart = useRef({ x: 0, y: 0 });

  const goTo = useCallback((index: number) => {
    setActive((index + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }

  function onTouchEnd(e: React.TouchEvent) {
    const dx = touchStart.current.x - e.changedTouches[0].clientX;
    const dy = touchStart.current.y - e.changedTouches[0].clientY;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    goTo(dx > 0 ? active + 1 : active - 1);
  }

  return (
    <section
      className="hero-banner relative w-full overflow-hidden bg-neutral-900"
      aria-label="Promociones"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="hero-banner-header-shade" aria-hidden />

      {/* ——— Móvil ——— */}
        <div className="hero-banner-frame md:hidden">
        {slides.map((item, index) => (
          <div
            key={`m-${item.id}`}
            className={`hero-banner-slide ${index === active ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <Image
              src={item.imageMobile}
              alt={item.label}
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              quality={index === 0 ? 80 : 70}
              className="hero-banner-media"
              sizes="100vw"
            />
            {index === active && (
              <Link href={item.href} className="absolute inset-0 z-[5]" aria-label={item.label} />
            )}
          </div>
        ))}

        <div className="hero-banner-mobile-foot absolute inset-x-0 bottom-0 z-30 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-10 pointer-events-none">
          <div className="pointer-events-auto flex flex-col items-center gap-2.5">
            <SlideDots active={active} onSelect={setActive} compact />
            <div className="flex w-full max-w-sm items-center justify-between">
              <span className="font-display text-[10px] text-white/75 tabular-nums tracking-wider drop-shadow-md">
                {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
              <Link
                href="#categorias"
                className="flex items-center gap-1 font-display text-[9px] uppercase tracking-[0.18em] text-white/70"
              >
                Explorar
                <ChevronDown className="h-3 w-3 animate-bounce" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ——— Desktop ——— */}
      <div className="hero-banner-frame hidden md:block">
        {slides.map((item, index) => (
          <div
            key={`d-${item.id}`}
            className={`hero-banner-slide ${index === active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
          >
            <Image
              src={item.image}
              alt={item.label}
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              quality={index === 0 ? 85 : 70}
              className="hero-banner-media"
              sizes="100vw"
            />
            {index === active && (
              <Link href={item.href} className="absolute inset-0 z-[5]" aria-label={item.label} />
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => goTo(active - 1)}
          className="absolute left-4 lg:left-6 top-1/2 z-40 -translate-y-1/2 p-2.5 text-white/90 hover:text-white bg-black/35 hover:bg-black/50 backdrop-blur-sm rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
          aria-label="Banner anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          className="absolute right-4 lg:right-6 top-1/2 z-40 -translate-y-1/2 p-2.5 text-white/90 hover:text-white bg-black/35 hover:bg-black/50 backdrop-blur-sm rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
          aria-label="Banner siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3">
          <span className="font-display text-xs text-white/80 tabular-nums drop-shadow-md">
            {String(active + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}
          </span>
          <SlideDots active={active} onSelect={setActive} />
        </div>

        <Link
          href="#categorias"
          className="absolute bottom-14 left-1/2 z-40 -translate-x-1/2 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors"
        >
          <span className="font-display text-[9px] uppercase tracking-[0.2em]">Explorar</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </Link>
      </div>
    </section>
  );
}
