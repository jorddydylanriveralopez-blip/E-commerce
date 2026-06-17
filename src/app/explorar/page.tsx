"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ServiceCard } from "@/components/ServiceCard";
import { SectionBanner } from "@/components/SectionBanner";
import { ExploreFilters } from "@/components/ExploreFilters";
import { categories, getListingsByCategory } from "@/lib/data";
import { ServiceListing } from "@/lib/types";
import {
  applyExploreFilters,
  buildExploreUrl,
  parseExploreFilters,
} from "@/lib/explore-filters";

function ExploreContent() {
  const searchParams = useSearchParams();
  const filters = parseExploreFilters(searchParams);
  const query = filters.q ?? "";
  const category = filters.categoria ?? "todos";
  const [dbListings, setDbListings] = useState<ServiceListing[] | null>(null);
  const [loading, setLoading] = useState(true);

  const filterKey = searchParams.toString();

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(filterKey);
    const qs = params.toString();
    fetch(`/api/listings${qs ? `?${qs}` : ""}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.listings) setDbListings(data.listings);
        else setDbListings(null);
      })
      .catch(() => setDbListings(null))
      .finally(() => setLoading(false));
  }, [filterKey]);

  const results = useMemo(() => {
    if (dbListings) return dbListings;
    return applyExploreFilters(getListingsByCategory(category), filters);
  }, [dbListings, filters, category]);

  const activeCategory = categories.find((c) => c.id === category);

  const pageTitle = query
    ? `Resultados para "${query}"`
    : filters.ciudad
      ? `Yaavsers en ${filters.ciudad}`
      : activeCategory
        ? activeCategory.label
        : "Productos y servicios Yaavs";

  const itemLabel =
    category === "productos" ? "producto" : category === "servicios" ? "servicio" : "anuncio";

  const bannerVariant =
    category === "productos" ? "productos" : category === "servicios" ? "servicios" : "explorar";

  const statText = loading
    ? "Buscando..."
    : `${results.length} ${itemLabel}${results.length !== 1 ? "s" : ""} disponible${results.length !== 1 ? "s" : ""}`;

  const activeChips: { label: string; clear: Partial<typeof filters> }[] = [];
  if (filters.ciudad) activeChips.push({ label: filters.ciudad, clear: { ciudad: "" } });
  if (filters.precio_min || filters.precio_max) {
    const label =
      filters.precio_min && filters.precio_max
        ? `$${filters.precio_min} – $${filters.precio_max}`
        : filters.precio_max
          ? `Hasta $${filters.precio_max}`
          : `Desde $${filters.precio_min}`;
    activeChips.push({ label, clear: { precio_min: "", precio_max: "" } });
  }
  if (filters.reputacion) {
    activeChips.push({ label: `${filters.reputacion}+ ★`, clear: { reputacion: "" } });
  }

  return (
    <>
      <SectionBanner
        variant={bannerVariant}
        title={pageTitle}
        subtitle={
          activeCategory?.description ??
          "Encuentra Yaavsers cerca de ti — filtra por precio, ciudad y reputación"
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <p className="text-sm text-neutral-500">{statText}</p>

          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {activeChips.map((chip) => (
                <a
                  key={chip.label}
                  href={buildExploreUrl({ ...filters, ...chip.clear })}
                  className="inline-flex items-center gap-1 rounded-full bg-yaav-100 text-yaav-800 px-3 py-1 text-xs font-semibold hover:bg-yaav-200 transition-colors"
                >
                  {chip.label}
                  <X className="h-3 w-3" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="lg:hidden -mx-4 px-4 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-2 w-max min-w-full items-center">
              <ExploreFilters category={category} query={query} compact />
              <a
                href={buildExploreUrl({ ...filters, categoria: "todos", ciudad: filters.ciudad })}
                className={`shrink-0 rounded-md px-4 py-2 text-sm font-display font-bold uppercase tracking-wide min-h-[40px] flex items-center ${
                  category === "todos" ? "btn-neon" : "bg-white border border-neutral-300 text-neutral-900"
                }`}
              >
                Todos
              </a>
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={buildExploreUrl({ ...filters, categoria: cat.id })}
                  className={`shrink-0 rounded-md px-4 py-2 text-sm font-display font-bold uppercase tracking-wide min-h-[40px] flex items-center gap-1.5 ${
                    category === cat.id ? "btn-neon" : "bg-white border border-neutral-300 text-neutral-900"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="whitespace-nowrap">{cat.label}</span>
                </a>
              ))}
            </div>
          </div>

          <aside className="hidden lg:block lg:w-72 shrink-0">
            <div className="sticky top-28 space-y-6">
              <form action="/explorar" className="relative">
                {category !== "todos" && <input type="hidden" name="categoria" value={category} />}
                {filters.ciudad && <input type="hidden" name="ciudad" value={filters.ciudad} />}
                {filters.precio_min && <input type="hidden" name="precio_min" value={filters.precio_min} />}
                {filters.precio_max && <input type="hidden" name="precio_max" value={filters.precio_max} />}
                {filters.reputacion && <input type="hidden" name="reputacion" value={filters.reputacion} />}
                {filters.orden && filters.orden !== "relevantes" && (
                  <input type="hidden" name="orden" value={filters.orden} />
                )}
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Buscar..."
                  className="input-field py-2.5 pl-10 pr-4 text-sm"
                />
              </form>

              <ExploreFilters category={category} query={query} />

              <div className="glass-card rounded-lg p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-3">
                  Categorías
                </p>
                <ul className="space-y-1">
                  <li>
                    <a
                      href={buildExploreUrl({ ...filters, categoria: "todos" })}
                      className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                        category === "todos"
                          ? "bg-yaavs-navy font-display font-bold uppercase text-white"
                          : "text-neutral-500 hover:text-neutral-900 font-semibold"
                      }`}
                    >
                      Todos
                    </a>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <a
                        href={buildExploreUrl({ ...filters, categoria: cat.id })}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                          category === cat.id
                            ? "bg-yaavs-navy font-display font-bold uppercase text-white"
                            : "text-neutral-500 hover:text-neutral-900 font-semibold"
                        }`}
                      >
                        <span>{cat.icon}</span>
                        {cat.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <form action="/explorar" className="relative mb-4 lg:hidden">
              {category !== "todos" && <input type="hidden" name="categoria" value={category} />}
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Buscar planes, chips, equipos..."
                className="input-field py-3 pl-10 pr-4 text-base"
              />
            </form>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-72 rounded-2xl bg-neutral-100 animate-pulse" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-neutral-200">
                {results.map((listing) => (
                  <ServiceCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="font-display font-bold uppercase text-lg text-neutral-900">
                  No encontramos anuncios
                </h3>
                <p className="mt-2 text-neutral-500">
                  Prueba otra ciudad, rango de precio o quita algunos filtros.
                </p>
                <a
                  href={buildExploreUrl({ categoria: category, q: query })}
                  className="btn-neon inline-flex mt-6 rounded-md px-5 py-2.5 text-sm"
                >
                  Limpiar filtros
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-neutral-400">
          Cargando...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
