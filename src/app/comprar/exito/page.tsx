"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { clearCart } from "@/lib/cart";
import { SectionBanner } from "@/components/SectionBanner";
import { PaymentMethodsStrip } from "@/components/PaymentMethodsStrip";

function ExitoContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "paid" | "pending" | "error">("loading");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    fetch(`/api/checkout?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.paid) {
          clearCart();
          setStatus("paid");
        } else if (data.status === "unpaid") {
          setStatus("pending");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-yaav-600" />
        <p className="mt-4 text-muted">Verificando tu pago...</p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 text-center">
        <h1 className="font-display text-2xl font-bold uppercase text-yaav-950">
          Pago en proceso
        </h1>
        <p className="mt-3 text-muted">
          Si pagaste en OXXO o por transferencia, tu pedido se confirmará cuando recibamos el pago.
        </p>
        <Link href="/perfil/compras" className="btn-neon inline-flex mt-8 rounded-md px-6 py-3 text-sm">
          Ver mis compras
        </Link>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 text-center">
        <h1 className="font-display text-2xl font-bold uppercase text-yaav-950">
          No pudimos verificar el pago
        </h1>
        <p className="mt-3 text-muted">
          Si ya pagaste, revisa tu correo o contacta soporte. Tu carrito sigue guardado.
        </p>
        <Link href="/comprar" className="btn-premium inline-flex mt-8">
          Volver a comprar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white mb-6">
        <CheckCircle className="h-8 w-8" />
      </div>
      <h1 className="font-display text-2xl font-bold uppercase text-yaav-950">
        ¡Pago recibido!
      </h1>
      <p className="mt-3 text-muted">
        Tu compra quedó registrada. Los Yaavsers verán el pedido en su historial.
      </p>
      <div className="mt-8 flex justify-center">
        <PaymentMethodsStrip compact />
      </div>
      <Link href="/perfil/compras" className="btn-neon inline-flex mt-8 rounded-md px-6 py-3 text-sm">
        Ver mis compras
      </Link>
    </div>
  );
}

export default function ComprarExitoPage() {
  return (
    <>
      <SectionBanner
        variant="comprar"
        title="Pago completado"
        subtitle="Gracias por comprar en Yaavstore."
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Carrito", href: "/carrito" },
          { label: "Pago exitoso" },
        ]}
      />
      <Suspense
        fallback={
          <div className="mx-auto max-w-lg px-4 py-20 text-center text-muted">
            Cargando...
          </div>
        }
      >
        <ExitoContent />
      </Suspense>
    </>
  );
}
