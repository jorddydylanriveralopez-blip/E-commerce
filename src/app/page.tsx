import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PromoBanner } from "@/components/PromoBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ServiceCard } from "@/components/ServiceCard";
import { listings } from "@/lib/data";

export default function HomePage() {
  const featured = listings.filter((l) => l.featured);
  const recent = [...listings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <>
      <PromoBanner />

      <section id="categorias" className="border-t border-neutral-200/80 scroll-mt-28 section-card mx-4 sm:mx-6 my-6 rounded-2xl">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="font-display text-center text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-6">
            ¿Buscas productos o servicios?
          </h2>
          <CategoryGrid />
        </div>
      </section>

      <section className="section-elevated border-t border-neutral-200/80">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900">
                Lo más vendido
              </h2>
              <p className="mt-2 text-sm text-neutral-500">Servicios con mejor reputación en la comunidad</p>
            </div>
            <Link
              href="/explorar"
              className="font-display uppercase text-xs font-semibold tracking-[0.15em] text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-2 transition-colors"
            >
              Ver todo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {featured.map((listing) => (
              <ServiceCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200/80">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-12 sm:py-16">
          <div className="mb-8 sm:mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900">
              Recién llegados
            </h2>
            <p className="mt-2 text-sm text-neutral-500">Lo más nuevo que publicaron los Yaavsers</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {recent.map((listing) => (
              <ServiceCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-neutral-200/80 mx-4 sm:mx-6 mb-8 rounded-2xl section-card">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-4">
            Gratis · Sin comisión
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight text-neutral-900 max-w-2xl mx-auto">
            ¿Vendes planes, chips o equipos?
          </h2>
          <p className="mt-4 text-neutral-500 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Súbelo en 5 minutos y que te encuentren por WhatsApp.
          </p>
          <Link href="/publicar" className="btn-premium mt-8 inline-flex items-center gap-2">
            Publicar ahora
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
