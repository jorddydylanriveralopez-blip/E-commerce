# AGENTS.md

See `README.md` and `CLAUDE.md` for the project overview, scripts, and structure.

## Cursor Cloud specific instructions

Yaavstore marketplace: Next.js 15 + React 19 + Tailwind 4 + NextAuth v5. Dev server on `http://localhost:3000` (`npm run dev`). Do not use Live Server / port 5500.

### Required env (`.env.local`, gitignored — recreate per fresh VM)
NextAuth v5 requires a secret. Create it once before running the dev server:
```bash
printf 'AUTH_SECRET=%s\n' "$(openssl rand -base64 32)" > .env.local
```
Alternatively provide `AUTH_SECRET` as an injected environment variable. Enabling Google/Instagram/Facebook OAuth is optional and needs the provider `*_CLIENT_ID/SECRET` vars (see `README.md` / `CONFIGURACION-LOGIN.md`).

### Runs without external services
- No database needed: `DATABASE_URL` is optional. Without it, listings fall back to mock data (`src/lib/data.ts`); with it, DB listings are merged in (`src/lib/listings.ts`).
- Accounts persist to gitignored `data/users.json`. **Email** and **phone (OTP shown on screen)** login work with no OAuth config — use these for end-to-end testing.

### Gotcha: 500 / broken chunks after a production build
`npm run build` writes a production `.next` cache. Starting `npm run dev` afterward can 500 on a mixed cache. Fix with `npm run dev:fresh` (clears `.next`). The `dev` script auto-detects a production cache, but `dev:fresh` is the reliable recovery.
