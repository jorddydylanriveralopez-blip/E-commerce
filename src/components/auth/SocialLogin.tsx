"use client";

import { signIn } from "next-auth/react";
import { Loader2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

interface SocialLoginProps {
  loading: boolean;
  setLoading: (v: boolean) => void;
  setError: (v: string) => void;
  callbackUrl?: string;
}

export function SocialLogin({
  loading,
  setLoading,
  setError,
  callbackUrl = "/",
}: SocialLoginProps) {
  const [showGuide, setShowGuide] = useState(false);
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true";
  const instagramEnabled = process.env.NEXT_PUBLIC_INSTAGRAM_ENABLED === "true";
  const facebookEnabled = process.env.NEXT_PUBLIC_FACEBOOK_ENABLED === "true";
  const hasSocial = googleEnabled || instagramEnabled || facebookEnabled;

  async function handleOAuth(provider: string) {
    setLoading(true);
    setError("");
    await signIn(provider, { callbackUrl });
  }

  if (!hasSocial) {
    return (
      <div className="rounded-md border-2 border-yaav-950 bg-yaav-50 overflow-hidden shadow-[2px_2px_0_#1c1917]">
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left text-sm text-yaav-800 hover:bg-yaav-100 transition-colors min-h-[48px]"
        >
          <span>
            <span className="font-display font-bold uppercase tracking-wide text-yaav-700">¿Activar Google o Instagram?</span>
            <span className="block text-xs text-muted mt-0.5 font-body normal-case">Toca aquí — guía paso a paso</span>
          </span>
          {showGuide ? <ChevronUp className="h-4 w-4 shrink-0 text-yaav-600" /> : <ChevronDown className="h-4 w-4 shrink-0 text-yaav-600" />}
        </button>

        {showGuide && (
          <div className="border-t-2 border-yaav-950 px-4 py-4 space-y-3 text-xs text-muted leading-relaxed">
            <div className="space-y-2">
              <p className="font-semibold text-yaav-800">1. Crea <code className="text-rose-600">.env.local</code> en la carpeta del proyecto</p>
              <p className="font-semibold text-yaav-800">2. Agrega tus credenciales:</p>
              <pre className="rounded-md bg-stone-100 p-3 text-[10px] text-yaav-800 overflow-x-auto border-2 border-border">
{`GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
NEXT_PUBLIC_GOOGLE_ENABLED=true

INSTAGRAM_CLIENT_ID=xxx
INSTAGRAM_CLIENT_SECRET=xxx
NEXT_PUBLIC_INSTAGRAM_ENABLED=true`}
              </pre>
              <p className="font-semibold text-yaav-800">3. Reinicia:</p>
              <code className="block rounded-md bg-stone-100 px-3 py-2 text-yaav-800 border-2 border-border">npm run dev</code>
            </div>
            <Link
              href="/configuracion"
              className="inline-flex items-center gap-1.5 text-yaav-700 hover:text-yaav-600 font-semibold min-h-[44px]"
            >
              Guía completa con enlaces
              <ExternalLink className="h-3 w-3" />
            </Link>
            <p className="text-yaav-800">
              Mientras tanto, entra con <strong>correo</strong> o <strong>celular</strong> abajo — no necesitan configuración.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {googleEnabled && (
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-md border-2 border-yaav-950 bg-white py-3.5 text-sm font-display font-bold uppercase tracking-wide text-yaav-900 shadow-[3px_3px_0_#1c1917] transition-all hover:shadow-[4px_4px_0_#ea580c] hover:-translate-y-0.5 disabled:opacity-60 min-h-[48px]"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin text-yaav-400" /> : <GoogleIcon />}
          Google / Gmail
        </button>
      )}

      {instagramEnabled && (
        <button
          type="button"
          onClick={() => handleOAuth("instagram")}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-md border-2 border-yaav-950 bg-gradient-to-r from-[#833AB4] via-rose-500 to-yellow-500 py-3.5 text-sm font-display font-bold uppercase tracking-wide text-white shadow-[3px_3px_0_#1c1917] disabled:opacity-60 min-h-[48px]"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <InstagramIcon />}
          Instagram
        </button>
      )}

      {facebookEnabled && (
        <button
          type="button"
          onClick={() => handleOAuth("facebook")}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-md border-2 border-yaav-950 bg-[#1877F2] py-3.5 text-sm font-display font-bold uppercase tracking-wide text-white shadow-[3px_3px_0_#1c1917] hover:bg-[#166fe5] disabled:opacity-60 min-h-[48px]"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <FacebookIcon />}
          Facebook
        </button>
      )}

      <div className="relative flex items-center gap-3 pt-1">
        <div className="h-0.5 flex-1 bg-yaav-950/15" />
        <span className="text-xs text-muted font-semibold uppercase tracking-wide">o con correo / cel</span>
        <div className="h-0.5 flex-1 bg-yaav-950/15" />
      </div>
    </div>
  );
}
