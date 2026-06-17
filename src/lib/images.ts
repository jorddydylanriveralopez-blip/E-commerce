/** Imágenes telecom / smartphones — estilo Yaavs */
const u = (id: string, w = 800, h?: number) =>
  `https://images.unsplash.com/${id}?w=${w}${h ? `&h=${h}` : ""}&q=75&fit=crop&auto=format`;

const p = (id: number, w = 800, h?: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}${h ? `&h=${h}` : ""}&fit=crop`;

const banner = (name: string) => `/banners/${name}`;

export const yaavImages = {
  /** Carrusel home — locales en public/banners/ */
  bannerServicios: banner("desktop-servicios.jpg"),
  bannerPublicar: banner("desktop-publicar.jpg"),
  bannerEquipos: banner("desktop-equipos.jpg"),

  bannerServiciosMobile: banner("mobile-servicios.jpg"),
  bannerPublicarMobile: banner("mobile-publicar.jpg"),
  bannerEquiposMobile: banner("mobile-equipos.jpg"),

  planPospago: u("photo-1555774698-0b77e0d5fac6"),
  chipPrepago: p(607812),
  activacionDomicilio: u("photo-1551650975-87deedd944c3"),
  portabilidad: u("photo-1563013544-824ae1b704d3"),
  smartphone: u("photo-1601784551446-20c9e07cdbdb"),
  planPrepago: u("photo-1580910051074-3eb694886505"),
  accesorios: u("photo-1544244015-0df4b3ffc6b0"),
  planFamiliar: u("photo-1633265486064-086b219458ec"),
  welcome: u("photo-1510557880182-3d4d3cba35a5"),
} as const;
