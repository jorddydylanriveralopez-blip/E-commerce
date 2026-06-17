import Link from "next/link";
import type { CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { yaavImages } from "@/lib/images";

const showcaseTiles = [
  {
    id: "servicios",
    title: "Servicios",
    subtitle: "Planes, activaciones y chips",
    label: "Ver servicios",
    href: "/explorar?categoria=servicios",
    image: yaavImages.bannerServicios,
    imageMobile: yaavImages.bannerServiciosMobile,
    bgPosition: "center center",
  },
  {
    id: "productos",
    title: "Productos",
    subtitle: "Equipos y accesorios",
    label: "Ver productos",
    href: "/explorar?categoria=productos",
    image: yaavImages.bannerEquipos,
    imageMobile: yaavImages.bannerEquiposMobile,
    bgPosition: "center top",
  },
] as const;

function ShowcaseTile({
  tile,
}: {
  tile: (typeof showcaseTiles)[number];
}) {
  return (
    <Link
      href={tile.href}
      className="category-showcase__tile group"
      style={
        {
          "--tile-image": `url(${tile.image})`,
          "--tile-image-mobile": `url(${tile.imageMobile})`,
          "--tile-position": tile.bgPosition,
        } as CSSProperties
      }
    >
      <div className="category-showcase__shade" aria-hidden />
      <div className="category-showcase__caption">
        <span className="category-showcase__title">{tile.title}</span>
        <span className="category-showcase__subtitle">{tile.subtitle}</span>
        <span className="category-showcase__btn">{tile.label}</span>
      </div>
    </Link>
  );
}

function ShowcasePicker() {
  return (
    <div className="category-showcase__picker" role="presentation" aria-hidden>
      <ChevronLeft className="category-showcase__picker-arrow category-showcase__picker-arrow--left" />
      <div className="category-showcase__picker-badge">
        <span className="category-showcase__picker-text">Elige algo</span>
      </div>
      <ChevronRight className="category-showcase__picker-arrow category-showcase__picker-arrow--right" />
    </div>
  );
}

export function CategoryGrid() {
  const [left, right] = showcaseTiles;

  return (
    <div className="category-showcase">
      <p className="category-showcase__intro">¿Qué buscas hoy?</p>
      <div className="category-showcase__grid">
        <ShowcaseTile tile={left} />
        <ShowcasePicker />
        <ShowcaseTile tile={right} />
      </div>
      <p className="category-showcase__tagline">Encuentra Yaavsers cerca de ti</p>
    </div>
  );
}
