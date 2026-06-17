export type SocialLink = {
  id: string;
  label: string;
  href: string;
  brand: string;
  hoverBg: string;
};

/** Enlaces de redes — configura en .env.local con NEXT_PUBLIC_SOCIAL_* */
export const socialLinks: SocialLink[] = [
  {
    id: "whatsapp",
    label: "Contáctanos",
    href: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP ?? "https://wa.me/525512345678",
    brand: "#25D366",
    hoverBg: "hover:bg-[#25D366]",
  },
  {
    id: "facebook",
    label: "Síguenos en Facebook",
    href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "https://facebook.com",
    brand: "#1877F2",
    hoverBg: "hover:bg-[#1877F2]",
  },
  {
    id: "instagram",
    label: "Síguenos en Instagram",
    href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "https://instagram.com",
    brand: "#E4405F",
    hoverBg: "hover:bg-gradient-to-br hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7]",
  },
  {
    id: "linkedin",
    label: "Conéctanos en LinkedIn",
    href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "https://linkedin.com",
    brand: "#0A66C2",
    hoverBg: "hover:bg-[#0A66C2]",
  },
  {
    id: "tiktok",
    label: "Mira nuestro TikTok",
    href: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK ?? "https://tiktok.com",
    brand: "#010101",
    hoverBg: "hover:bg-[#010101]",
  },
  {
    id: "email",
    label: "Escríbenos por correo",
    href: process.env.NEXT_PUBLIC_SOCIAL_EMAIL ?? "mailto:contacto@yaavstore.com",
    brand: "#0c1d4a",
    hoverBg: "hover:bg-yaavs-navy",
  },
];
