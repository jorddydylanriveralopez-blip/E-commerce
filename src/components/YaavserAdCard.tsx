import { MapPin, Megaphone } from "lucide-react";
import { YaavserAd } from "@/lib/types";
import { getYaavserAdTypeLabel } from "@/lib/comunidad";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface YaavserAdCardProps {
  ad: YaavserAd;
}

export function YaavserAdCard({ ad }: YaavserAdCardProps) {
  const waUrl = buildWhatsAppUrl(
    ad.whatsapp,
    `Hola ${ad.authorName}, vi tu anuncio en Yaavstore Comunidad: "${ad.title}"`
  );

  return (
    <article className="flex flex-col bg-white border border-neutral-200 hover:border-neutral-300 transition-colors">
      <div className="p-4 sm:p-5 flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.15em] text-yaav-400">
            {getYaavserAdTypeLabel(ad.type)}
          </span>
          {ad.featured && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-neutral-500">
              <Megaphone className="h-3 w-3" />
              Destacado
            </span>
          )}
        </div>

        <h3 className="font-display font-bold uppercase text-neutral-900 text-sm sm:text-base leading-snug tracking-tight line-clamp-2">
          {ad.title}
        </h3>

        <p className="mt-3 text-sm text-neutral-600 leading-relaxed line-clamp-3">{ad.message}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
          <span className="text-neutral-700">{ad.authorName}</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            {ad.location}
          </span>
        </div>
      </div>

      <div className="border-t border-neutral-200 p-4 sm:px-5 flex items-center justify-between gap-3">
        <time className="text-[10px] uppercase tracking-wider text-neutral-400">
          {new Date(ad.createdAt).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
          })}
        </time>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-yaavs-navy hover:text-yaav-600 transition-colors"
        >
          Contactar
        </a>
      </div>
    </article>
  );
}
