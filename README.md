# Yaavstore — Marketplace de servicios Yaavser

Marketplace para que los **Yaavsers** promocionen y descubran servicios dentro de su comunidad.

## Características

- **Inicio** con hero, categorías, servicios destacados y recién publicados
- **Explorar** con búsqueda y filtros por categoría
- **Detalle de servicio** con contacto por WhatsApp (requiere login)
- **Publicar servicio** con formulario completo
- **Login:** Google/Gmail, Instagram, Facebook, correo o teléfono

## Autenticación

| Método | Configuración |
|--------|---------------|
| **Google / Gmail** | Google Cloud Console |
| **Instagram** | Meta for Developers (Instagram Login) |
| **Facebook** | Meta for Developers |
| **Correo** | Funciona sin config extra |
| **Teléfono** | OTP demo (código en pantalla) |

Copia `.env.example` a `.env.local` y activa los proveedores que necesites con `NEXT_PUBLIC_*_ENABLED=true`.

### Google / Gmail

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Crear credenciales OAuth
2. URI de redirección: `http://localhost:3000/api/auth/callback/google`
3. En `.env.local`:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   NEXT_PUBLIC_GOOGLE_ENABLED=true
   ```

### Instagram

1. [Meta for Developers](https://developers.facebook.com/) → Crear app → Instagram → Instagram Login
2. URI de redirección: `http://localhost:3000/api/auth/callback/instagram`
3. En `.env.local`:
   ```
   INSTAGRAM_CLIENT_ID=...
   INSTAGRAM_CLIENT_SECRET=...
   NEXT_PUBLIC_INSTAGRAM_ENABLED=true
   ```

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — **no uses Live Server (puerto 5500)**.

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · NextAuth
