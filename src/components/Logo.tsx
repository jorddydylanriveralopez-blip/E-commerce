import Image from "next/image";
import Link from "next/link";

const sizes = {
  sm: "h-12 w-auto max-h-12 sm:h-14 sm:max-h-14",
  md: "h-14 w-auto max-h-14 sm:h-16 sm:max-h-16",
  /** Footer, popups */
  lg: "h-16 w-auto max-h-16 sm:h-[4.5rem] sm:max-h-[4.5rem]",
  /** Login, hero */
  xl: "h-20 w-auto max-h-20 sm:h-24 sm:max-h-24",
  /** Navbar — imponente en móvil, amplio en desktop */
  nav: [
    "h-[5rem] w-auto max-h-[5rem] max-w-[min(72vw,280px)]",
    "lg:h-[5rem] lg:max-h-[5rem] lg:max-w-[255px]",
    "xl:h-[5.5rem] xl:max-h-[5.5rem] xl:max-w-[290px]",
    "2xl:h-[6rem] 2xl:max-h-[6rem] 2xl:max-w-[320px]",
  ].join(" "),
} as const;

type LogoSize = keyof typeof sizes;

interface LogoProps {
  size?: LogoSize;
  className?: string;
  href?: string | null;
  priority?: boolean;
  /** light = logo blanco (navbar oscuro); dark = logo oscuro (footer, login) */
  tone?: "light" | "dark";
  /** Más presencia visual (navbar sobre hero) */
  prominent?: boolean;
}

export function Logo({
  size = "sm",
  className = "",
  href = "/",
  priority = false,
  tone = "light",
  prominent = false,
}: LogoProps) {
  const toneClass = tone === "dark" ? "brightness-0" : "";
  const prominentClass = prominent
    ? "drop-shadow-[0_3px_18px_rgba(0,0,0,0.55)]"
    : "";

  const image = (
    <Image
      src="/yaavstore-logo.png"
      alt="Yaavstore"
      width={793}
      height={315}
      className={`object-contain object-left ${sizes[size]} ${toneClass} ${prominentClass} ${className}`}
      priority={priority}
    />
  );

  if (!href) return image;

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center hover:opacity-90 transition-opacity"
      aria-label="Yaavstore — Inicio"
    >
      {image}
    </Link>
  );
}
