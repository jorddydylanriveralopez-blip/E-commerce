import Link from "next/link";
import { ArrowRight, Megaphone, Sparkles } from "lucide-react";
import { YaavserAdCard } from "@/components/YaavserAdCard";
import { comunidadConfig } from "@/lib/comunidad";
import { yaavserAds } from "@/lib/yaavser-ads";

export default function ComunidadPage() {
  const sorted = [...yaavserAds].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-3xl">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-yaav-400 mb-3 flex items-center gap-2">
          <Megaphone className="h-4 w-4" />
          Entre Yaavsers
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-neutral-900">
          Anúnciate entre distribuidores
        </h1>
        <p className="mt-4 text-neutral-500 text-sm sm:text-base leading-relaxed">
          Espacio para que los Yaavsers se encuentren: buscar proveedor, ofrecer portabilidades,
          colaborar en puestos o promocionar mayoreo. No es para clientes finales — es red B2B.
        </p>
      </div>

      <div className="mt-8 grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
        <div className="bg-white p-5 sm:p-6">
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">
            Lanzamiento
          </p>
          <p className="font-display text-xl font-bold uppercase text-neutral-900">100% gratis</p>
          <p className="mt-2 text-sm text-neutral-500">
            Publica tu anuncio sin costo hasta {comunidadConfig.freeUntilLabel}.
          </p>
        </div>
        <div className="bg-white p-5 sm:p-6">
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Próximamente
          </p>
          <p className="font-display text-xl font-bold uppercase text-neutral-900">
            {comunidadConfig.futurePlanName}
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Después del lanzamiento, anuncios destacados desde $
            {comunidadConfig.futurePriceMonthly} {comunidadConfig.currency}/mes.
          </p>
        </div>
        <div className="bg-yaavs-navy p-5 sm:p-6 sm:col-span-2 lg:col-span-1 flex flex-col justify-center">
          <Link
            href="/comunidad/publicar"
            className="btn-premium inline-flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            Publicar anuncio
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-white/70 text-center sm:text-left">
            {comunidadConfig.maxFreeAdsPerUser} anuncio activo por cuenta en lanzamiento
          </p>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-900">
            Anuncios activos
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            {sorted.length} avisos de Yaavsers en la red
          </p>
        </div>
      </div>

      <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((ad) => (
          <YaavserAdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  );
}
