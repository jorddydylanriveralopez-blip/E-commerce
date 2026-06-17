import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { yaavImages } from "@/lib/images";

export type SectionBannerVariant =
  | "productos"
  | "servicios"
  | "explorar"
  | "comunidad"
  | "publicar"
  | "carrito"
  | "comprar"
  | "detalle"
  | "perfil"
  | "perfil-compras"
  | "perfil-ventas";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

const VARIANT_META: Record<
  SectionBannerVariant,
  { icon: string; label: string; image: string }
> = {
  explorar: { icon: "🔍", label: "Marketplace", image: yaavImages.bannerEquipos },
  productos: { icon: "📱", label: "Productos", image: yaavImages.bannerEquipos },
  servicios: { icon: "📡", label: "Servicios", image: yaavImages.bannerServicios },
  comunidad: { icon: "🤝", label: "Comunidad Yaavser", image: yaavImages.bannerPublicar },
  publicar: { icon: "✨", label: "Publicar", image: yaavImages.bannerPublicar },
  carrito: { icon: "🛒", label: "Carrito", image: yaavImages.bannerEquipos },
  comprar: { icon: "💳", label: "Comprar", image: yaavImages.bannerEquipos },
  detalle: { icon: "📋", label: "Detalle", image: yaavImages.bannerEquipos },
  perfil: { icon: "👤", label: "Mi cuenta", image: yaavImages.bannerServicios },
  "perfil-compras": { icon: "🛍️", label: "Mis compras", image: yaavImages.bannerEquipos },
  "perfil-ventas": { icon: "📦", label: "Mis ventas", image: yaavImages.bannerServicios },
};

const DEFAULT_BREADCRUMBS: Record<SectionBannerVariant, BreadcrumbItem[]> = {
  explorar: [
    { label: "Inicio", href: "/" },
    { label: "Explorar" },
  ],
  productos: [
    { label: "Inicio", href: "/" },
    { label: "Explorar", href: "/explorar" },
    { label: "Productos" },
  ],
  servicios: [
    { label: "Inicio", href: "/" },
    { label: "Explorar", href: "/explorar" },
    { label: "Servicios" },
  ],
  comunidad: [
    { label: "Inicio", href: "/" },
    { label: "Comunidad" },
  ],
  publicar: [
    { label: "Inicio", href: "/" },
    { label: "Publicar" },
  ],
  carrito: [
    { label: "Inicio", href: "/" },
    { label: "Carrito" },
  ],
  comprar: [
    { label: "Inicio", href: "/" },
    { label: "Carrito", href: "/carrito" },
    { label: "Comprar" },
  ],
  detalle: [
    { label: "Inicio", href: "/" },
    { label: "Explorar", href: "/explorar" },
    { label: "Detalle" },
  ],
  perfil: [
    { label: "Inicio", href: "/" },
    { label: "Mi perfil" },
  ],
  "perfil-compras": [
    { label: "Inicio", href: "/" },
    { label: "Mi perfil", href: "/perfil" },
    { label: "Mis compras" },
  ],
  "perfil-ventas": [
    { label: "Inicio", href: "/" },
    { label: "Mi perfil", href: "/perfil" },
    { label: "Mis ventas" },
  ],
};

type SectionBannerProps = {
  variant?: SectionBannerVariant;
  title: string;
  subtitle?: string;
  /** Foto de fondo — en detalle suele ser la del anuncio */
  image?: string;
  imageAlt?: string;
  breadcrumbs?: BreadcrumbItem[];
};

export function SectionBanner({
  variant = "explorar",
  title,
  subtitle,
  image,
  imageAlt,
  breadcrumbs,
}: SectionBannerProps) {
  const meta = VARIANT_META[variant];
  const bgImage = image ?? meta.image;
  const crumbs = breadcrumbs ?? DEFAULT_BREADCRUMBS[variant];
  const ariaLabel = imageAlt ?? title;

  return (
    <section
      className={`section-banner section-banner--hero section-banner--${variant}`}
      aria-label={ariaLabel}
    >
      <div className="section-banner__media">
        <Image
          src={bgImage}
          alt=""
          width={1600}
          height={640}
          sizes="100vw"
          priority={variant === "detalle"}
          className="section-banner__image"
        />
        <div className="section-banner__shade" aria-hidden />
      </div>

      <div className="section-banner__content">
        <nav className="section-banner__breadcrumbs" aria-label="Ubicación en el sitio">
          <ol className="section-banner__breadcrumb-list">
            {crumbs.map((item, index) => {
              const isLast = index === crumbs.length - 1;
              return (
                <li key={`${item.label}-${index}`} className="section-banner__breadcrumb-item">
                  {index > 0 && (
                    <ChevronRight
                      className="section-banner__breadcrumb-sep"
                      aria-hidden
                    />
                  )}
                  {item.href && !isLast ? (
                    <Link href={item.href} className="section-banner__breadcrumb-link">
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={
                        isLast
                          ? "section-banner__breadcrumb-current"
                          : "section-banner__breadcrumb-text"
                      }
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="section-banner__caption">
          <span className="section-banner__eyebrow">
            <span aria-hidden>{meta.icon}</span> {meta.label}
          </span>
          <h1 className="section-banner__title">{title}</h1>
          {subtitle ? <p className="section-banner__subtitle">{subtitle}</p> : null}
        </div>
      </div>
    </section>
  );
}
