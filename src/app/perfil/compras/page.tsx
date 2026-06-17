"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ArrowLeft, ShoppingBag, Smartphone, Wifi } from "lucide-react";
import { formatPrice, getCategoryLabel } from "@/lib/data";
import { LoginForm } from "@/components/auth/LoginForm";
import { PublishPageShell } from "@/components/PublishPageShell";
import type { SaleRecord } from "@/lib/sales-db";

type PurchaseStats = {
  totalPurchases: number;
  totalSpent: number;
  thisMonthCount: number;
  productCount: number;
  serviceCount: number;
};

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-yaav-600 mb-2">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="font-display text-xl font-bold text-yaav-950">{value}</p>
    </div>
  );
}

export default function ComprasPage() {
  const { data: session, status } = useSession();
  const [purchases, setPurchases] = useState<SaleRecord[]>([]);
  const [stats, setStats] = useState<PurchaseStats>({
    totalPurchases: 0,
    totalSpent: 0,
    thisMonthCount: 0,
    productCount: 0,
    serviceCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    fetch("/api/purchases")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setPurchases(data.purchases ?? []);
          setStats(data.stats ?? stats);
        }
      })
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

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
      <PublishPageShell>
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Inicio
          </Link>
          <div className="publish-urban-panel">
            <h1 className="font-display text-xl font-bold uppercase text-yaav-950 mb-4">
              Mis compras
            </h1>
            <LoginForm compact onSuccess={() => window.location.reload()} />
          </div>
        </div>
      </PublishPageShell>
    );
  }

  return (
    <PublishPageShell>
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <Link
          href="/perfil"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Mi perfil
        </Link>

        <div className="publish-urban-panel">
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-yaav-950 mb-1">
            Historial de compras
          </h1>
          <p className="text-sm text-muted mb-6">
            Productos y servicios que has contratado en Yaavstore
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <StatCard
              label="Total compras"
              value={String(stats.totalPurchases)}
              icon={ShoppingBag}
            />
            <StatCard
              label="Productos"
              value={String(stats.productCount)}
              icon={Smartphone}
            />
            <StatCard
              label="Servicios"
              value={String(stats.serviceCount)}
              icon={Wifi}
            />
          </div>

          {stats.totalSpent > 0 && (
            <p className="text-sm text-muted mb-6 -mt-4">
              Total estimado gastado:{" "}
              <span className="font-semibold text-yaav-700">
                {formatPrice(stats.totalSpent, "fijo")}
              </span>
              {stats.thisMonthCount > 0 && (
                <span className="text-neutral-400">
                  {" "}
                  · {stats.thisMonthCount} este mes
                </span>
              )}
            </p>
          )}

          {purchases.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 text-neutral-400 mb-3" />
              <h2 className="font-display font-bold uppercase text-yaav-950">
                Aún no tienes compras
              </h2>
              <p className="mt-2 text-sm text-muted">
                Cuando confirmes una compra en el carrito, aparecerá aquí.
              </p>
              <Link
                href="/explorar"
                className="btn-neon inline-flex mt-6 rounded-md px-5 py-2.5 text-sm"
              >
                Explorar marketplace
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 overflow-hidden">
              {purchases.map((purchase) => (
                <li key={purchase.id}>
                  <Link
                    href={purchase.listingId ? `/servicio/${purchase.listingId}` : "/explorar"}
                    className="flex gap-4 p-4 bg-white hover:bg-neutral-50 transition-colors"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                      {purchase.listingImage ? (
                        <Image
                          src={purchase.listingImage}
                          alt={purchase.listingTitle}
                          fill
                          className="object-cover"
                          sizes="64px"
                          unoptimized={purchase.listingImage.startsWith("/api/")}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl">
                          {purchase.category === "productos" ? "📱" : "📡"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-yaav-600">
                        {getCategoryLabel(purchase.category)}
                      </span>
                      <p className="font-display text-sm font-bold uppercase tracking-wide text-yaav-950 line-clamp-2">
                        {purchase.listingTitle}
                      </p>
                      <p className="text-xs text-muted mt-1">
                        Vendedor: {purchase.sellerName ?? "Yaavser"}
                        {" · "}
                        {new Date(purchase.soldAt).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-yaav-600">
                        {purchase.price
                          ? formatPrice(purchase.price, purchase.priceType as "fijo")
                          : "Precio acordado"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PublishPageShell>
  );
}
