# Yaavstore Marketplace

See @README.md for overview and auth setup. See @package.json for npm scripts.

## Comunicación

- Responde en **español** salvo que el usuario pida otro idioma.
- Cambios mínimos y enfocados; no refactorizar código no relacionado.
- No hacer commit ni push salvo que el usuario lo pida explícitamente.

## Comandos

```bash
npm install
npm run dev          # desarrollo (puerto 3000)
npm run dev:fresh    # borra .next y reinicia — usar si hay error 500 o caché corrupta
npm run build
npm run lint
```

Abrir http://localhost:3000 — **no** usar Live Server (puerto 5500).

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · NextAuth v5

## Estructura clave

| Área | Ruta |
|------|------|
| Home | `src/app/page.tsx` |
| Layout / header offset | `src/app/layout.tsx` |
| Estilos globales + tokens | `src/app/globals.css` |
| Navbar (header electric) | `src/components/Navbar.tsx` |
| Carrusel hero | `src/components/PromoBanner.tsx` |
| Vitrina categorías | `src/components/CategoryGrid.tsx` |
| Franja confianza | `src/components/HeroTrustStrip.tsx` |
| Banners de sección | `src/components/SectionBanner.tsx` |
| Imágenes locales | `public/banners/`, `src/lib/images.ts` |
| Auth | `src/auth.ts`, `src/app/api/auth/` |

## Diseño y marca

### Paleta del logotipo (prioritaria en header y acentos UI)

- Cyan: `--color-logo-cyan` (#00e8ff)
- Teal: `--color-logo-teal` (#2dd4bf)
- Púrpura: `--color-logo-purple` (#a78bfa)
- Fondo night: `--color-logo-night` (#0a0b14)

El header usa `site-header--electric` con gradiente cyan → teal → púrpura. **No** volver al naranja en el header salvo petición explícita.

### Paleta secundaria

- Navy Yaavs: `--color-yaavs-navy`, `--color-yaavs-navy-dark`
- Naranja (CTAs legacy, badges fuera del header): `--color-yaav-500` y familia `yaav-*`

### Layout

- Header fijo; `main` con `pt-[var(--site-header-height)]` para que el contenido no quede detrás del navbar.
- Carrusel: **una imagen por slide**, ancho 100%, altura en `clamp()` en `.promo-carousel__frame`.
- Vitrina home: `content-wrap-90` (90vw) en secciones editoriales.

## Patrones de código

- Componentes de UI en `src/components/`; páginas en `src/app/`.
- Client components solo cuando hace falta interactividad (`"use client"`).
- Imágenes de banner: preferir `background-image` con URLs de `yaavImages` en lugar de `next/image fill` en contenedores sin altura definida.
- Estilos complejos del home/carousel/header van en `globals.css` con clases BEM (`promo-carousel__*`, `promo-hero-slide__*`, `site-header--*`).
- Reutilizar convenciones existentes (Montserrat, uppercase en nav, `font-display`).

## Problemas conocidos

| Síntoma | Solución |
|---------|----------|
| Error 500 / chunks rotos | `npm run dev:fresh` |
| Imágenes de banner no cargan | Verificar `public/banners/` y `src/lib/images.ts` |
| Carrusel detrás del header | Confirmar `pt-[var(--site-header-height)]` en `layout.tsx` |

## Git

- Rama activa de UI home: `cursor/section-banner-taller-sin-texto`
- Separar commits: UI home vs APIs/perfil/auth si hay cambios mezclados en el working tree.
