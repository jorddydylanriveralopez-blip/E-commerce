import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Configurar login — Yaavstore",
};

export default function ConfiguracionPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10 sm:px-6">
      <Link href="/entrar" className="inline-flex items-center gap-2 text-sm font-semibold text-yaav-700 hover:text-yaav-600 mb-6 sm:mb-8 min-h-[44px]">
        <ArrowLeft className="h-4 w-4" />
        Volver a entrar
      </Link>

      <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-yaav-950 mb-2">
        Configurar Google, Instagram y Facebook
      </h1>
      <p className="text-muted mb-6 sm:mb-8 text-sm sm:text-base">Guía paso a paso para activar el login social.</p>

      <div className="space-y-5 sm:space-y-6 text-sm text-muted leading-relaxed">
        <section className="glass-card rounded-lg p-5 sm:p-6 border-2 border-yaav-950 shadow-[3px_3px_0_#1c1917]">
          <h2 className="font-display font-bold uppercase tracking-wide text-yaav-600 text-base sm:text-lg mb-3">Paso 1 — Archivo .env.local</h2>
          <p className="mb-3">Crea <code className="text-rose-600">.env.local</code> en la carpeta del proyecto:</p>
          <pre className="rounded-md bg-stone-100 p-3 sm:p-4 text-[10px] sm:text-xs text-yaav-800 overflow-x-auto border-2 border-border">{`AUTH_SECRET=genera_uno_con_openssl_rand_base64_32

GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
NEXT_PUBLIC_GOOGLE_ENABLED=true

INSTAGRAM_CLIENT_ID=xxx
INSTAGRAM_CLIENT_SECRET=xxx
NEXT_PUBLIC_INSTAGRAM_ENABLED=true`}</pre>
          <p className="mt-3 text-yaav-800 text-xs sm:text-sm">Reinicia con <code>npm run dev</code> después de guardar.</p>
        </section>

        <section className="glass-card rounded-lg p-5 sm:p-6 border-2 border-yaav-950 shadow-[3px_3px_0_#eab308]">
          <h2 className="font-display font-bold uppercase tracking-wide text-yaav-700 text-base sm:text-lg mb-3">Google / Gmail</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li><a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-yaav-700 underline font-semibold">Google Cloud Console</a></li>
            <li>Credenciales OAuth → Aplicación web</li>
            <li>Redirección: <code className="text-yaav-800 text-xs break-all">http://localhost:3000/api/auth/callback/google</code></li>
          </ol>
        </section>

        <section className="glass-card rounded-lg p-5 sm:p-6 border-2 border-yaav-950 shadow-[3px_3px_0_#e11d48]">
          <h2 className="font-display font-bold uppercase tracking-wide text-rose-600 text-base sm:text-lg mb-3">Instagram</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li><a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-yaav-700 underline font-semibold">Meta for Developers</a></li>
            <li>App → Instagram → Instagram Login</li>
            <li>Redirección: <code className="text-yaav-800 text-xs break-all">http://localhost:3000/api/auth/callback/instagram</code></li>
          </ol>
        </section>
      </div>

      <Link href="/entrar" className="btn-neon mt-8 sm:mt-10 inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm min-h-[48px] w-full sm:w-auto">
        Ir a iniciar sesión
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
