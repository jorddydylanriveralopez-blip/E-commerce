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
  width?: number;
  height?: number;
};

export function SectionBanner({
  variant = "explorar",
  image,
  imageAlt = "Banner de sección",
  width = 2400,
  height = 1029,
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
          width={width}
          height={height}
          priority
          sizes="100vw"
          className="section-banner__image"
        />
      ) : null}
    </section>
  );
}
