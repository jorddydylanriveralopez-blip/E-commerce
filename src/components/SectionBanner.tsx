import Image from "next/image";

export type SectionBannerVariant =
  | "productos"
  | "servicios"
  | "explorar"
  | "comunidad"
  | "publicar"
  | "carrito"
  | "comprar"
  | "detalle";

const VARIANT_META: Record<
  SectionBannerVariant,
  { icon: string; label: string }
> = {
  explorar: { icon: "🔍", label: "Marketplace" },
  productos: { icon: "📱", label: "Productos" },
  servicios: { icon: "📡", label: "Servicios" },
  comunidad: { icon: "🤝", label: "Comunidad Yaavser" },
  publicar: { icon: "✨", label: "Publicar" },
  carrito: { icon: "🛒", label: "Carrito" },
  comprar: { icon: "💳", label: "Comprar" },
  detalle: { icon: "📋", label: "Detalle" },
};

type SectionBannerProps = {
  variant?: SectionBannerVariant;
  title: string;
  subtitle?: string;
  /** Solo para detalle de producto — foto real del anuncio */
  image?: string;
  imageAlt?: string;
};

export function SectionBanner({
  variant = "explorar",
  title,
  subtitle,
  image,
  imageAlt = "Banner",
}: SectionBannerProps) {
  const meta = VARIANT_META[variant];
  const showProductImage = variant === "detalle" && image;

  if (showProductImage) {
    return (
      <section className="section-banner section-banner--detalle" aria-label={imageAlt}>
        <div className="section-banner__media section-banner__media--product">
          <Image
            src={image}
            alt=""
            width={1200}
            height={600}
            sizes="100vw"
            className="section-banner__image"
          />
          <div className="section-banner__shade section-banner__shade--product" aria-hidden />
        </div>
        <div className="section-banner__caption">
          <span className="section-banner__eyebrow">{meta.label}</span>
          <p className="section-banner__caption-title">{title}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`section-banner section-banner--brand section-banner--${variant}`}
      aria-label={title}
    >
      <div className="section-banner__pattern" aria-hidden />
      <div className="section-banner__inner mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
        <span className="section-banner__eyebrow">
          <span aria-hidden>{meta.icon}</span> {meta.label}
        </span>
        <h1 className="section-banner__title">{title}</h1>
        {subtitle ? <p className="section-banner__subtitle">{subtitle}</p> : null}
      </div>
    </section>
  );
}
