"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { LogIn, LogOut, User, ChevronDown, Star, UserCircle, Package, ShoppingBag } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function UserMenu({ light = false }: { light?: boolean }) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (status === "loading") {
    return (
      <div className={`h-9 w-20 rounded-full animate-pulse ${light ? "bg-white/20" : "bg-yaav-100"}`} />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/entrar"
        className={`inline-flex items-center gap-2 px-2.5 xl:px-3 py-2 text-xs font-display font-semibold uppercase tracking-wider transition-colors min-h-[40px] rounded-md hover:bg-white/10 ${
          light ? "text-white/80 hover:text-white" : "text-neutral-300 hover:text-white"
        }`}
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden xl:inline">Entrar</span>
      </Link>
    );
  }

  const initials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "Y";

  const avatarUrl = session.user.image;
  const isLocalAvatar = avatarUrl?.startsWith("/api/user/avatar");

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-1 pr-3 py-1 hover:opacity-80 transition-opacity"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={session.user.name ?? "Usuario"}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover border border-white/20"
            sizes="32px"
            unoptimized={isLocalAvatar}
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yaav-500 to-yaav-600 text-xs font-bold text-white">
            {initials}
          </div>
        )}
        <span className={`hidden sm:block text-xs font-display uppercase tracking-wider max-w-[100px] truncate ${light ? "text-white/80" : "text-neutral-300"}`}>
          {session.user.name?.split(" ")[0]}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${light ? "text-white/60" : "text-muted"} ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-3 w-60 rounded-xl border border-border bg-white py-2 shadow-xl z-[60]">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-yaav-900 truncate">{session.user.name}</p>
            <p className="text-xs text-muted truncate">
              {session.user.email ?? session.user.provider}
            </p>
            {(session.user.sellerRating ?? 0) > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-yaav-800">
                  {(session.user.sellerRating ?? 5).toFixed(1)}
                </span>
                <span className="text-xs text-muted">
                  · {session.user.sellerReviewCount ?? 0} reseñas
                </span>
              </div>
            )}
          </div>
          <Link
            href="/perfil"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-yaav-800 hover:bg-yaav-100"
            onClick={() => setOpen(false)}
          >
            <UserCircle className="h-4 w-4" />
            Editar perfil
          </Link>
          <Link
            href="/perfil/compras"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-yaav-800 hover:bg-yaav-100"
            onClick={() => setOpen(false)}
          >
            <ShoppingBag className="h-4 w-4" />
            Mis compras
          </Link>
          <Link
            href="/perfil/ventas"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-yaav-800 hover:bg-yaav-100"
            onClick={() => setOpen(false)}
          >
            <Package className="h-4 w-4" />
            Mis ventas
          </Link>
          <Link
            href="/publicar"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-yaav-800 hover:bg-yaav-100"
            onClick={() => setOpen(false)}
          >
            <User className="h-4 w-4" />
            Publicar servicio
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
