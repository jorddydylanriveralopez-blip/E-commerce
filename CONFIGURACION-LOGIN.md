# 🔐 Cómo activar Google, Instagram y Facebook en Yaavstore

Sigue estos pasos **una sola vez**. Al terminar, reinicia el servidor con `npm run dev`.

---

## Paso 1 — Crear el archivo `.env.local`

En la carpeta del proyecto (`Marketplace e-commerce`), crea un archivo llamado **`.env.local`** (si no existe).

Copia esto como base:

```env
AUTH_SECRET=cambia-esto-por-un-texto-largo-random

# Activa los que configures abajo:
# NEXT_PUBLIC_GOOGLE_ENABLED=true
# NEXT_PUBLIC_INSTAGRAM_ENABLED=true
# NEXT_PUBLIC_FACEBOOK_ENABLED=true
```

**AUTH_SECRET:** genera uno en la terminal con:
```bash
openssl rand -base64 32
```
Pega el resultado en `AUTH_SECRET=...`

---

## Paso 2 — Google / Gmail

1. Ve a [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Crea un proyecto (o usa uno existente)
3. Ve a **APIs y servicios → Credenciales → Crear credenciales → ID de cliente OAuth**
4. Tipo de aplicación: **Aplicación web**
5. En **URIs de redirección autorizados** agrega:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Copia el **ID de cliente** y el **Secreto del cliente**
7. En `.env.local` agrega:

```env
GOOGLE_CLIENT_ID=123456789-xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-tu_secreto_aqui
NEXT_PUBLIC_GOOGLE_ENABLED=true
```

---

## Paso 3 — Instagram

1. Ve a [Meta for Developers](https://developers.facebook.com/)
2. **Mis apps → Crear app** → tipo **Otro** o **Negocio**
3. Agrega el producto **Instagram** → **API setup with Instagram Login**
4. En configuración de Instagram Login, agrega URI de redirección:
   ```
   http://localhost:3000/api/auth/callback/instagram
   ```
5. Copia **Instagram App ID** y **Instagram App Secret**
6. En `.env.local` agrega:

```env
INSTAGRAM_CLIENT_ID=tu_instagram_app_id
INSTAGRAM_CLIENT_SECRET=tu_instagram_app_secret
NEXT_PUBLIC_INSTAGRAM_ENABLED=true
```

> Instagram requiere cuenta de desarrollador de Meta. La app puede estar en modo prueba al inicio.

---

## Paso 4 — Facebook (opcional)

1. En la misma app de Meta, agrega **Facebook Login**
2. URI de redirección:
   ```
   http://localhost:3000/api/auth/callback/facebook
   ```
3. En `.env.local`:

```env
FACEBOOK_CLIENT_ID=tu_app_id
FACEBOOK_CLIENT_SECRET=tu_app_secret
NEXT_PUBLIC_FACEBOOK_ENABLED=true
```

---

## Paso 5 — Reiniciar y probar

```bash
npm run dev
```

Abre **http://localhost:3000/entrar** — deberías ver los botones de Google, Instagram y/o Facebook.

---

## ¿Problemas comunes?

| Error | Solución |
|-------|----------|
| No aparecen los botones | Verifica que `NEXT_PUBLIC_*_ENABLED=true` esté sin `#` al inicio |
| `redirect_uri_mismatch` | La URI en Google/Meta debe ser **exactamente** la de arriba |
| Cambié `.env.local` y no funciona | Detén el servidor (Ctrl+C) y vuelve a correr `npm run dev` |
| Solo quiero probar rápido | Usa **correo** o **teléfono** — no necesitan configuración |

---

## Ejemplo completo de `.env.local`

```env
AUTH_SECRET=abc123xyz789randomsecret32chars!!

GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
NEXT_PUBLIC_GOOGLE_ENABLED=true

INSTAGRAM_CLIENT_ID=123456789
INSTAGRAM_CLIENT_SECRET=abc123
NEXT_PUBLIC_INSTAGRAM_ENABLED=true

FACEBOOK_CLIENT_ID=123456789
FACEBOOK_CLIENT_SECRET=abc123
NEXT_PUBLIC_FACEBOOK_ENABLED=true
```

¡Listo! 🚀
