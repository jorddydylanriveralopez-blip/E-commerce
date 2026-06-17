"use client";

import { useState } from "react";
import { useSession, getSession } from "next-auth/react";
import { X, LogIn } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { buildContactMessage, buildWhatsAppUrl, formatWhatsAppDisplay } from "@/lib/whatsapp";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface ContactActionsProps {
  listingId: string;
  providerName: string;
  providerWhatsapp: string;
  serviceTitle: string;
  priceLabel: string;
}

export function ContactActions({
  listingId,
  providerName,
  providerWhatsapp,
  serviceTitle,
  priceLabel,
}: ContactActionsProps) {
  const { data: session, status, update } = useSession();
  const [loginOpen, setLoginOpen] = useState(false);
  const [whatsappPromptOpen, setWhatsappPromptOpen] = useState(false);
  const [userWhatsapp, setUserWhatsapp] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function getListingUrl() {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/servicio/${listingId}`;
  }

  function openWhatsApp(buyerName: string) {
    const message = buildContactMessage({
      providerName,
      serviceTitle,
      price: priceLabel,
      buyerName,
      listingUrl: getListingUrl(),
    });
    const url = buildWhatsAppUrl(providerWhatsapp, message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleContactClick() {
    setError("");

    if (status !== "authenticated" || !session?.user) {
      setLoginOpen(true);
      return;
    }

    const buyerWhatsapp = session.user.whatsapp ?? session.user.phone;

    if (!buyerWhatsapp) {
      setWhatsappPromptOpen(true);
      return;
    }

    openWhatsApp(session.user.name ?? "Un Yaavser");
  }

  async function handleSaveWhatsapp(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/user/whatsapp", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp: userWhatsapp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await update({ whatsapp: data.whatsapp });
      setWhatsappPromptOpen(false);
      openWhatsApp(session?.user?.name ?? "Un Yaavser");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleShare() {
    const url = getListingUrl();
    const text = `${serviceTitle} — ${priceLabel} en Yaavstore`;

    if (navigator.share) {
      try {
        await navigator.share({ title: serviceTitle, text, url });
        return;
      } catch {
        /* user cancelled */
      }
    }

    await navigator.clipboard.writeText(url);
    alert("Enlace copiado al portapapeles");
  }

  async function handleLoginSuccess() {
    setLoginOpen(false);
    const newSession = await getSession();
    if (!newSession?.user) return;

    const buyerWhatsapp = newSession.user.whatsapp ?? newSession.user.phone;
    if (!buyerWhatsapp) {
      setWhatsappPromptOpen(true);
      return;
    }

    openWhatsApp(newSession.user.name ?? "Un Yaavser");
  }

  return (
    <>
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleContactClick}
          className="flex w-full items-center justify-center gap-2.5 rounded-md border-2 border-yaav-950 bg-[#25D366] py-3.5 text-sm font-display font-bold uppercase tracking-wide text-white shadow-[3px_3px_0_#1c1917] hover:bg-[#20bd5a] transition-all hover:-translate-y-0.5 min-h-[48px]"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Contactar por WhatsApp
        </button>

        <p className="text-center text-xs text-muted">
          {status === "authenticated"
            ? `WhatsApp del vendedor: ${formatWhatsAppDisplay(providerWhatsapp)}`
            : "Inicia sesión para contactar al vendedor"}
        </p>

        <button
          type="button"
          onClick={handleShare}
          className="w-full rounded-md btn-outline-urban py-3 text-sm min-h-[44px]"
        >
          Compartir servicio
        </button>
      </div>

      {loginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-yaav-950/60 backdrop-blur-sm"
            onClick={() => setLoginOpen(false)}
            aria-hidden
          />
          <div className="relative w-full max-w-md rounded-lg bg-white border-2 border-yaav-950 shadow-[6px_6px_0_#25D366] overflow-hidden">
            <div className="bg-[#25D366] px-6 py-5 text-white border-b-2 border-yaav-950">
              <button
                type="button"
                onClick={() => setLoginOpen(false)}
                className="absolute top-4 right-4 rounded-md border-2 border-white/40 p-1.5 hover:bg-white/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white/20 border-2 border-white/30">
                  <LogIn className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold uppercase text-lg">Entra para contactar</h3>
                  <p className="text-sm text-white/80">
                    Conéctate con {providerName} por WhatsApp
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <LoginForm compact onSuccess={handleLoginSuccess} />
            </div>
          </div>
        </div>
      )}

      {whatsappPromptOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-yaav-950/60 backdrop-blur-sm"
            onClick={() => setWhatsappPromptOpen(false)}
            aria-hidden
          />
          <div className="relative w-full max-w-sm rounded-lg bg-white border-2 border-yaav-950 p-6 shadow-[6px_6px_0_#25D366]">
            <button
              type="button"
              onClick={() => setWhatsappPromptOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-yaav-800"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#25D366]/10 text-[#25D366] border-2 border-[#25D366]/30 mb-4">
              <WhatsAppIcon className="h-6 w-6" />
            </div>

            <h3 className="font-display font-bold uppercase text-lg text-yaav-950">
              Vincula tu WhatsApp
            </h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Para que {providerName} pueda responderte, confirma tu número de WhatsApp.
            </p>

            <form onSubmit={handleSaveWhatsapp} className="mt-5 space-y-4">
              <div>
                <label htmlFor="user-wa" className="block text-sm font-medium text-yaav-800 mb-1.5">
                  Tu WhatsApp
                </label>
                <input
                  id="user-wa"
                  type="tel"
                  required
                  value={userWhatsapp}
                  onChange={(e) => setUserWhatsapp(e.target.value)}
                  placeholder="55 1234 5678"
                  className="input-field"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-md border-2 border-yaav-950 bg-[#25D366] py-3 text-sm font-display font-bold uppercase tracking-wide text-white shadow-[2px_2px_0_#1c1917] hover:bg-[#20bd5a] disabled:opacity-60 min-h-[48px]"
              >
                {saving ? "Guardando..." : "Continuar a WhatsApp"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
