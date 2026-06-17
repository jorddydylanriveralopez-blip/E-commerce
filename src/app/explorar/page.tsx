"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ServiceCard } from "@/components/ServiceCard";
import { categories, getListingsByCategory, searchListings } from "@/lib/data";

function buildExploreUrl(opts: { categoria?: string; q?: string }) {
  const params = new URLSearchParams();
  if (opts.categoria && opts.categoria !== "todos") params.set("categoria", opts.categoria);
  if (opts.q) params.set("q", opts.q);
  const qs = params.toString();
  return qs ? `/explorar?${qs}` : "/explorar";
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("categoria") ?? "todos";

  const results = useMemo(() => {
    let items = getListingsByCategory(category);
    if (query) {
      const searched = searchListings(query);
      const ids = new Set(searched.map((s) => s.id));
      items = items.filter((i) => ids.has(i.id));
    }
    return items;
  }, [query, category]);

  const activeCategory = categories.find((c) => c.id === category);

  const pageTitle = query
    ? `Resultados para "${query}"`
    : activeCategory
      ? activeCategory.label
      : "Productos y servicios Yaavs";

  const itemLabel =
    category === "productos" ? "producto" : category === "servicios" ? "servicio" : "anuncio";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900">
          {pageTitle}
        </h1>
        <p className="mt-2 text-neutral-500">
          {activeCategory?.description ??
            "Planes pospago, prepago, equipos y más de Yaavsers en tu zona"}
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          {results.length} {itemLabel}{results.length !== 1 ? "s" : ""} disponible
          {results.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="lg:hidden -mx-4 px-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-2 w-max min-w-full">
            <a
              href={buildExploreUrl({ q: query })}
              className={`shrink-0 rounded-md px-4 py-2 text-sm font-display font-bold uppercase tracking-wide min-h-[40px] flex items-center ${
                category === "todos" ? "btn-neon" : "bg-white border border-neutral-300 text-neutral-900"
              }`}
            >
              Todos
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={buildExploreUrl({ categoria: cat.id, q: query })}
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

        <aside className="hidden lg:block lg:w-64 shrink-0">
          <div className="sticky top-28 space-y-6">
            <form action="/explorar" className="relative">
              {category !== "todos" && <input type="hidden" name="categoria" value={category} />}
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Buscar..."
                className="input-field py-2.5 pl-10 pr-4 text-sm"
              />
            </form>

            <div className="glass-card rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4 text-sm font-display font-bold uppercase tracking-wide text-neutral-900">
                <SlidersHorizontal className="h-4 w-4" />
                Categorías
              </div>
              <ul className="space-y-1">
                <li>
                  <a
                    href={buildExploreUrl({ q: query })}
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
                      href={buildExploreUrl({ categoria: cat.id, q: query })}
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

          {results.length > 0 ? (
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
                Prueba con otra búsqueda o categoría.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
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
