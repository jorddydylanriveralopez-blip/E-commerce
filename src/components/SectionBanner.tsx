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

type SectionBannerProps = {
  variant?: SectionBannerVariant;
  image?: string;
  imageAlt?: string;
};

export function SectionBanner({
  variant = "explorar",
  image,
  imageAlt = "Banner de sección",
}: SectionBannerProps) {
  return (
    <section
      className={`section-banner section-banner--${variant}`}
      aria-label={imageAlt}
    >
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="section-banner__image"
        />
      ) : null}
      <div className="section-banner__overlay" aria-hidden />
    </section>
  );
}
