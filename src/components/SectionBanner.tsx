import Image from "next/image";
import type { ReactNode } from "react";

export type SectionBannerVariant =
  | "productos"
  | "servicios"
  | "explorar"
  | "comunidad"
  | "publicar"
  | "carrito"
  | "comprar"
  | "detalle";

type SectionBannerProps = {
  variant?: SectionBannerVariant;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  stat?: string;
  image?: string;
  imageAlt?: string;
};

export function SectionBanner({
  variant = "explorar",
  eyebrow,
  title,
  subtitle,
  icon,
  stat,
  image,
  imageAlt = "",
}: SectionBannerProps) {
  return (
    <section
      className={`section-banner section-banner--${variant}`}
      aria-labelledby="section-banner-title"
    >
      {image ? (
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="section-banner__image"
        />
      ) : null}

      <div className="section-banner__mesh" aria-hidden />
      <div className="section-banner__glow" aria-hidden />
      <div className="section-banner__accent" aria-hidden />

      <div className="section-banner__inner">
        <div className="section-banner__content">
          {eyebrow ? (
            <p className="section-banner__eyebrow">
              {icon ? <span className="section-banner__icon">{icon}</span> : null}
              {eyebrow}
            </p>
          ) : icon ? (
            <span className="section-banner__icon section-banner__icon--solo">{icon}</span>
          ) : null}

          <h1 id="section-banner-title" className="section-banner__title">
            {title}
          </h1>

          {subtitle ? <p className="section-banner__subtitle">{subtitle}</p> : null}

          {stat ? <p className="section-banner__stat">{stat}</p> : null}
        </div>
      </div>
    </section>
  );
}
