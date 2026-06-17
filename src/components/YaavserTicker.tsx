"use client";

import Link from "next/link";
import { Megaphone, Sparkles } from "lucide-react";
import { getFeaturedYaavserAds } from "@/lib/yaavser-ads";

const ads = getFeaturedYaavserAds();

const typeLabels: Record<string, string> = {
  busco_distribuidor: "Busco",
  ofrezco_servicios: "Ofrezco",
  colaboracion: "Colaboro",
  promocion: "Promo",
  otro: "Anuncio",
};

function MarqueeItem({ authorName, title, type }: { authorName: string; title: string; type: string }) {
  return (
    <Link href="/comunidad" className="yaav-marquee-item group">
      <span className="yaav-marquee-chip">{typeLabels[type] ?? "Yaavser"}</span>
      <span className="yaav-marquee-author">{authorName}</span>
      <span className="yaav-marquee-dot" aria-hidden>
        ◆
      </span>
      <span className="yaav-marquee-title">{title}</span>
      <span className="yaav-marquee-cta group-hover:opacity-100">Ver</span>
    </Link>
  );
}

export function YaavserTicker({ light = false }: { light?: boolean }) {
  if (ads.length === 0) return null;

  const loop = [...ads, ...ads];

  return (
    <div className={`yaav-marquee-wrap flex flex-1 min-w-0 items-center gap-2.5 lg:gap-3 ${light ? "yaav-marquee-wrap--light" : ""}`}>
      <Link
        href="/comunidad"
        className="yaav-marquee-badge shrink-0"
        title="Anúnciate gratis entre Yaavsers"
      >
        <Megaphone className="h-3 w-3" aria-hidden />
        <span>Gratis</span>
        <span className="yaav-marquee-badge-ping" aria-hidden />
      </Link>

      <div className="yaav-marquee-viewport flex-1 min-w-0">
        <div className="yaav-marquee-fade yaav-marquee-fade--left" aria-hidden />
        <div className="yaav-marquee-fade yaav-marquee-fade--right" aria-hidden />

        <div className="yaav-marquee-track">
          {loop.map((ad, index) => (
            <MarqueeItem
              key={`${ad.id}-${index}`}
              authorName={ad.authorName}
              title={ad.title}
              type={ad.type}
            />
          ))}
        </div>
      </div>

      <Link
        href="/comunidad"
        className="hidden lg:inline-flex shrink-0 items-center gap-1 text-[10px] font-display font-bold uppercase tracking-[0.14em] text-yaav-400 hover:text-yaav-300 transition-colors"
      >
        <Sparkles className="h-3 w-3" />
        Entre Yaavsers
      </Link>
    </div>
  );
}
