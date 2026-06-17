"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Camera, CheckCircle, Package, ShoppingBag, Star } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { PublishPageShell } from "@/components/PublishPageShell";
import { SectionBanner } from "@/components/SectionBanner";

type ProfileData = {
  name: string;
  email?: string;
  whatsapp: string;
  image?: string;
  birthDate: string;
  bio: string;
  sellerRating: number;
  sellerReviewCount: number;
  provider?: string;
  memberSince?: string;
};

function SellerRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="rounded-lg border border-yaav-200 bg-yaav-50/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-yaav-700 mb-2">
        Calificación como vendedor
      </p>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-neutral-300"
              }`}
            />
          ))}
        </div>
        <span className="font-display text-2xl font-bold text-yaav-950">{rating.toFixed(1)}</span>
      </div>
      <p className="mt-1.5 text-xs text-muted">
        {count === 0
          ? "Aún sin reseñas — empieza a vender para recibir calificaciones"
          : `${count} reseña${count !== 1 ? "s" : ""} de compradores`}
      </p>
    </div>
  );
}

function avatarSrc(image?: string | null) {
  if (!image) return null;
  if (image.startsWith("/api/user/avatar")) return image;
  return image;
}

export default function PerfilPage() {
  const { data: session, status, update } = useSession();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileData>({
    name: "",
    whatsapp: "",
    birthDate: "",
    bio: "",
    sellerRating: 5,
    sellerReviewCount: 0,
  });

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    fetch("/api/user/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.profile) {
          setForm({
            name: data.profile.name ?? "",
            email: data.profile.email,
            whatsapp: data.profile.whatsapp ?? "",
            image: data.profile.image,
            birthDate: data.profile.birthDate ?? "",
            bio: data.profile.bio ?? "",
            sellerRating: data.profile.sellerRating ?? 5,
            sellerReviewCount: data.profile.sellerReviewCount ?? 0,
            provider: data.profile.provider,
            memberSince: data.profile.memberSince,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSaved(false);

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const body = new FormData();
    body.append("avatar", file);

    try {
      const res = await fetch("/api/user/avatar", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo subir la foto");
        setPreview(null);
        return;
      }

      setForm((prev) => ({ ...prev, image: data.image }));
      await update({ image: data.image });
    } catch {
      setError("Error al subir la imagen");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          birthDate: form.birthDate,
          bio: form.bio,
          whatsapp: form.whatsapp,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo guardar");
        return;
      }

      if (data.profile) {
        setForm((prev) => ({ ...prev, ...data.profile }));
        await update({
          name: data.profile.name,
          whatsapp: data.profile.whatsapp,
          bio: data.profile.bio,
          birthDate: data.profile.birthDate,
        });
      }

      setSaved(true);
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  const displayImage = preview ?? avatarSrc(form.image ?? session?.user?.image);
  const initials =
    form.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "Y";

  if (status === "loading" || loading) {
    return (
      <PublishPageShell>
        <div className="mx-auto max-w-lg px-4 py-20 text-center text-white/80">
          Cargando...
        </div>
      </PublishPageShell>
    );
  }

  if (!session) {
    return (
      <>
        <SectionBanner
          variant="perfil"
          title="Mi perfil"
          subtitle="Inicia sesión para ver y editar tu cuenta de Yaavser."
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

  return (
    <>
      <SectionBanner
        variant="perfil"
        title={form.name || "Mi perfil"}
        subtitle="Tu cuenta, reputación y datos de contacto."
      />
      <PublishPageShell>
      <div className="mx-auto max-w-xl px-4 sm:px-6">

        <div className="publish-urban-panel">
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-yaav-950 mb-1">
            Mi perfil
          </h1>
          <p className="text-sm text-muted mb-6">
            Personaliza cómo te ven los compradores en Yaavstore
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 mb-8 pb-8 border-b border-neutral-200">
            <div className="relative shrink-0">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={form.name}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover border-2 border-yaav-950 shadow-[3px_3px_0_#ea580c]"
                  unoptimized={displayImage.startsWith("/api/") || displayImage.startsWith("blob:")}
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yaav-500 to-yaavs-navy text-2xl font-bold text-white border-2 border-yaav-950 shadow-[3px_3px_0_#ea580c]">
                  {initials}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-yaavs-navy text-white border-2 border-white shadow-md hover:bg-yaavs-navy-light transition-colors disabled:opacity-60"
                aria-label="Cambiar foto de perfil"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <p className="font-display font-bold uppercase text-lg text-yaav-950 truncate">
                {form.name || session.user.name}
              </p>
              <p className="text-sm text-muted truncate">
                {form.email ?? form.provider ?? session.user.provider}
              </p>
              {form.memberSince && (
                <p className="text-xs text-muted mt-1">
                  Yaavser desde{" "}
                  {new Date(form.memberSince).toLocaleDateString("es-MX", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>

          <SellerRating rating={form.sellerRating} count={form.sellerReviewCount} />

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/perfil/compras"
              className="flex items-center justify-between rounded-lg border border-yaav-200 bg-white px-4 py-3 text-sm font-semibold text-yaav-800 hover:border-yaav-400 hover:bg-yaav-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-yaav-600" />
                Mis compras
              </span>
              <span className="text-xs text-muted">Ver →</span>
            </Link>
            <Link
              href="/perfil/ventas"
              className="flex items-center justify-between rounded-lg border border-yaav-200 bg-white px-4 py-3 text-sm font-semibold text-yaav-800 hover:border-yaav-400 hover:bg-yaav-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4 text-yaav-600" />
                Mis ventas
              </span>
              <span className="text-xs text-muted">Ver →</span>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-yaav-800 mb-2">
                Nombre *
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                placeholder="Tu nombre o negocio"
              />
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-sm font-semibold text-yaav-800 mb-2">
                Fecha de nacimiento
              </label>
              <input
                id="birthDate"
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                className="input-field"
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-yaav-800 mb-2">
                Descripción
              </label>
              <textarea
                id="bio"
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="input-field resize-none"
                placeholder="Cuéntales quién eres, qué vendes y por qué confiar en ti..."
                maxLength={500}
              />
              <p className="mt-1 text-xs text-muted text-right">{form.bio.length}/500</p>
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-semibold text-yaav-800 mb-2">
                WhatsApp *
              </label>
              <input
                id="whatsapp"
                type="tel"
                required
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="input-field"
                placeholder="55 1234 5678"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium" role="alert">
                {error}
              </p>
            )}

            {saved && (
              <p className="flex items-center gap-2 text-sm text-green-700 font-medium">
                <CheckCircle className="h-4 w-4" />
                Perfil guardado correctamente
              </p>
            )}

            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full rounded-md btn-neon py-3.5 text-base min-h-[52px] disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>
      </div>
    </PublishPageShell>
    </>
  );
}
