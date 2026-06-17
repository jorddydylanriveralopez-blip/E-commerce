import { Smartphone, Wifi, Signal } from "lucide-react";

const PLECAS = [
  { text: "PREPAGO", top: "12%", left: "6%", rotate: -12, delay: "0s" },
  { text: "5G YAAVS", top: "22%", right: "8%", rotate: 8, delay: "1.2s" },
  { text: "CHIP", top: "48%", left: "4%", rotate: 6, delay: "2s" },
  { text: "POSPAGO", top: "62%", right: "5%", rotate: -8, delay: "0.8s" },
  { text: "SIN COMISIÓN", top: "78%", left: "10%", rotate: -4, delay: "1.6s" },
  { text: "PORTABILIDAD", top: "38%", right: "3%", rotate: 10, delay: "2.4s" },
] as const;

const PHONES = [
  { top: "18%", left: "18%", size: 56, delay: "0s", duration: "7s" },
  { top: "55%", left: "12%", size: 44, delay: "1.5s", duration: "8s" },
  { top: "72%", right: "15%", size: 52, delay: "0.5s", duration: "6.5s" },
  { top: "30%", right: "20%", size: 40, delay: "2s", duration: "7.5s" },
  { top: "85%", left: "45%", size: 36, delay: "1s", duration: "9s" },
] as const;

const CHIPS = [
  { top: "42%", left: "22%", delay: "0.3s" },
  { top: "68%", right: "22%", delay: "1.8s" },
  { top: "25%", right: "12%", delay: "2.2s" },
] as const;

export function FloatingTechBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 pattern-mesh opacity-40 sm:opacity-60" />
      <div className="hidden sm:block">
        <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-yaavs-navy/[0.07] blur-3xl" />
        <div className="absolute bottom-20 left-0 h-56 w-56 rounded-full bg-yaav-500/[0.1] blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-yaavs-navy/[0.06] blur-2xl" />
      </div>

      <div className="hidden md:contents">
        {PLECAS.map((pleca) => (
          <div
            key={pleca.text}
            className="floating-tech-item absolute font-display text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-yaavs-navy/40 border border-yaavs-navy/20 bg-white/80 px-3 py-1.5 shadow-md backdrop-blur-sm rounded-sm"
            style={{
              top: pleca.top,
              left: "left" in pleca ? pleca.left : undefined,
              right: "right" in pleca ? pleca.right : undefined,
              ["--rot" as string]: `${pleca.rotate}deg`,
              ["--delay" as string]: pleca.delay,
            }}
          >
            {pleca.text}
          </div>
        ))}

        {PHONES.map((phone, i) => (
          <div
            key={`phone-${i}`}
            className="floating-tech-item absolute text-yaavs-navy/35"
            style={{
              top: phone.top,
              left: "left" in phone ? phone.left : undefined,
              right: "right" in phone ? phone.right : undefined,
              ["--delay" as string]: phone.delay,
              ["--duration" as string]: phone.duration,
            }}
          >
            <Smartphone style={{ width: phone.size, height: phone.size }} strokeWidth={1.25} />
          </div>
        ))}

        {CHIPS.map((chip, i) => (
          <div
            key={`chip-${i}`}
            className="floating-tech-item absolute"
            style={{
              top: chip.top,
              left: "left" in chip ? chip.left : undefined,
              right: "right" in chip ? chip.right : undefined,
              ["--delay" as string]: chip.delay,
            }}
          >
            <div className="relative h-10 w-14 rounded-[4px] border border-yaavs-navy/25 bg-gradient-to-br from-amber-100/90 to-white shadow-md opacity-70">
              <div className="absolute bottom-1 left-1 right-1 h-2 rounded-sm bg-yaavs-navy/10" />
              <span className="absolute inset-0 flex items-center justify-center text-[7px] font-display font-bold text-yaavs-navy/35">
                SIM
              </span>
            </div>
          </div>
        ))}

        <Wifi
          className="floating-tech-item absolute top-[50%] left-[8%] text-yaav-500/15"
          style={{ width: 48, height: 48, ["--delay" as string]: "1.2s" }}
          strokeWidth={1.25}
        />
        <Signal
          className="floating-tech-item absolute top-[20%] left-[42%] hidden lg:block text-yaavs-navy/15"
          style={{ width: 40, height: 40, ["--delay" as string]: "2.5s" }}
          strokeWidth={1.25}
        />

        <span className="floating-tech-item absolute top-[58%] right-[28%] text-4xl opacity-[0.18] select-none" style={{ ["--delay" as string]: "0.7s" }}>
          📱
        </span>
        <span className="floating-tech-item absolute top-[33%] left-[28%] text-3xl opacity-[0.15] select-none" style={{ ["--delay" as string]: "1.9s" }}>
          📶
        </span>
      </div>
    </div>
  );
}
