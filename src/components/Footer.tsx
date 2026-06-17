import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PaymentMethodsStrip } from "@/components/PaymentMethodsStrip";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 text-neutral-500 safe-bottom">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
          <div className="col-span-2 sm:col-span-1">
            <Logo href="/" size="lg" tone="dark" />
            <p className="mt-3 text-xs leading-relaxed max-w-xs">
              El marketplace del barrio. Puestos, locales y talento Yaavser.
            </p>
          </div>

          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-neutral-900 mb-4">Comprar</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/explorar?categoria=servicios" className="hover:text-neutral-900 transition-colors">Servicios</Link></li>
              <li><Link href="/explorar?categoria=productos" className="hover:text-neutral-900 transition-colors">Productos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-neutral-900 mb-4">Comunidad</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/comunidad" className="hover:text-neutral-900 transition-colors">Entre Yaavsers</Link></li>
              <li><Link href="/comunidad/publicar" className="hover:text-neutral-900 transition-colors">Anunciarte (gratis)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-neutral-900 mb-4">Publicar</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/publicar" className="hover:text-neutral-900 transition-colors">Publicar servicio</Link></li>
              <li><Link href="/entrar" className="hover:text-neutral-900 transition-colors">Mi cuenta</Link></li>
              <li><Link href="/configuracion" className="hover:text-neutral-900 transition-colors">Ayuda</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-neutral-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-neutral-400">Privacidad</span></li>
              <li><span className="text-neutral-400">Términos</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <PaymentMethodsStrip />
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-200 text-center text-[10px] uppercase tracking-widest">
          © {new Date().getFullYear()} Yaavstore · México
        </div>
      </div>
    </footer>
  );
}
