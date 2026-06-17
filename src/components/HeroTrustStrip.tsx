import { MapPin, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

const items = [
  {
    icon: MapPin,
    label: "Por ciudad",
    detail: "Filtra cerca de ti",
  },
  {
    icon: ShieldCheck,
    label: "Reputación",
    detail: "Vendedores calificados",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    detail: "Contacto directo",
  },
  {
    icon: Sparkles,
    label: "Sin comisión",
    detail: "Publicar es gratis",
  },
] as const;

export function HeroTrustStrip() {
  return (
    <section className="hero-trust-strip" aria-label="Ventajas de Yaavstore">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-stretch justify-center gap-px px-4 py-3 sm:px-6 sm:py-3.5">
        {items.map(({ icon: Icon, label, detail }) => (
          <div
            key={label}
            className="flex min-w-[calc(50%-1px)] flex-1 items-center gap-2.5 rounded-lg px-2 py-1.5 sm:min-w-0 sm:px-4"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-yaavs-navy)]/8 text-[var(--color-yaavs-navy)]">
              <Icon className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-800">
                {label}
              </span>
              <span className="block text-[11px] text-neutral-500 truncate">{detail}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
