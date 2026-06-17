"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Package, ShoppingBag, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { LoginForm } from "@/components/auth/LoginForm";
import { PublishPageShell } from "@/components/PublishPageShell";
import { SectionBanner } from "@/components/SectionBanner";
import type { SaleRecord } from "@/lib/sales-db";

type SalesStats = {
  totalSales: number;
  totalRevenue: number;
  thisMonthCount: number;
  pendingCount: number;
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

export default function VentasPage() {
  const { data: session, status } = useSession();
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [stats, setStats] = useState<SalesStats>({
    totalSales: 0,
    totalRevenue: 0,
    thisMonthCount: 0,
    pendingCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    fetch("/api/sales")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setSales(data.sales ?? []);
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
      <>
        <SectionBanner variant="perfil-ventas" title="Mis ventas" subtitle="Inicia sesión para ver tus pedidos recibidos." />
        <PublishPageShell>
          <div className="mx-auto max-w-md px-4 sm:px-6">
            <div className="publish-urban-panel">
              <LoginForm compact onSuccess={() => window.location.reload()} />
            </div>
          </div>
        </PublishPageShell>
      </>
    );
  }

  return (
    <>
      <SectionBanner
        variant="perfil-ventas"
        title="Mis ventas"
        subtitle="Pedidos que recibiste y contacto con compradores."
      />
      <PublishPageShell>
      <div className="mx-auto max-w-2xl px-4 sm:px-6">

        <div className="publish-urban-panel">
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-yaav-950 mb-1">
            Historial de ventas
          </h1>
          <p className="text-sm text-muted mb-6">
            Todo lo que has vendido en Yaavstore
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <StatCard
              label="Total vendido"
              value={String(stats.totalSales)}
              icon={Package}
            />
            <StatCard
              label="Este mes"
              value={String(stats.thisMonthCount)}
              icon={TrendingUp}
            />
            <StatCard
              label="Ingresos est."
              value={
                stats.totalRevenue > 0
                  ? formatPrice(stats.totalRevenue, "fijo")
                  : "$0"
              }
              icon={ShoppingBag}
            />
          </div>

          {sales.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
              <Package className="mx-auto h-10 w-10 text-neutral-400 mb-3" />
              <h2 className="font-display font-bold uppercase text-yaav-950">
                Aún no tienes ventas
              </h2>
              <p className="mt-2 text-sm text-muted">
                Cuando alguien compre tus anuncios o marques una venta, aparecerá aquí.
              </p>
              <Link
                href="/publicar"
                className="btn-neon inline-flex mt-6 rounded-md px-5 py-2.5 text-sm"
              >
                Publicar anuncio
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 overflow-hidden">
              {sales.map((sale) => (
                <li key={sale.id} className="flex gap-4 p-4 bg-white hover:bg-neutral-50 transition-colors">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                    {sale.listingImage ? (
                      <Image
                        src={sale.listingImage}
                        alt={sale.listingTitle}
                        fill
                        className="object-cover"
                        sizes="64px"
                        unoptimized={sale.listingImage.startsWith("/api/")}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">
                        {sale.category === "productos" ? "📱" : "📡"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-bold uppercase tracking-wide text-yaav-950 line-clamp-2">
                      {sale.listingTitle}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {sale.buyerName ? `Comprador: ${sale.buyerName}` : "Venta registrada"}
                      {" · "}
                      {new Date(sale.soldAt).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-semibold text-yaav-600">
                        {sale.price
                          ? formatPrice(sale.price, sale.priceType as "fijo")
                          : "Precio acordado"}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                          sale.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : sale.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {sale.status === "completed"
                          ? "Vendido"
                          : sale.status === "pending"
                            ? "Pendiente"
                            : "Cancelado"}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PublishPageShell>
    </>
  );
}
