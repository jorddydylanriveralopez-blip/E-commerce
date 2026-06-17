"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CheckCircle, Megaphone } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SectionBanner } from "@/components/SectionBanner";
import { comunidadConfig, yaavserAdTypes } from "@/lib/comunidad";
import { YaavserAdType } from "@/lib/types";

export default function ComunidadPublicarPage() {
  const { data: session, status } = useSession();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    type: "" as YaavserAdType | "",
    title: "",
    message: "",
    location: "",
    whatsapp: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.whatsapp.trim()) {
      fetch("/api/user/whatsapp", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp: form.whatsapp }),
      }).catch(() => {});
    }
    setSubmitted(true);
  }

  useEffect(() => {
    const userWhatsapp = session?.user?.whatsapp ?? session?.user?.phone;
    if (userWhatsapp) {
      setForm((prev) => (prev.whatsapp ? prev : { ...prev, whatsapp: userWhatsapp }));
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-neutral-400">
        Cargando...
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <SectionBanner
          variant="comunidad"
          title="Publicar en comunidad"
          subtitle="Inicia sesión para anunciarte entre distribuidores Yaavser."
          breadcrumbs={[
            { label: "Inicio", href: "/" },
            { label: "Comunidad", href: "/comunidad" },
            { label: "Publicar" },
          ]}
        />
        <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
        <div className="border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm">
          <LoginForm onSuccess={() => window.location.reload()} />
        </div>
      </div>
      </>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 sm:px-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center bg-yaav-600 text-white mb-6">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-neutral-900">
          ¡Anuncio publicado!
        </h1>
        <p className="mt-3 text-neutral-500 leading-relaxed">
          Tu aviso &ldquo;{form.title}&rdquo; ya está visible para otros Yaavsers.
          {comunidadConfig.isFreeLaunch && (
            <> Durante el lanzamiento es <strong className="text-neutral-900">100% gratis</strong>.</>
          )}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/comunidad" className="btn-premium inline-flex items-center justify-center px-6 py-3">
            Ver comunidad
          </Link>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setForm({
                type: "",
                title: "",
                message: "",
                location: "",
                whatsapp: session?.user?.whatsapp ?? session?.user?.phone ?? "",
              });
            }}
            className="inline-flex items-center justify-center border border-neutral-300 px-6 py-3 text-sm font-display uppercase tracking-wider text-neutral-900 hover:border-neutral-900 transition-colors"
          >
            Publicar otro
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SectionBanner
        variant="comunidad"
        title="Anúnciate entre Yaavsers"
        subtitle="Publica gratis durante el lanzamiento — red B2B para distribuidores."
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Comunidad", href: "/comunidad" },
          { label: "Publicar" },
        ]}
      />
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">

      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 bg-yaav-100 text-yaav-700 px-3 py-1 text-[10px] font-display font-semibold uppercase tracking-[0.15em] mb-4">
          <Megaphone className="h-3 w-3" />
          Gratis en lanzamiento
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900">
          Anúnciate entre Yaavsers
        </h1>
        <p className="mt-2 text-neutral-500 text-sm sm:text-base">
          Busca proveedor, ofrece servicios B2B o promociona mayoreo. Solo lo ven otros distribuidores.
        </p>
      </div>

      <div className="mb-8 border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
        <p>
          <span className="text-neutral-900 font-semibold">Hoy:</span> publicación gratis hasta{" "}
          {comunidadConfig.freeUntilLabel}.
        </p>
        <p className="mt-2">
          <span className="text-neutral-900 font-semibold">Después:</span> plan{" "}
          {comunidadConfig.futurePlanName} desde ${comunidadConfig.futurePriceMonthly}{" "}
          {comunidadConfig.currency}/mes para mantener tu anuncio destacado.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="type" className="block text-sm font-semibold text-neutral-700 mb-2">
            Tipo de anuncio *
          </label>
          <select
            id="type"
            required
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as YaavserAdType })}
            className="input-field border-b border-neutral-300"
          >
            <option value="">Selecciona el tipo</option>
            {yaavserAdTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-neutral-700 mb-2">
            Título *
          </label>
          <input
            id="title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ej: Busco distribuidor prepago zona norte"
            className="input-field border-b border-neutral-300"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-neutral-700 mb-2">
            Mensaje *
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Qué buscas u ofreces, volumen, zona, condiciones..."
            className="input-field resize-none border-b border-neutral-300"
          />
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-semibold text-neutral-700 mb-2">
            WhatsApp *
          </label>
          <input
            id="whatsapp"
            type="tel"
            required
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="55 1234 5678"
            className="input-field border-b border-neutral-300"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-neutral-700 mb-2">
            Ciudad / Zona *
          </label>
          <input
            id="location"
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Ej: Guadalajara, Jal."
            className="input-field border-b border-neutral-300"
          />
        </div>

        <button type="submit" className="w-full btn-premium py-4 text-sm min-h-[52px]">
          Publicar anuncio gratis
        </button>
      </form>
    </div>
    </>
  );
}
