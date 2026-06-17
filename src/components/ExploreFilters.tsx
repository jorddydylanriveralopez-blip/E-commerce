"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MapPin, Navigation, SlidersHorizontal, Star, X } from "lucide-react";
import {
  MEXICO_CITIES,
  PRICE_PRESETS,
  REPUTATION_OPTIONS,
  SORT_OPTIONS,
  USER_CITY_KEY,
  buildExploreUrl,
  findNearestCity,
  parseExploreFilters,
  type ExploreFilterParams,
} from "@/lib/explore-filters";

interface ExploreFiltersProps {
  category: string;
  query: string;
  compact?: boolean;
}

export function ExploreFilters({ category, query, compact = false }: ExploreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseExploreFilters(searchParams);
  const [locating, setLocating] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function navigate(next: Partial<ExploreFilterParams>) {
    const merged: ExploreFilterParams = {
      categoria: category,
      q: query,
      ciudad: filters.ciudad,
      precio_min: filters.precio_min,
      precio_max: filters.precio_max,
      reputacion: filters.reputacion,
      orden: filters.orden,
      ...next,
    };
    router.push(buildExploreUrl(merged));
  }

  function clearFilters() {
    router.push(buildExploreUrl({ categoria: category, q: query }));
  }

  function useNearMe() {
    setLocating(true);
    if (!navigator.geolocation) {
      navigate({ ciudad: "Ciudad de México", orden: "cercania" });
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const city = findNearestCity(pos.coords.latitude, pos.coords.longitude);
        localStorage.setItem(USER_CITY_KEY, city.name);
        navigate({ ciudad: city.name, orden: "cercania" });
        setLocating(false);
      },
      () => {
        const saved = localStorage.getItem(USER_CITY_KEY) ?? "Ciudad de México";
        navigate({ ciudad: saved, orden: "cercania" });
        setLocating(false);
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  }

  const hasActiveFilters =
    Boolean(filters.ciudad) ||
    Boolean(filters.precio_min) ||
    Boolean(filters.precio_max) ||
    Boolean(filters.reputacion) ||
    (filters.orden && filters.orden !== "relevantes");

  const panel = (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
          Ubicación
        </p>
        <button
          type="button"
          onClick={useNearMe}
          disabled={locating}
          className="w-full flex items-center justify-center gap-2 rounded-md border-2 border-yaavs-navy bg-yaavs-navy text-white px-3 py-2.5 text-sm font-display font-bold uppercase tracking-wide hover:bg-yaavs-navy-light transition-colors disabled:opacity-60"
        >
          <Navigation className="h-4 w-4" />
          {locating ? "Ubicando..." : "Yaavsers cerca de mí"}
        </button>
        <select
          value={filters.ciudad}
          onChange={(e) => navigate({ ciudad: e.target.value, orden: e.target.value ? "cercania" : filters.orden })}
          className="input-field mt-2 text-sm bg-white"
        >
          <option value="">Todo México</option>
          {MEXICO_CITIES.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name} ({city.state})
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
          Precio (MXN)
        </p>
        <div className="flex flex-wrap gap-2 mb-2">
          {PRICE_PRESETS.map((preset) => {
            const active =
              (preset.min?.toString() ?? "") === filters.precio_min &&
              (preset.max?.toString() ?? "") === filters.precio_max;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  navigate({
                    precio_min: preset.min?.toString() ?? "",
                    precio_max: preset.max?.toString() ?? "",
                  })
                }
                className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                  active
                    ? "bg-yaav-600 text-white border-yaav-600"
                    : "bg-white text-neutral-700 border-neutral-300 hover:border-yaav-400"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            placeholder="Mín"
            value={filters.precio_min}
            onChange={(e) => navigate({ precio_min: e.target.value })}
            className="input-field py-2 text-sm"
          />
          <input
            type="number"
            min="0"
            placeholder="Máx"
            value={filters.precio_max}
            onChange={(e) => navigate({ precio_max: e.target.value })}
            className="input-field py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5" />
          Reputación del vendedor
        </p>
        <select
          value={filters.reputacion}
          onChange={(e) => navigate({ reputacion: e.target.value })}
          className="input-field text-sm bg-white"
        >
          {REPUTATION_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
          Ordenar por
        </p>
        <select
          value={filters.orden ?? "relevantes"}
          onChange={(e) => navigate({ orden: e.target.value as ExploreFilterParams["orden"] })}
          className="input-field text-sm bg-white"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-1.5 text-sm text-neutral-500 hover:text-yaav-700 py-2"
        >
          <X className="h-4 w-4" />
          Limpiar filtros
        </button>
      )}
    </div>
  );

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm font-display font-bold uppercase tracking-wide min-h-[40px]"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-yaav-600" />
          )}
        </button>
        {mobileOpen && (
          <div className="fixed inset-0 z-[70] flex justify-end">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Cerrar"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative w-full max-w-sm bg-white h-full overflow-y-auto p-5 shadow-xl safe-bottom">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold uppercase text-lg">Filtros</h2>
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Cerrar">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {panel}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="glass-card rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4 text-sm font-display font-bold uppercase tracking-wide text-neutral-900">
        <MapPin className="h-4 w-4" />
        Filtros
      </div>
      {panel}
    </div>
  );
}
