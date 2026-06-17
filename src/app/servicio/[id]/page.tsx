import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Eye,
  MapPin,
  Star,
} from "lucide-react";
import { ContactActions } from "@/components/ContactActions";
import { AddToCartButton } from "@/components/AddToCartButton";
import { SectionBanner } from "@/components/SectionBanner";
import {
  getListingById,
  formatPrice,
  getCategoryLabel,
  listings,
} from "@/lib/data";
import { ServiceCard } from "@/components/ServiceCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) return { title: "Servicio no encontrado" };
  return {
    title: `${listing.title} — Yaavstore`,
    description: listing.description,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) notFound();

  const related = listings
    .filter((l) => l.category === listing.category && l.id !== listing.id)
    .slice(0, 3);

  const priceLabel = formatPrice(listing.price, listing.priceType);

  return (
    <>
      <SectionBanner
        variant={listing.category === "productos" ? "productos" : "servicios"}
        image={listing.image}
        imageAlt={listing.title}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        href="/explorar"
        className="inline-flex items-center gap-2 text-sm font-medium text-yaav-600 hover:text-yaav-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a explorar
      </Link>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <div
            className="relative overflow-hidden rounded-lg border-2 border-yaav-950 bg-stone-200 shadow-[4px_4px_0_#1c1917]"
            style={{ aspectRatio: "16 / 10" }}
          >
            <Image
              src={listing.image}
              alt={listing.title}
              width={1200}
              height={750}
              className="h-full w-full object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
          {listing.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {listing.images.map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-md border-2 border-yaav-950 bg-stone-200"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <Image src={img} alt="" width={150} height={150} className="h-full w-full object-cover" sizes="150px" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-6">
            <div>
              <span className="font-display text-xs font-bold uppercase tracking-wider text-yaav-600">
                {getCategoryLabel(listing.category)}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-yaav-950 mt-1">
                {listing.title}
              </h1>
              <p className="sticker-price inline-block rounded-sm px-3 py-1 text-xl sm:text-2xl font-display font-bold mt-3">
                {priceLabel}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {listing.tags.map((tag) => (
                <span
                  key={tag}
                  className="badge-bait-yellow rounded-sm px-2 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {listing.views} vistas
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Publicado {new Date(listing.createdAt).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="rounded-lg border-2 border-yaav-950 bg-white p-5 shadow-[3px_3px_0_#1c1917]">
              <div className="flex items-center gap-4">
                <Image
                  src={listing.provider.avatar}
                  alt={listing.provider.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 shrink-0 rounded-md border-2 border-yaav-950 object-cover"
                  sizes="56px"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold uppercase text-yaav-950">
                      {listing.provider.name}
                    </span>
                    {listing.provider.verified && (
                      <BadgeCheck className="h-4 w-4 text-yaav-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {listing.provider.rating} ({listing.provider.reviewCount} reseñas)
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {listing.provider.location}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted leading-relaxed">
                {listing.provider.bio}
              </p>
            </div>

            <AddToCartButton listing={listing} />

            <ContactActions
              listingId={listing.id}
              providerName={listing.provider.name}
              providerWhatsapp={listing.provider.whatsapp}
              serviceTitle={listing.title}
              priceLabel={priceLabel}
            />
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-lg border-2 border-yaav-950 bg-white p-6 sm:p-8 shadow-[4px_4px_0_rgba(28,25,23,0.08)]">
        <h2 className="font-display text-xl font-bold uppercase tracking-tight text-yaav-950 mb-4">
          Descripción del servicio
        </h2>
        <p className="text-muted leading-relaxed whitespace-pre-line">
          {listing.description}
        </p>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-yaav-950 mb-6">
            Servicios similares
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((item) => (
              <ServiceCard key={item.id} listing={item} variant="compact" />
            ))}
          </div>
        </section>
      )}
    </div>
    </>
  );
}
