import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, BadgeCheck, Eye } from "lucide-react";
import { ServiceListing } from "@/lib/types";
import { formatPrice, getCategoryLabel } from "@/lib/data";

interface ServiceCardProps {
  listing: ServiceListing;
  variant?: "default" | "compact";
}

export function ServiceCard({ listing, variant = "default" }: ServiceCardProps) {
  return (
    <Link
      href={`/servicio/${listing.id}`}
      className="group block product-card overflow-hidden rounded-2xl"
    >
      <div className="relative overflow-hidden bg-neutral-100 rounded-t-2xl" style={{ aspectRatio: "4 / 3" }}>
        <Image
          src={listing.image}
          alt={listing.title}
          width={800}
          height={600}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {listing.featured && (
          <span className="absolute top-3 left-3 badge-bait-pink px-2 py-1 text-[10px]">
            Top
          </span>
        )}
      </div>

      <div className={variant === "compact" ? "p-3" : "p-4"}>
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
          {getCategoryLabel(listing.category)}
        </span>

        <h3 className="font-display font-bold uppercase text-neutral-900 line-clamp-2 group-hover:text-yaavs-navy transition-colors mt-1 text-sm sm:text-base leading-snug tracking-tight">
          {listing.title}
        </h3>

        <p className="mt-2 font-display text-sm font-bold text-neutral-900">
          {formatPrice(listing.price, listing.priceType)}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <Image
            src={listing.provider.avatar}
            alt={listing.provider.name}
            width={32}
            height={32}
            className="h-7 w-7 shrink-0 rounded-full object-cover"
            sizes="32px"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-xs text-neutral-600 truncate">{listing.provider.name}</span>
              {listing.provider.verified && (
                <BadgeCheck className="h-3 w-3 shrink-0 text-neutral-400" />
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-neutral-500">
              <span className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-yaav-500 text-yaav-500" />
                {listing.provider.rating}
              </span>
              <span className="flex items-center gap-0.5 truncate">
                <MapPin className="h-3 w-3 shrink-0" />
                {listing.provider.location}
              </span>
            </div>
          </div>
        </div>

        {variant === "default" && (
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {listing.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[9px] uppercase tracking-wider text-neutral-500 border border-neutral-300 px-1.5 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
            <span className="flex items-center gap-0.5 text-[10px] text-neutral-600 shrink-0">
              <Eye className="h-3 w-3" />
              {listing.views}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
