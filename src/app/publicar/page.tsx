"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ImagePlus } from "lucide-react";
import { categories } from "@/lib/data";
import { Category } from "@/lib/types";
import { LoginForm } from "@/components/auth/LoginForm";
import { PublishPageShell } from "@/components/PublishPageShell";
import { SectionBanner } from "@/components/SectionBanner";

function parseInitialCategory(value: string | null): Category | "" {
  if (value === "productos" || value === "servicios") return value;
  return "";
}

export default function PublishPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-20 text-center text-muted">
          Cargando...
        </div>
      }
    >
      <PublishContent />
    </Suspense>
  );
}

function PublishContent() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: parseInitialCategory(searchParams.get("categoria") ?? searchParams.get("tipo")),
    description: "",
    price: "",
    priceType: "desde" as "fijo" | "desde" | "hora" | "negociable",
    location: "",
    tags: "",
    whatsapp: "",
  });

  const isProduct = form.category === "productos";
  const isService = form.category === "servicios";
  const listingLabel = isProduct ? "producto" : isService ? "servicio" : "anuncio";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.category) return;

    setSubmitting(true);
    setSubmitError("");

    if (form.whatsapp.trim()) {
      fetch("/api/user/whatsapp", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp: form.whatsapp }),
      }).catch(() => {});
    }

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          price: form.price ? Number(form.price) : undefined,
          priceType: form.priceType,
          location: form.location,
          whatsapp: form.whatsapp,
          tags: form.tags,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(data.error ?? "No se pudo publicar. Intenta de nuevo.");
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Error de conexión. Revisa tu red e intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    const userWhatsapp = session?.user?.whatsapp ?? session?.user?.phone;
    if (userWhatsapp) {
      setForm((prev) => (prev.whatsapp ? prev : { ...prev, whatsapp: userWhatsapp }));
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-muted">
        Cargando...
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <SectionBanner
          variant="publicar"
          title="Publica en Yaavstore"
          subtitle="Inicia sesión para subir tu producto o servicio gratis."
        />
        <PublishPageShell>
          <div className="mx-auto max-w-md px-4 sm:px-6">
            <div className="publish-urban-panel">
              <LoginForm onSuccess={() => window.location.reload()} />
            </div>
          </div>
        </PublishPageShell>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <SectionBanner
          variant="publicar"
          title="¡Publicado!"
          subtitle={`Tu ${listingLabel} ya está visible en el marketplace.`}
        />
        <PublishPageShell>
        <div className="mx-auto max-w-lg px-4 sm:px-6">
          <div className="publish-urban-panel publish-urban-panel--success py-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-yaav-600 text-white shadow-[4px_4px_0_#1c1917] mb-6">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-yaav-950">
              ¡Listo, ya está arriba!
            </h1>
            <p className="mt-3 text-muted leading-relaxed">
              Tu {listingLabel} &ldquo;{form.title}&rdquo; ya está visible en el marketplace Yaavser.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/explorar"
                className="btn-neon inline-flex items-center justify-center rounded-md px-6 py-3 text-sm min-h-[48px]"
              >
                Ver marketplace
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    title: "",
                    category: "",
                    description: "",
                    price: "",
                    priceType: "desde",
                    location: "",
                    tags: "",
                    whatsapp: session?.user?.whatsapp ?? session?.user?.phone ?? "",
                  });
                }}
                className="btn-outline-urban inline-flex items-center justify-center rounded-md px-6 py-3 text-sm min-h-[48px]"
              >
                Publicar otro
              </button>
            </div>
          </div>
        </div>
        </PublishPageShell>
      </>
    );
  }

  return (
    <>
      <SectionBanner
        variant="publicar"
        title="Publica tu producto o servicio"
        subtitle="Gratis · Sin comisión — los compradores te contactan por WhatsApp."
      />
      <PublishPageShell>
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="publish-urban-panel">
          <div className="mb-8">
            <span className="badge-bait-yellow inline-block rounded-sm px-3 py-1 text-xs mb-4 rotate-[-1deg]">
              Gratis · Sin comisión
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-yaav-950">
              Publica tu producto o servicio
            </h1>
            <p className="mt-2 text-muted">
              Elige qué quieres subir y completa el formulario. Los compradores te contactan por WhatsApp.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset>
          <legend className="block text-sm font-semibold text-yaav-800 mb-3">
            ¿Qué vas a publicar? *
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat) => {
              const selected = form.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      category: cat.id,
                      priceType:
                        cat.id === "productos" && prev.priceType === "hora" ? "desde" : prev.priceType,
                    }))
                  }
                  className={`flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all min-h-[120px] ${
                    selected
                      ? "border-yaavs-navy bg-yaavs-navy text-white shadow-[3px_3px_0_#1c1917]"
                      : "border-neutral-300 bg-white text-neutral-900 hover:border-yaavs-navy hover:shadow-sm"
                  }`}
                  aria-pressed={selected}
                >
                  <span className="text-3xl mb-2" aria-hidden>
                    {cat.icon}
                  </span>
                  <span className="font-display text-sm font-bold uppercase tracking-wide">
                    {cat.label}
                  </span>
                  <span
                    className={`mt-1 text-xs leading-relaxed ${
                      selected ? "text-white/80" : "text-neutral-500"
                    }`}
                  >
                    {cat.description}
                  </span>
                </button>
              );
            })}
          </div>
          {!form.category && (
            <p className="mt-2 text-xs text-neutral-500">Selecciona producto o servicio para continuar.</p>
          )}
        </fieldset>

        <div className={`space-y-6 transition-opacity ${form.category ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
        <div className="rounded-lg border-2 border-dashed border-yaav-400 bg-yaav-50 p-8 text-center shadow-[3px_3px_0_rgba(28,25,23,0.06)]">
          <ImagePlus className="mx-auto h-10 w-10 text-yaav-400 mb-3" />
          <p className="text-sm font-medium text-yaav-700">
            Arrastra fotos aquí o haz clic para subir
          </p>
          <p className="text-xs text-muted mt-1">JPG, PNG hasta 5 MB (demo)</p>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-yaav-800 mb-2">
            Título del {listingLabel} *
          </label>
          <input
            id="title"
            required
            disabled={!form.category}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={
              isProduct
                ? "Ej: Samsung Galaxy A15, chip prepago, kit accesorios..."
                : isService
                  ? "Ej: Plan pospago 50GB, activación a domicilio, portabilidad..."
                  : "Ej: Plan pospago, chip prepago, Samsung Galaxy..."
            }
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-yaav-800 mb-2">
            Descripción *
          </label>
          <textarea
            id="description"
            required
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder={
              isProduct
                ? "Marca, modelo, condición, garantía, qué incluye el paquete..."
                : isService
                  ? "Plan, cobertura, activación, condiciones, horarios..."
                  : "Describe tu producto o servicio..."
            }
            className="input-field resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-yaav-800 mb-2">
              Precio (MXN)
            </label>
            <input
              id="price"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="500"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="priceType" className="block text-sm font-semibold text-yaav-800 mb-2">
              Tipo de precio
            </label>
            <select
              id="priceType"
              value={form.priceType}
              onChange={(e) =>
                setForm({
                  ...form,
                  priceType: e.target.value as typeof form.priceType,
                })
              }
              className="input-field bg-white"
            >
              <option value="desde">Desde</option>
              <option value="fijo">Precio fijo</option>
              {isService && <option value="hora">Por hora</option>}
              <option value="negociable">Negociable</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-semibold text-yaav-800 mb-2">
            WhatsApp de contacto *
          </label>
          <input
            id="whatsapp"
            type="tel"
            required
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="55 1234 5678"
            className="input-field"
          />
          <p className="mt-1.5 text-xs text-muted">
            Los compradores te contactarán por WhatsApp a este número
          </p>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-yaav-800 mb-2">
            Ciudad / Zona *
          </label>
          <input
            id="location"
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Ej: Ciudad de México, Polanco"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-semibold text-yaav-800 mb-2">
            Etiquetas
          </label>
          <input
            id="tags"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder={isProduct ? "Nuevo, Garantía, Envío local" : "A domicilio, Sin plazo, Urgencias"}
            className="input-field"
          />
        </div>

        {submitError && (
          <p className="text-sm text-red-600 font-medium" role="alert">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={!form.category || submitting}
          className="w-full rounded-md btn-neon py-4 text-base min-h-[52px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting
            ? "Publicando..."
            : form.category
              ? `Publicar ${listingLabel}`
              : "Elige producto o servicio"}
        </button>
        </div>
      </form>
        </div>
      </div>
    </PublishPageShell>
    </>
  );
}
