"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { yaavImages } from "@/lib/images";
import { LoginForm } from "./LoginForm";
import { FATHERS_DAY_EVENT } from "@/components/FathersDayPromo";
import { Logo } from "@/components/Logo";

const STORAGE_KEY = "yaavstore-welcome-dismissed";

export function WelcomeGate() {
  const { status } = useSession();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    if (status === "loading") return;
    if (status === "authenticated") return;

    function tryOpenWelcome() {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      setOpen(true);
    }

    const onFathersDayClosed = () => {
      setTimeout(tryOpenWelcome, 1200);
    };

    const fallback = setTimeout(tryOpenWelcome, 8000);

    window.addEventListener(FATHERS_DAY_EVENT, onFathersDayClosed);
    return () => {
      clearTimeout(fallback);
      window.removeEventListener(FATHERS_DAY_EVENT, onFathersDayClosed);
    };
  }, [status, isHome]);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  function handleSuccess() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
    window.location.reload();
  }

  if (!isHome || !open || status === "authenticated") return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 safe-bottom">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={dismiss} aria-hidden />

      <div
        className="relative flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-white/10 bg-neutral-950 shadow-2xl"
        role="dialog"
        aria-labelledby="welcome-gate-title"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/90 transition-colors hover:bg-black/70 hover:text-white"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        {!showLogin ? (
          <>
            <div className="relative h-52 shrink-0 sm:h-56">
              <Image
                src={yaavImages.bannerEquipos}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 28rem"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
            </div>

            <div className="relative z-10 -mt-10 shrink-0 px-6 pb-7 pt-0 text-center sm:px-8">
              <p className="font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
                Antes de que te vayas…
              </p>
              <h2
                id="welcome-gate-title"
                className="font-display mt-2 text-xl font-bold uppercase tracking-tight text-white sm:text-2xl"
              >
                Estos son los más vendidos
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                Los servicios mejor calificados del barrio. Entra para contactar por WhatsApp.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/explorar"
                  className="btn-premium inline-flex min-h-[48px] items-center justify-center px-8"
                  onClick={dismiss}
                >
                  Ver
                </Link>
                <button
                  type="button"
                  onClick={() => setShowLogin(true)}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-md border border-white/25 bg-transparent px-8 font-display text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-white/50 hover:bg-white/10"
                >
                  Entrar
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="px-6 py-8 sm:px-8">
            <div className="mb-5 flex justify-center">
              <Logo href={null} size="md" tone="light" />
            </div>
            <h2 className="mb-6 text-center font-display text-xl font-bold uppercase tracking-tight text-white">
              Entra a tu cuenta
            </h2>
            <LoginForm compact onSuccess={handleSuccess} dark />
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="mt-4 w-full py-3 text-sm text-neutral-500 transition-colors hover:text-white"
            >
              ← Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
