export const YAAV_BOT_SYSTEM = `Eres YaavBot, el asistente de Yaavstore — marketplace de Yaavsers (distribuidores de telefonía Yaavs en México).

Ayudas con:
- Planes pospago y prepago, chips, portabilidad, equipos y accesorios
- Cómo publicar anuncios gratis en /publicar
- Espacio B2B entre Yaavsers en /comunidad (gratis en lanzamiento)
- Explorar productos (/explorar?categoria=productos) y servicios (/explorar?categoria=servicios)
- Contacto por WhatsApp con vendedores

Responde en español mexicano, breve y amable. Si no sabes algo, sugiere explorar el marketplace o publicar. No inventes precios exactos.`;

export type ChatMessage = { role: "user" | "assistant"; content: string };

export function fallbackYaavBotReply(userText: string): string {
  const q = userText.toLowerCase().trim();

  if (/hola|buenas|hey|qué tal/.test(q)) {
    return "¡Hola! Soy YaavBot 🤖 Te ayudo con planes Yaavs, chips, equipos y cómo publicar en Yaavstore. ¿Qué buscas hoy?";
  }
  if (/prepago|recarga|chip/.test(q)) {
    return "En **Productos** y **Servicios** hay chips prepago, recargas y activación. Entra a Ver productos o busca «chip prepago» en Explorar. ¿Te interesa alguna zona en particular?";
  }
  if (/pospago|plan|gb|gigas/.test(q)) {
    return "Los Yaavsers publican planes pospago con distintos GB y sin plazo forzoso. Mira **Ver servicios** en el menú o filtra por categoría Servicios en Explorar.";
  }
  if (/portabilidad|conservar|número|numero/.test(q)) {
    return "Varios Yaavsers ofrecen portabilidad conservando tu número. Busca «portabilidad» en Explorar y contáctalos por WhatsApp desde el anuncio.";
  }
  if (/equipo|celular|samsung|iphone|teléfono|telefono/.test(q)) {
    return "En **Ver productos** encuentras equipos desbloqueados y accesorios. Filtra por Productos o busca el modelo en la barra de búsqueda.";
  }
  if (/publicar|vender|anuncio|subir/.test(q)) {
    return "Publicar es **100% gratis**: menú → **Publicar**, llena el formulario con tu WhatsApp y listo. Los clientes te contactan directo.";
  }
  if (/entre yaavser|comunidad|distribuidor|mayoreo|b2b/.test(q)) {
    return "**Entre Yaavsers** es la red B2B para distribuidores: buscar proveedor, mayoreo, colaboración. Entra desde el menú — ahora es gratis en lanzamiento.";
  }
  if (/gratis|comisión|comision|costo|precio/.test(q)) {
    return "Publicar en Yaavstore es gratis y sin comisión. Los precios de planes y equipos los pone cada Yaavser en su anuncio.";
  }
  if (/whatsapp|contacto|contactar/.test(q)) {
    return "En cada anuncio hay botón para contactar por **WhatsApp** al vendedor. Necesitas el número que ellos publican en su listing.";
  }
  if (/día del padre|padre|papá|papa/.test(q)) {
    return "¡Buena idea! Regálale conexión: planes prepago, equipos o chips. Mira las promociones en Explorar → Servicios o Productos.";
  }
  if (/ayuda|qué es|que es|yaavstore/.test(q)) {
    return "Yaavstore es el marketplace donde los **Yaavsers** (distribuidores Yaavs) venden planes, chips y equipos. Tú exploras, ellos te atienden por WhatsApp.";
  }

  return "Puedo ayudarte con planes prepago/pospago, chips, equipos, portabilidad o cómo publicar. ¿Qué necesitas? También puedes ir a **Explorar** en el menú.";
}
