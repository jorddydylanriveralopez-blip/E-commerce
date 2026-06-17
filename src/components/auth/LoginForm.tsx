"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Mail,
  Phone,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { SocialLogin } from "./SocialLogin";

type Tab = "email" | "phone";

interface LoginFormProps {
  defaultTab?: Tab;
  compact?: boolean;
  dark?: boolean;
  onSuccess?: () => void;
  callbackUrl?: string;
}

export function LoginForm({
  defaultTab = "email",
  compact = false,
  dark = false,
  onSuccess,
  callbackUrl = "/",
}: LoginFormProps) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Email
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Phone
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [demoCode, setDemoCode] = useState("");

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, whatsapp: whatsapp || undefined }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
      }

      const result = await signIn("email", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(
          mode === "login"
            ? "Correo o contraseña incorrectos"
            : "Error al iniciar sesión después del registro"
        );
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/phone/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOtpSent(true);
      if (data.demoCode) setDemoCode(data.demoCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar código");
    } finally {
      setLoading(false);
    }
  }

  async function handlePhoneVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("phone", {
        phone,
        otp,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(
          result.error === "Configuration"
            ? "Error de servidor: falta AUTH_SECRET en Vercel. Contacta al administrador."
            : "Código incorrecto o expirado. Pide uno nuevo."
        );
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al verificar");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = dark ? "input-field-light rounded-none min-h-[48px]" : "input-field text-base sm:text-sm min-h-[48px] sm:min-h-0";
  const labelCls = dark ? "block text-sm font-medium text-neutral-300 mb-1.5" : "block text-sm font-medium text-yaav-800 mb-1.5";

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      <SocialLogin
        loading={loading}
        setLoading={setLoading}
        setError={setError}
        callbackUrl={callbackUrl}
      />

      <div className={`flex p-1 ${dark ? "bg-neutral-900 border border-neutral-700" : "rounded-md border-2 border-yaav-950 bg-yaav-100 shadow-[2px_2px_0_#1c1917]"}`}>
        <button
          type="button"
          onClick={() => { setTab("email"); setError(""); }}
          className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-display font-bold uppercase tracking-wide transition-all min-h-[44px] ${
            tab === "email"
              ? dark ? "bg-white text-black" : "bg-yaav-600 text-white shadow-[2px_2px_0_#1c1917]"
              : dark ? "text-neutral-500 hover:text-white" : "text-muted hover:text-yaav-700"
          }`}
        >
          <Mail className="h-4 w-4" />
          Correo
        </button>
        <button
          type="button"
          onClick={() => { setTab("phone"); setError(""); }}
          className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-display font-bold uppercase tracking-wide transition-all min-h-[44px] ${
            tab === "phone"
              ? dark ? "bg-white text-black" : "bg-yaav-600 text-white shadow-[2px_2px_0_#1c1917]"
              : dark ? "text-neutral-500 hover:text-white" : "text-muted hover:text-yaav-700"
          }`}
        >
          <Phone className="h-4 w-4" />
          Teléfono
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border-2 border-red-300 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {tab === "email" && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label htmlFor="auth-name" className={labelCls}>
                Nombre
              </label>
              <input
                id="auth-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className={inputCls}
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className={labelCls}>
              Correo electrónico
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className={`${inputCls} ${dark ? "" : "text-base sm:text-sm min-h-[48px] sm:min-h-0"}`}
            />
          </div>

          <div>
            <label htmlFor="auth-password" className={labelCls}>
              Contraseña
            </label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className={`${inputCls} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-yaav-700"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mode === "register" && (
            <div>
              <label htmlFor="auth-whatsapp" className={labelCls}>
                WhatsApp <span className="text-muted font-normal">(recomendado)</span>
              </label>
              <input
                id="auth-whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="55 1234 5678"
                className={inputCls}
              />
              <p className="mt-1 text-xs text-muted">
                Para que los vendedores te respondan por WhatsApp
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md btn-neon py-3.5 text-sm disabled:opacity-60 min-h-[48px]"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {mode === "login" ? "Entrar con correo" : "Crear cuenta"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-muted">
            {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="font-semibold text-yaav-600 hover:text-yaav-800"
            >
              {mode === "login" ? "Regístrate gratis" : "Inicia sesión"}
            </button>
          </p>
        </form>
      )}

      {tab === "phone" && !otpSent && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label htmlFor="auth-phone" className={labelCls}>
              Número de teléfono
            </label>
            <input
              id="auth-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="55 1234 5678"
              className={`${inputCls} ${dark ? "" : "text-base sm:text-sm min-h-[48px] sm:min-h-0"}`}
            />
            <p className="mt-1.5 text-xs text-muted">
              Te enviaremos un código de 6 dígitos (SMS cuando esté configurado)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md btn-neon py-3.5 text-sm disabled:opacity-60 min-h-[48px]"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar código"}
          </button>
        </form>
      )}

      {tab === "phone" && otpSent && (
        <form onSubmit={handlePhoneVerify} className="space-y-4">
          {demoCode && (
            <div className="rounded-md bg-yellow-50 border-2 border-yellow-400 px-4 py-3 text-sm text-yaav-800">
              <strong>Modo demo:</strong> tu código es <span className="font-mono font-bold">{demoCode}</span>
            </div>
          )}

          <div>
            <label htmlFor="auth-otp" className={labelCls}>
              Código de verificación
            </label>
            <input
              id="auth-otp"
              type="text"
              inputMode="numeric"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className={`${inputCls} text-center text-2xl font-mono tracking-[0.5em]`}
            />
            <p className="mt-1.5 text-xs text-muted text-center">
              Enviado a {phone}{" "}
              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtp(""); setDemoCode(""); }}
                className="text-yaav-600 font-medium hover:underline"
              >
                Cambiar número
              </button>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="flex w-full items-center justify-center gap-2 rounded-md btn-neon py-3.5 text-sm disabled:opacity-60 min-h-[48px]"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verificar y entrar"}
          </button>
        </form>
      )}
    </div>
  );
}
