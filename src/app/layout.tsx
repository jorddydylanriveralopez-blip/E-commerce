import type { Metadata } from "next";
import { Oswald, Nunito } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/CartProvider";
import { StickyPromoBar } from "@/components/StickyPromoBar";
import { FloatingSocialBar } from "@/components/FloatingSocialBar";
import { DeferredWidgets } from "@/components/DeferredWidgets";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
  weight: ["500", "600", "700"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yaavstore — El marketplace del barrio Yaavser",
  description:
    "Publica y encuentra servicios de puestos, locales y oficios. Del barrio, para el barrio.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${oswald.variable} ${nunito.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
          <DeferredWidgets />
          <div className="relative z-[1]">
            <Navbar />
            <main className="[&:not(:has(.hero-banner))]:pt-[var(--site-header-height)]">{children}</main>
            <Footer />
          </div>
          <StickyPromoBar />
          <FloatingSocialBar />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
