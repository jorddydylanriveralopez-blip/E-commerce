"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated") return;

    function tryOpenWelcome() {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      setOpen(true);
    }

    const onFathersDayClosed = () => {
      setTimeout(tryOpenWelcome, 1200);
    };

    window.addEventListener(FATHERS_DAY_EVENT, onFathersDayClosed);
    return () => window.removeEventListener(FATHERS_DAY_EVENT, onFathersDayClosed);
  }, [status]);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  function handleSuccess() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
    window.location.reload();
  }

  if (!open || status === "authenticated") return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 safe-bottom">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={dismiss} aria-hidden />

      <div className="relative w-full max-w-lg bg-[#141414] border border-neutral-700 overflow-hidden shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 z-10 p-2 text-neutral-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        {!showLogin ? (
          <>
            <div className="relative h-48 sm:h-56 bg-neutral-900">
              <Image
                src={yaavImages.welcome}
                alt=""
                width={800}
                height={400}
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
            </div>
            <div className="px-6 sm:px-8 pb-8 pt-4 text-center">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Antes de que te vayas…
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mt-2">
                Estos son los más vendidos
              </h2>
              <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                Los servicios mejor calificados del barrio. Entra para contactar por WhatsApp.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/explorar" className="btn-premium" onClick={dismiss}>
                  Ver
                </Link>
                <button
                  type="button"
                  onClick={() => setShowLogin(true)}
                  className="btn-outline-urban px-6 py-3 text-xs"
                >
                  Entrar
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="px-6 sm:px-8 py-8">
            <div className="flex justify-center mb-5">
              <Logo href={null} size="md" tone="light" />
            </div>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-white text-center mb-6">
              Entra a tu cuenta
            </h2>
            <LoginForm compact onSuccess={handleSuccess} dark />
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="mt-4 w-full py-3 text-sm text-neutral-500 hover:text-white transition-colors"
            >
              ← Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
