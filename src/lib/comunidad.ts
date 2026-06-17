import { YaavserAdType } from "./types";

/** Configuración del espacio Entre Yaavsers (gratis en lanzamiento → suscripción). */
export const comunidadConfig = {
  isFreeLaunch: true,
  freeUntilLabel: "diciembre 2026",
  futurePlanName: "Yaavser Pro",
  futurePriceMonthly: 99,
  currency: "MXN",
  maxFreeAdsPerUser: 1,
  featuredSlots: 6,
} as const;

export const yaavserAdTypes: {
  id: YaavserAdType;
  label: string;
  description: string;
}[] = [
  {
    id: "busco_distribuidor",
    label: "Busco distribuidor",
    description: "Necesitas proveedor, stock o cobertura en otra zona",
  },
  {
    id: "ofrezco_servicios",
    label: "Ofrezco servicios",
    description: "Activaciones, portabilidad, planes o soporte a otros Yaavsers",
  },
  {
    id: "colaboracion",
    label: "Colaboración",
    description: "Busco socio, refuerzo en puesto o alguien que cubra turno",
  },
  {
    id: "promocion",
    label: "Promoción B2B",
    description: "Mayoreo, equipos, chips o paquetes solo para Yaavsers",
  },
  {
    id: "otro",
    label: "Otro",
    description: "Cualquier aviso relevante para la red Yaavser",
  },
];

export function getYaavserAdTypeLabel(type: YaavserAdType): string {
  return yaavserAdTypes.find((t) => t.id === type)?.label ?? type;
}
