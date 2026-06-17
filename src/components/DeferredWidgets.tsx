"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const FloatingTechBackground = dynamic(
  () => import("@/components/FloatingTechBackground").then((m) => m.FloatingTechBackground),
  { ssr: false }
);
const YaavBot = dynamic(() => import("@/components/YaavBot").then((m) => m.YaavBot), { ssr: false });
const FathersDayPromo = dynamic(
  () => import("@/components/FathersDayPromo").then((m) => m.FathersDayPromo),
  { ssr: false }
);
const WelcomeGate = dynamic(
  () => import("@/components/auth/WelcomeGate").then((m) => m.WelcomeGate),
  { ssr: false }
);

export function DeferredWidgets() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {!isHome && <FloatingTechBackground />}
      <FathersDayPromo />
      <WelcomeGate />
      <YaavBot />
    </>
  );
}
