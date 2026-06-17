"use client";

interface PublishPageShellProps {
  children: React.ReactNode;
}

export function PublishPageShell({ children }: PublishPageShellProps) {
  return (
    <div className="publish-urban-page">
      <div className="publish-urban-page__bg" aria-hidden>
        {/* JPG estático (~400 KB) — mucho más rápido que el GIF de 2.2 MB */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/backgrounds/city-night.jpg"
          alt=""
          width={1920}
          height={1165}
          decoding="async"
          fetchPriority="low"
        />
      </div>
      <div className="publish-urban-page__overlay" aria-hidden />
      <div className="publish-urban-page__content">{children}</div>
    </div>
  );
}
