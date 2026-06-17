"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { GripHorizontal, Mail } from "lucide-react";
import { socialLinks } from "@/lib/social-links";

const STORAGE_KEY = "yaavstore-social-bar-offset";

function WhatsAppIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.855L.057 23.5l5.753-1.51A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82a9.82 9.82 0 01-5.01-1.37l-.36-.214-3.41.894.91-3.326-.234-.375A9.82 9.82 0 1121.82 12 9.83 9.83 0 0112 21.82z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.89 6.34 6.34 0 009.5 22.24 6.34 6.34 0 0015.84 15.9V9.02a8.16 8.16 0 004.75 1.52V7.09a4.85 4.85 0 01-1-.4z" />
    </svg>
  );
}

const icons: Record<string, ReactNode> = {
  whatsapp: <WhatsAppIcon />,
  facebook: <FacebookIcon />,
  instagram: <InstagramIcon />,
  linkedin: <LinkedInIcon />,
  tiktok: <TikTokIcon />,
  email: <Mail className="h-[18px] w-[18px]" strokeWidth={2} />,
};

export function FloatingSocialBar() {
  const barRef = useRef<HTMLElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ y: 0, offset: 0 });

  const clampOffset = useCallback((next: number) => {
    const bar = barRef.current;
    if (!bar) return next;

    const half = bar.offsetHeight / 2;
    const center = window.innerHeight / 2;
    const margin = 72;
    const min = margin + half - center;
    const max = window.innerHeight - margin - half - center;

    return Math.min(max, Math.max(min, next));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const parsed = Number(saved);
    if (!Number.isFinite(parsed)) return;
    setOffsetY(clampOffset(parsed));
  }, [clampOffset]);

  useEffect(() => {
    function onResize() {
      setOffsetY((current) => clampOffset(current));
    }

    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [clampOffset]);

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    dragStart.current = { y: e.clientY, offset: offsetY };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragging) return;
    const dy = e.clientY - dragStart.current.y;
    setOffsetY(clampOffset(dragStart.current.offset + dy));
  }

  function endDrag(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragging) return;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setOffsetY((current) => {
      const clamped = clampOffset(current);
      localStorage.setItem(STORAGE_KEY, String(clamped));
      return clamped;
    });
  }

  return (
    <aside
      ref={barRef}
      className={`floating-social-bar ${dragging ? "floating-social-bar--dragging" : ""}`}
      style={{ transform: `translateY(calc(-50% + ${offsetY}px))` }}
      aria-label="Redes sociales y contacto"
    >
      <div className="floating-social-rail">
        <button
          type="button"
          className="floating-social-drag-handle"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          aria-label="Arrastrar para mover la barra de redes"
          title="Arrastra para subir o bajar"
        >
          <GripHorizontal className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
        </button>

        {socialLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target={link.id === "email" ? undefined : "_blank"}
            rel={link.id === "email" ? undefined : "noopener noreferrer"}
            className={`floating-social-link group ${link.hoverBg}`}
            aria-label={link.label}
            title={link.label}
          >
            <span className="floating-social-icon">{icons[link.id]}</span>
            <span className="floating-social-tooltip">{link.label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
