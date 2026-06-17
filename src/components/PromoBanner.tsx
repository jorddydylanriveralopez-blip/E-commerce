"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { yaavImages } from "@/lib/images";

const slides = [
  {
    id: "servicios",
    eyebrow: "Marketplace Yaavser",
    title: "Planes y activaciones cerca de ti",
    slogan: "Encuentra Yaavsers en todo México",
    cta: "Explorar servicios",
    href: "/explorar?categoria=servicios",
    image: yaavImages.bannerServicios,
    imageMobile: yaavImages.bannerServiciosMobile,
    bgPosition: "center center",
  },
  {
    id: "equipos",
    eyebrow: "Productos",
    title: "Equipos, chips y accesorios",
    slogan: "Compra con vendedores de tu ciudad",
    cta: "Ver productos",
    href: "/explorar?categoria=productos",
    image: yaavImages.bannerEquipos,
    imageMobile: yaavImages.bannerEquiposMobile,
    bgPosition: "center top",
  },
  {
    id: "publicar",
    eyebrow: "Gratis · Sin comisión",
    title: "Publica tu puesto en minutos",
    slogan: "Publica gratis · Sin comisión",
    cta: "Publicar ahora",
    href: "/publicar",
    image: yaavImages.bannerPublicar,
    imageMobile: yaavImages.bannerPublicarMobile,
    bgPosition: "center center",
  },
] as const;

function SlideDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="promo-carousel__dots">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          className="promo-carousel__dot-btn"
          aria-label={`Ir al banner ${index + 1}`}
        >
          <span
            className={`promo-carousel__dot ${index === active ? "promo-carousel__dot--active" : ""}`}
          />
        </button>
      ))}
    </div>
  );
}

function HeroSlide({
  slide,
  active,
  mobile = false,
}: {
  slide: (typeof slides)[number];
  active: boolean;
  mobile?: boolean;
}) {
  const src = mobile ? slide.imageMobile : slide.image;

  return (
    <div
      className={`promo-hero-slide ${active ? "promo-hero-slide--active" : ""}`}
      aria-hidden={!active}
    >
      <div
        className="promo-hero-slide__media"
        style={{
          backgroundImage: `url(${src})`,
          backgroundPosition: slide.bgPosition,
        }}
        aria-hidden
      />
      <div className="promo-hero-slide__shade" aria-hidden />
      <div className="promo-hero-slide__content">
        <p className="promo-hero-slide__eyebrow">{slide.eyebrow}</p>
        <h2 className="promo-hero-slide__title">{slide.title}</h2>
        <Link href={slide.href} className="promo-hero-slide__cta">
          {slide.cta}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <div className="promo-hero-slide__slogan-bar">
        <p className="promo-hero-slide__slogan">{slide.slogan}</p>
      </div>
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
    <div className="promo-carousel-wrap">
      <section
        className="promo-carousel"
        aria-label="Promociones"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="promo-carousel__frame">
          <div className="promo-hero-slide__desktop hidden md:block">
            {slides.map((slide, index) => (
              <HeroSlide key={slide.id} slide={slide} active={index === active} />
            ))}
          </div>
          <div className="promo-hero-slide__mobile md:hidden">
            <HeroSlide slide={slides[active]} active mobile />
          </div>

          <button
            type="button"
            onClick={() => goTo(active - 1)}
            className="promo-carousel__nav promo-carousel__nav--prev"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            className="promo-carousel__nav promo-carousel__nav--next"
            aria-label="Banner siguiente"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>

        <div className="promo-carousel__footer">
          <SlideDots count={slides.length} active={active} onSelect={goTo} />
        </div>

        <p className="sr-only" aria-live="polite">
          {slides[active].title}
        </p>
      </section>
    </div>
  );
}
