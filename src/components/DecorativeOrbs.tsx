export function DecorativeOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Formas tipo sticker / cartel de puesto */}
      <div className="absolute top-8 right-[5%] hidden sm:block badge-bait-yellow rounded-sm px-3 py-1.5 text-xs rotate-3 opacity-90">
        HECHO EN EL BARRIO
      </div>
      <div className="absolute top-24 left-[4%] hidden md:block badge-bait-pink rounded-sm px-3 py-1 text-[10px] -rotate-2 opacity-90">
        YAAVSERS
      </div>
      <div className="absolute bottom-24 right-[8%] hidden lg:block bg-yaav-900 text-white font-display text-xs font-bold uppercase tracking-wider px-3 py-1.5 rotate-2 shadow-[3px_3px_0_#ea580c]">
        Tu talento cuenta
      </div>
      {/* Bloques de color suaves — concreto urbano */}
      <div className="absolute -top-16 right-1/4 h-48 w-48 rounded-full bg-yaav-500/10 blur-3xl" />
      <div className="absolute bottom-10 left-0 h-32 w-32 rounded-full bg-mint-500/10 blur-2xl hidden sm:block" />
      <div className="absolute inset-0 pattern-grid opacity-30" />
    </div>
  );
}
