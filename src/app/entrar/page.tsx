import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Entrar — Yaavstore",
  description: "Entra con Google, Instagram, correo o teléfono.",
};

export default function EntrarPage() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-white">
      <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-display uppercase tracking-wider text-neutral-500 hover:text-neutral-900 mb-8 min-h-[44px] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <Logo href="/" size="xl" tone="dark" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900">
            Entra a tu cuenta
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Google, Instagram, correo o celular
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
