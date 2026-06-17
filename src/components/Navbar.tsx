"use client";

import Link from "next/link";
import { Search, Menu, X, Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { UserMenu } from "@/components/auth/UserMenu";
import { YaavserTicker } from "@/components/YaavserTicker";
import { Logo } from "@/components/Logo";
import { CartButton } from "@/components/CartButton";
import { useCart } from "@/components/CartProvider";

const mainNavLinks = [
  { href: "/explorar?categoria=servicios", label: "Servicios" },
  { href: "/explorar?categoria=productos", label: "Productos" },
  { href: "/#categorias", label: "Categorías" },
  { href: "/comunidad", label: "Comunidad", badge: "Gratis" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openCart } = useCart();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const glassHeader = isHome && !scrolled && !mobileOpen;

  useEffect(() => {
    let ticking = false;

    function update() {
      setScrolled((prev) => {
        const next = window.scrollY > 20;
        return prev === next ? prev : next;
      });
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass =
    "font-display text-[11px] xl:text-xs font-semibold uppercase tracking-[0.08em] text-white/80 hover:text-white px-2.5 xl:px-3 py-2 rounded-md hover:bg-white/10 transition-colors whitespace-nowrap";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 safe-top ${
        glassHeader ? "site-header--glass" : "site-header--solid"
      }`}
    >
      <div className="site-header-utility utility-bar hidden sm:block border-b">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 lg:gap-5 px-4 sm:px-6 lg:px-8 py-2">
          <YaavserTicker light={glassHeader} />
          <div className="flex items-center gap-4 shrink-0 text-[10px] sm:text-[11px] uppercase tracking-wider border-l border-white/10 pl-3 lg:pl-4">
            <Link
              href="/configuracion"
              className="text-white/80 hover:text-white transition-colors"
            >
              Ayuda
            </Link>
            <span className="hidden lg:inline text-white/30">|</span>
            <span className="text-white/60">🇲🇽 México</span>
          </div>
        </div>
      </div>

      <div className="site-header-main border-b">
        <div className="mx-auto grid max-w-[1600px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 lg:gap-4 xl:gap-6 px-3 py-3.5 sm:px-6 lg:px-8 lg:py-3">
          <div className="shrink-0 min-w-0">
            <Logo priority size="nav" tone="light" prominent />
          </div>

          <nav className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1 min-w-0 overflow-hidden">
            {mainNavLinks.map((link) => (
              <Link key={`${link.href}-${link.label}`} href={link.href} className={`${linkClass} inline-flex items-center gap-1.5`}>
                {link.label}
                {"badge" in link && link.badge && (
                  <span className="rounded-sm bg-yaav-600 px-1 py-px text-[7px] font-bold tracking-wider text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-1 sm:gap-2 xl:gap-3 shrink-0">
            <form
              action="/explorar"
              className="header-search hidden 2xl:flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 min-w-[148px] transition-colors"
            >
              <Search className="h-3.5 w-3.5 text-white/50 shrink-0" />
              <input
                type="search"
                name="q"
                placeholder="Buscar"
                className="bg-transparent text-xs text-white placeholder:text-white/45 outline-none w-full font-display tracking-wide"
              />
            </form>

            <Link
              href="/explorar"
              className="hidden lg:flex 2xl:hidden p-2.5 text-white/75 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </Link>

            <span className="hidden lg:block w-px h-5 bg-white/15 mx-0.5 xl:mx-1" aria-hidden />

            <CartButton />

            <Link
              href="/explorar"
              className="hidden xl:flex p-2.5 text-white/75 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Favoritos"
            >
              <Heart className="h-4 w-4" />
            </Link>

            <span className="hidden lg:block w-px h-5 bg-white/15 mx-0.5 xl:mx-1" aria-hidden />

            <Link
              href="/publicar"
              className="hidden lg:inline-flex items-center justify-center rounded-md bg-white text-yaavs-navy px-3 xl:px-4 py-2 text-[10px] xl:text-[11px] font-display font-bold uppercase tracking-[0.1em] hover:bg-neutral-100 transition-colors whitespace-nowrap"
            >
              Publicar
            </Link>

            <UserMenu light />

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 text-white hover:bg-white/10 rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              aria-label="Menú"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-yaavs-navy border-t border-yaavs-navy-light/20 px-4 py-6 space-y-1 safe-bottom">
          <form action="/explorar" className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 mb-4">
            <Search className="h-4 w-4 text-white/50" />
            <input
              type="search"
              name="q"
              placeholder="Buscar servicios..."
              className="bg-transparent text-white text-sm outline-none w-full placeholder:text-white/40"
            />
          </form>
          {mainNavLinks.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="flex items-center justify-between font-display uppercase tracking-widest text-sm py-3 border-b border-white/10 text-white/80 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              <span>{link.label}</span>
              {"badge" in link && link.badge && (
                <span className="rounded-sm bg-yaav-600 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <Link
            href="/publicar"
            className="flex items-center font-display uppercase tracking-widest text-sm py-3 border-b border-white/10 text-white font-bold"
            onClick={() => setMobileOpen(false)}
          >
            Publicar
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              openCart();
            }}
            className="flex w-full items-center gap-3 font-display uppercase tracking-widest text-sm py-3 border-b border-white/10 text-white/80 hover:text-white"
          >
            <ShoppingCart className="h-4 w-4" />
            Mi carrito
          </button>
        </div>
      )}
    </header>
  );
}
