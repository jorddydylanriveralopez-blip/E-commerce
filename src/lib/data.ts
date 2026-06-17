import { CategoryInfo, ServiceListing } from "./types";
import { yaavImages } from "./images";

export const categories: CategoryInfo[] = [
  {
    id: "servicios",
    label: "Servicios",
    description: "Planes pospago, prepago, activación de chip y más",
    icon: "📱",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "productos",
    label: "Productos",
    description: "Equipos, chips, accesorios y paquetes",
    icon: "🛍️",
    color: "from-orange-500 to-amber-500",
  },
];

export const listings: ServiceListing[] = [
  {
    id: "1",
    title: "Plan pospago Yaav 50GB",
    description:
      "Plan pospago con 50GB de internet, llamadas y SMS ilimitados en México, EUA y Canadá. Sin plazo forzoso. Activación el mismo día con tu INE.",
    category: "servicios",
    price: 399,
    priceType: "fijo",
    image: yaavImages.planPospago,
    images: [yaavImages.planPospago],
    provider: {
      id: "p1",
      name: "Yaavser Centro",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      location: "Ciudad de México",
      whatsapp: "5512345678",
      rating: 4.9,
      reviewCount: 124,
      verified: true,
      memberSince: "2023",
      bio: "Distribuidor autorizado Yaavs. Activación de planes pospago y prepago.",
    },
    tags: ["Pospago", "50GB", "Sin plazo"],
    featured: true,
    createdAt: "2026-06-10",
    views: 534,
  },
  {
    id: "2",
    title: "Chip prepago Yaavs + recarga",
    description:
      "Chip prepago nuevo con recarga inicial de $100. Incluye activación y configuración de APN. Listo para usar en cualquier equipo desbloqueado.",
    category: "productos",
    price: 150,
    priceType: "fijo",
    image: yaavImages.chipPrepago,
    images: [yaavImages.chipPrepago],
    provider: {
      id: "p2",
      name: "Celular Express",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
      location: "Guadalajara",
      whatsapp: "3312345678",
      rating: 4.8,
      reviewCount: 89,
      verified: true,
      memberSince: "2023",
      bio: "Puesto de telefonía en el mercado. Chips, recargas y accesorios.",
    },
    tags: ["Prepago", "Chip", "Recarga incluida"],
    featured: true,
    createdAt: "2026-06-08",
    views: 412,
  },
  {
    id: "3",
    title: "Activación de chip a domicilio",
    description:
      "Te llevo el chip, lo activamos en tu casa y te explico cómo recargar o contratar plan. Servicio en toda la zona metropolitana.",
    category: "servicios",
    price: 0,
    priceType: "negociable",
    image: yaavImages.activacionDomicilio,
    images: [yaavImages.activacionDomicilio],
    provider: {
      id: "p3",
      name: "Miguel Yaavser",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
      location: "Monterrey",
      whatsapp: "8181234567",
      rating: 4.7,
      reviewCount: 56,
      verified: true,
      memberSince: "2024",
      bio: "Yaavser independiente. Activación y asesoría de planes prepago y pospago.",
    },
    tags: ["A domicilio", "Prepago", "Pospago"],
    featured: false,
    createdAt: "2026-06-12",
    views: 189,
  },
  {
    id: "4",
    title: "Portabilidad — conserva tu número",
    description:
      "Tramitamos tu portabilidad a Yaavs sin perder tu número. Revisión de adeudos, entrega de SIM y activación en 24-48 hrs.",
    category: "servicios",
    price: 0,
    priceType: "negociable",
    image: yaavImages.portabilidad,
    images: [yaavImages.portabilidad],
    provider: {
      id: "p4",
      name: "Ana Telecom",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      location: "Puebla",
      whatsapp: "2221234567",
      rating: 5.0,
      reviewCount: 32,
      verified: true,
      memberSince: "2024",
      bio: "Especialista en portabilidad y planes familiares Yaavs.",
    },
    tags: ["Portabilidad", "Mismo número", "Rápido"],
    featured: true,
    createdAt: "2026-06-05",
    views: 298,
  },
  {
    id: "5",
    title: "Samsung Galaxy A15 128GB",
    description:
      "Equipo nuevo, desbloqueado, compatible con redes Yaavs 4G/5G. Incluye cargador, garantía de 1 año y opción de plan pospago al activar.",
    category: "productos",
    price: 3499,
    priceType: "fijo",
    image: yaavImages.smartphone,
    images: [yaavImages.smartphone],
    provider: {
      id: "p5",
      name: "Tech Yaavstore",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      location: "Querétaro",
      whatsapp: "4421234567",
      rating: 4.9,
      reviewCount: 41,
      verified: true,
      memberSince: "2025",
      bio: "Venta de smartphones y accesorios para clientes Yaavs.",
    },
    tags: ["Equipo", "Nuevo", "Garantía"],
    featured: true,
    createdAt: "2026-06-11",
    views: 267,
  },
  {
    id: "6",
    title: "Plan prepago $200 — 8GB x 30 días",
    description:
      "Paquete prepago con 8GB de datos, redes sociales ilimitadas y minutos/SMS incluidos. Recarga y activación inmediata.",
    category: "servicios",
    price: 200,
    priceType: "fijo",
    image: yaavImages.planPrepago,
    images: [yaavImages.planPrepago],
    provider: {
      id: "p6",
      name: "Recargas El Barrio",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      location: "Ciudad de México",
      whatsapp: "5598765432",
      rating: 4.6,
      reviewCount: 73,
      verified: true,
      memberSince: "2023",
      bio: "Recargas prepago y paquetes de datos Yaavs en tu colonia.",
    },
    tags: ["Prepago", "8GB", "30 días"],
    featured: false,
    createdAt: "2026-06-09",
    views: 301,
  },
  {
    id: "7",
    title: "Kit funda + mica 9H",
    description:
      "Funda de silicona y mica de vidrio templado 9H. Varios modelos (Samsung, Xiaomi, Motorola). Instalación gratis en tienda.",
    category: "productos",
    price: 199,
    priceType: "desde",
    image: yaavImages.accesorios,
    images: [yaavImages.accesorios],
    provider: {
      id: "p7",
      name: "Accesorios Móvil",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80",
      location: "Tijuana",
      whatsapp: "6641234567",
      rating: 4.5,
      reviewCount: 44,
      verified: true,
      memberSince: "2023",
      bio: "Accesorios para celular al mayoreo y menudeo.",
    },
    tags: ["Accesorios", "Funda", "Mica"],
    featured: false,
    createdAt: "2026-06-07",
    views: 156,
  },
  {
    id: "8",
    title: "Plan familiar pospago 4 líneas",
    description:
      "Paquete familiar: 4 líneas pospago con datos compartidos 120GB, minutos ilimitados y roaming en Norteamérica. Ideal para negocio o familia.",
    category: "servicios",
    price: 1299,
    priceType: "desde",
    image: yaavImages.planFamiliar,
    images: [yaavImages.planFamiliar],
    provider: {
      id: "p8",
      name: "Yaavser Negocios",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
      location: "León, Gto.",
      whatsapp: "4771234567",
      rating: 4.8,
      reviewCount: 61,
      verified: true,
      memberSince: "2024",
      bio: "Planes empresariales y familiares para distribuidores Yaavs.",
    },
    tags: ["Pospago", "4 líneas", "Familia"],
    featured: true,
    createdAt: "2026-06-13",
    views: 278,
  },
];

export function getCategoryLabel(id: string): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}

export function formatPrice(price: number, priceType: ServiceListing["priceType"]): string {
  const formatted = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price);

  switch (priceType) {
    case "desde":
      return `Desde ${formatted}`;
    case "hora":
      return `${formatted}/hr`;
    case "negociable":
      return "Precio negociable";
    default:
      return formatted;
  }
}

export function getListingById(id: string): ServiceListing | undefined {
  return listings.find((l) => l.id === id);
}

export function getListingsByCategory(category: string): ServiceListing[] {
  if (category === "todos") return listings;
  return listings.filter((l) => l.category === category);
}

export function searchListings(query: string): ServiceListing[] {
  const q = query.toLowerCase().trim();
  if (!q) return listings;
  return listings.filter(
    (l) =>
      l.title.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.tags.some((t) => t.toLowerCase().includes(q)) ||
      l.provider.name.toLowerCase().includes(q) ||
      l.provider.location.toLowerCase().includes(q)
  );
}
