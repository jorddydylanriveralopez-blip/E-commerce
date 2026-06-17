import { ServiceListing } from "@/lib/types";

export type ExploreSort =
  | "relevantes"
  | "precio_asc"
  | "precio_desc"
  | "reputacion"
  | "recientes"
  | "cercania";

export type ExploreFilterParams = {
  categoria?: string;
  q?: string;
  ciudad?: string;
  precio_min?: string;
  precio_max?: string;
  reputacion?: string;
  orden?: ExploreSort;
};

export type MexicoCity = {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  aliases: string[];
};

export const MEXICO_CITIES: MexicoCity[] = [
  { id: "cdmx", name: "Ciudad de México", state: "CDMX", lat: 19.4326, lng: -99.1332, aliases: ["cdmx", "df", "méxico df", "mexico df"] },
  { id: "gdl", name: "Guadalajara", state: "Jalisco", lat: 20.6597, lng: -103.3496, aliases: ["guadalajara", "jalisco"] },
  { id: "mty", name: "Monterrey", state: "Nuevo León", lat: 25.6866, lng: -100.3161, aliases: ["monterrey", "nuevo león", "nuevo leon"] },
  { id: "pue", name: "Puebla", state: "Puebla", lat: 19.0414, lng: -98.2063, aliases: ["puebla"] },
  { id: "tij", name: "Tijuana", state: "Baja California", lat: 32.5149, lng: -117.0382, aliases: ["tijuana", "baja california"] },
  { id: "leon", name: "León", state: "Guanajuato", lat: 21.125, lng: -101.686, aliases: ["león", "leon", "guanajuato"] },
  { id: "qro", name: "Querétaro", state: "Querétaro", lat: 20.5888, lng: -100.3899, aliases: ["querétaro", "queretaro"] },
  { id: "mer", name: "Mérida", state: "Yucatán", lat: 20.9674, lng: -89.5926, aliases: ["mérida", "merida", "yucatán", "yucatan"] },
  { id: "can", name: "Cancún", state: "Quintana Roo", lat: 21.1619, lng: -86.8515, aliases: ["cancún", "cancun", "quintana roo"] },
  { id: "tol", name: "Toluca", state: "Estado de México", lat: 19.2826, lng: -99.6557, aliases: ["toluca", "estado de méxico", "edomex"] },
];

export const PRICE_PRESETS: { id: string; label: string; min?: number; max?: number }[] = [
  { id: "barato", label: "Baratos", max: 500 },
  { id: "medio", label: "$500 – $1,500", min: 500, max: 1500 },
  { id: "premium", label: "Premium", min: 1500 },
];

export const REPUTATION_OPTIONS = [
  { value: "", label: "Cualquier reputación" },
  { value: "4", label: "4+ estrellas" },
  { value: "4.5", label: "4.5+ estrellas" },
] as const;

export const SORT_OPTIONS: { value: ExploreSort; label: string }[] = [
  { value: "relevantes", label: "Más relevantes" },
  { value: "cercania", label: "Cerca de ti" },
  { value: "precio_asc", label: "Menor precio" },
  { value: "precio_desc", label: "Mayor precio" },
  { value: "reputacion", label: "Mejor reputación" },
  { value: "recientes", label: "Más recientes" },
];

export function buildExploreUrl(opts: ExploreFilterParams): string {
  const params = new URLSearchParams();
  if (opts.categoria && opts.categoria !== "todos") params.set("categoria", opts.categoria);
  if (opts.q) params.set("q", opts.q);
  if (opts.ciudad) params.set("ciudad", opts.ciudad);
  if (opts.precio_min) params.set("precio_min", opts.precio_min);
  if (opts.precio_max) params.set("precio_max", opts.precio_max);
  if (opts.reputacion) params.set("reputacion", opts.reputacion);
  if (opts.orden && opts.orden !== "relevantes") params.set("orden", opts.orden);
  const qs = params.toString();
  return qs ? `/explorar?${qs}` : "/explorar";
}

export function parseExploreFilters(searchParams: URLSearchParams): ExploreFilterParams {
  return {
    categoria: searchParams.get("categoria") ?? "todos",
    q: searchParams.get("q") ?? "",
    ciudad: searchParams.get("ciudad") ?? "",
    precio_min: searchParams.get("precio_min") ?? "",
    precio_max: searchParams.get("precio_max") ?? "",
    reputacion: searchParams.get("reputacion") ?? "",
    orden: (searchParams.get("orden") as ExploreSort) ?? "relevantes",
  };
}

export function findNearestCity(lat: number, lng: number): MexicoCity {
  let best = MEXICO_CITIES[0];
  let bestDist = Infinity;
  for (const city of MEXICO_CITIES) {
    const d = (city.lat - lat) ** 2 + (city.lng - lng) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = city;
    }
  }
  return best;
}

function listingLocation(listing: ServiceListing): string {
  return `${listing.provider.location} ${listing.tags.join(" ")}`.toLowerCase();
}

function matchesCity(listing: ServiceListing, ciudad: string): boolean {
  if (!ciudad) return true;
  const city = MEXICO_CITIES.find(
    (c) => c.name === ciudad || c.id === ciudad
  );
  const needle = ciudad.toLowerCase();
  const loc = listingLocation(listing);
  if (loc.includes(needle)) return true;
  if (city) {
    return (
      loc.includes(city.name.toLowerCase()) ||
      loc.includes(city.state.toLowerCase()) ||
      city.aliases.some((a) => loc.includes(a))
    );
  }
  return loc.includes(needle);
}

function effectivePrice(listing: ServiceListing): number | null {
  if (listing.priceType === "negociable" || !listing.price) return null;
  return listing.price;
}

export function applyExploreFilters(
  items: ServiceListing[],
  filters: ExploreFilterParams
): ServiceListing[] {
  let result = [...items];

  if (filters.q) {
    const lower = filters.q.toLowerCase();
    result = result.filter(
      (i) =>
        i.title.toLowerCase().includes(lower) ||
        i.description.toLowerCase().includes(lower) ||
        i.tags.some((t) => t.toLowerCase().includes(lower)) ||
        i.provider.name.toLowerCase().includes(lower) ||
        i.provider.location.toLowerCase().includes(lower)
    );
  }

  if (filters.ciudad) {
    result = result.filter((i) => matchesCity(i, filters.ciudad!));
  }

  const min = filters.precio_min ? Number(filters.precio_min) : null;
  const max = filters.precio_max ? Number(filters.precio_max) : null;

  if (min !== null && !Number.isNaN(min)) {
    result = result.filter((i) => {
      const p = effectivePrice(i);
      return p === null || p >= min;
    });
  }

  if (max !== null && !Number.isNaN(max)) {
    result = result.filter((i) => {
      const p = effectivePrice(i);
      return p === null || p <= max;
    });
  }

  if (filters.reputacion) {
    const minRating = Number(filters.reputacion);
    if (!Number.isNaN(minRating)) {
      result = result.filter((i) => i.provider.rating >= minRating);
    }
  }

  const orden = filters.orden ?? "relevantes";

  result.sort((a, b) => {
    switch (orden) {
      case "precio_asc": {
        const pa = effectivePrice(a) ?? Infinity;
        const pb = effectivePrice(b) ?? Infinity;
        return pa - pb;
      }
      case "precio_desc": {
        const pa = effectivePrice(a) ?? -1;
        const pb = effectivePrice(b) ?? -1;
        return pb - pa;
      }
      case "reputacion":
        return b.provider.rating - a.provider.rating || b.provider.reviewCount - a.provider.reviewCount;
      case "recientes":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "cercania":
      case "relevantes":
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.views - a.views;
    }
  });

  return result;
}

export const USER_CITY_KEY = "yaavstore-user-city";
