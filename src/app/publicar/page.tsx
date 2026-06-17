"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, CheckCircle, ImagePlus } from "lucide-react";
import { categories } from "@/lib/data";
import { Category } from "@/lib/types";
import { LoginForm } from "@/components/auth/LoginForm";
import { SectionBanner } from "@/components/SectionBanner";
import { yaavImages } from "@/lib/images";

export default function PublishPage() {
  const { data: session, status } = useSession();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "" as Category | "",
    description: "",
    price: "",
    priceType: "desde" as "fijo" | "desde" | "hora" | "negociable",
    location: "",
    tags: "",
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
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-muted">
        Cargando...
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <SectionBanner variant="publicar" image={yaavImages.bannerPublicar} imageAlt="Publicar en Yaavstore" />
        <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-yaav-600 hover:text-yaav-800 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Inicio
        </Link>
        <div className="glass-card rounded-lg p-5 sm:p-6 border-2 border-yaav-950 shadow-[4px_4px_0_#ea580c]">
          <LoginForm onSuccess={() => window.location.reload()} />
        </div>
      </div>
      </>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 sm:px-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-yaav-600 text-white shadow-[4px_4px_0_#1c1917] mb-6">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-yaav-950">
          ¡Listo, ya está arriba!
        </h1>
        <p className="mt-3 text-muted leading-relaxed">
          Tu servicio &ldquo;{form.title}&rdquo; ya está visible para la comunidad
          Yaavser. (Demo: en producción se guardaría en la base de datos.)
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
    );
  }

  return (
    <>
      <SectionBanner variant="publicar" image={yaavImages.bannerPublicar} imageAlt="Publicar en Yaavstore" />
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-yaav-600 hover:text-yaav-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Inicio
      </Link>

      <div className="mb-8">
        <span className="badge-bait-yellow inline-block rounded-sm px-3 py-1 text-xs mb-4 rotate-[-1deg]">
          Gratis · Sin comisión
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-yaav-950">
          Publica tu servicio
        </h1>
        <p className="mt-2 text-muted">
          Planes, chips, equipos o lo que vendas. Súbelo y que te contacten por WhatsApp.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border-2 border-dashed border-yaav-400 bg-yaav-50 p-8 text-center shadow-[3px_3px_0_rgba(28,25,23,0.06)]">
          <ImagePlus className="mx-auto h-10 w-10 text-yaav-400 mb-3" />
          <p className="text-sm font-medium text-yaav-700">
            Arrastra fotos aquí o haz clic para subir
          </p>
          <p className="text-xs text-muted mt-1">JPG, PNG hasta 5 MB (demo)</p>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-yaav-800 mb-2">
            Título del servicio *
          </label>
          <input
            id="title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ej: Plan pospago 50GB, chip prepago, Samsung Galaxy..."
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-yaav-800 mb-2">
            Categoría *
          </label>
          <select
            id="category"
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
            className="input-field bg-white"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
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
            placeholder="Describe tu producto o servicio: plan, chip, equipo, cobertura, condiciones..."
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
              <option value="hora">Por hora</option>
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
            placeholder="A domicilio, Garantía, Urgencias (separadas por coma)"
            className="input-field"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md btn-neon py-4 text-base min-h-[52px]"
        >
          Publicar servicio
        </button>
      </form>
    </div>
    </>
  );
}
