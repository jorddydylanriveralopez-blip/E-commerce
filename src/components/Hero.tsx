import Link from "next/link";
import { ArrowRight, MapPin, Store, Handshake } from "lucide-react";
import { DecorativeOrbs } from "@/components/DecorativeOrbs";

const stats = [
  { value: "500+", label: "Yaavsers en la red", accent: "text-yaav-600" },
  { value: "2,000+", label: "Servicios publicados", accent: "text-coral-500" },
  { value: "4.8★", label: "Confianza del barrio", accent: "text-mint-500" },
  { value: "32", label: "Ciudades conectadas", accent: "text-yaav-700" },
];

const features = [
  {
    icon: Store,
    title: "De puesto, local o taller",
    description: "Plomeros, vendedores, estilistas, técnicos… si sabes hacer algo, aquí lo anuncias.",
    iconBg: "bg-yaav-100 text-yaav-700",
  },
  {
    icon: MapPin,
    title: "Gente de tu zona",
    description: "Encuentra servicios cerca de ti, de personas de confianza en tu comunidad.",
    iconBg: "bg-yellow-100 text-yellow-700",
  },
  {
    icon: Handshake,
    title: "Fácil y sin rollos",
    description: "Publica en minutos con foto, precio y WhatsApp. Sin complicaciones ni letras chiquitas.",
    iconBg: "bg-rose-100 text-rose-700",
  },
];

export function Hero() {
  return (
    <section className="gradient-hero pattern-dots texture-grain relative overflow-hidden">
      <DecorativeOrbs />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 badge-bait-pink rounded-md px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs mb-5 sm:mb-6">
            🏪 Del barrio, para el barrio
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-yaav-950 leading-[1.1]">
            Tu puesto, tu local,{" "}
            <span className="text-gradient">tu talento.</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-muted max-w-2xl leading-relaxed">
            Yaavstore es el marketplace de los Yaavsers: trabajadores de puestos, locales y
            oficios que quieren darse a conocer. Publica lo que haces o encuentra a alguien de confianza cerca de ti.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
            <Link
              href="/explorar"
              className="btn-neon inline-flex items-center justify-center gap-2 rounded-md px-6 sm:px-7 py-3.5 text-sm sm:text-base min-h-[48px]"
            >
              Ver servicios
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/publicar"
              className="btn-outline-urban inline-flex items-center justify-center gap-2 rounded-md px-6 sm:px-7 py-3.5 text-sm sm:text-base min-h-[48px]"
            >
              Publicar mi servicio
            </Link>
          </div>
        </div>

        <div className="urban-divider mt-12 sm:mt-16 rounded-full max-w-xs opacity-80" />

        <div className="mt-8 sm:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-lg p-3 sm:p-5 text-center">
              <div className={`font-display text-xl sm:text-2xl lg:text-3xl font-bold uppercase ${stat.accent}`}>
                {stat.value}
              </div>
              <div className="mt-1 text-[10px] sm:text-xs text-muted leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {features.map((feature) => (
            <div key={feature.title} className="glass-card rounded-lg p-5 sm:p-6 transition-all">
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${feature.iconBg} mb-4`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold uppercase text-yaav-900 text-base sm:text-lg tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
