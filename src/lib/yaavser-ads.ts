import { YaavserAd } from "./types";

export const yaavserAds: YaavserAd[] = [
  {
    id: "ya1",
    type: "busco_distribuidor",
    title: "Busco distribuidor prepago zona norte CDMX",
    message:
      "Tengo puesto en Ecatepec y necesito proveedor confiable de chips prepago y recargas al mayoreo. Volumen semanal. Preferencia activación inmediata.",
    authorName: "Luis · Yaavser Norte",
    location: "Ecatepec, Edomex",
    whatsapp: "5511223344",
    createdAt: "2026-06-15",
    featured: true,
  },
  {
    id: "ya2",
    type: "ofrezco_servicios",
    title: "Portabilidades masivas para equipos",
    message:
      "Hago portabilidad el mismo día para tiendas y puestos. Mínimo 5 líneas. Te apoyo con documentación y seguimiento de activación.",
    authorName: "María · Celular Express",
    location: "Guadalajara, Jal.",
    whatsapp: "3319887766",
    createdAt: "2026-06-14",
    featured: true,
  },
  {
    id: "ya3",
    type: "promocion",
    title: "Chips prepago a precio mayoreo Yaavser",
    message:
      "Solo para distribuidores: paquete de 20 chips con recarga inicial incluida. Entrega en zona metropolitana o envío por paquetería.",
    authorName: "Roberto · Telecom Mayoreo",
    location: "Monterrey, N.L.",
    whatsapp: "8187654321",
    createdAt: "2026-06-13",
    featured: true,
  },
  {
    id: "ya4",
    type: "colaboracion",
    title: "Busco refuerzo fines de semana",
    message:
      "Puesto en mercado sobre ruedas. Necesito Yaavser con experiencia en prepago para sábados y domingos. Comisión por venta.",
    authorName: "Ana · Plaza Central",
    location: "Puebla, Pue.",
    whatsapp: "2223344556",
    createdAt: "2026-06-12",
    featured: true,
  },
  {
    id: "ya5",
    type: "ofrezco_servicios",
    title: "Activación de chip a domicilio B2B",
    message:
      "Si tienes clientes que no pueden ir al puesto, yo activo en su casa y te comparto comisión. Cobertura CDMX y zona conurbada.",
    authorName: "Carlos · Activaciones CDMX",
    location: "Ciudad de México",
    whatsapp: "5544332211",
    createdAt: "2026-06-11",
    featured: true,
  },
  {
    id: "ya6",
    type: "busco_distribuidor",
    title: "¿Alguien con stock de equipos desbloqueados?",
    message:
      "Busco Samsung y Motorola entrada/media para revender en mi local. Pago de contado, factura si aplica.",
    authorName: "Jorge · Móvil Sur",
    location: "Tijuana, B.C.",
    whatsapp: "6641122334",
    createdAt: "2026-06-10",
    featured: true,
  },
];

export function getFeaturedYaavserAds(): YaavserAd[] {
  return yaavserAds.filter((ad) => ad.featured);
}
