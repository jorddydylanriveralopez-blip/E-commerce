export function normalizeWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `52${digits}`;
  if (digits.startsWith("52") && digits.length === 12) return digits;
  return digits;
}

export function buildContactMessage(params: {
  providerName: string;
  serviceTitle: string;
  price: string;
  buyerName: string;
  listingUrl: string;
}): string {
  return [
    `Hola ${params.providerName},`,
    "",
    `Vi tu servicio *"${params.serviceTitle}"* (${params.price}) en Yaavstore y me interesa.`,
    "",
    `¿Podemos platicar sobre disponibilidad y detalles?`,
    "",
    `— ${params.buyerName}`,
    params.listingUrl,
  ].join("\n");
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizeWhatsApp(phone);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function formatWhatsAppDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^52/, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
  }
  return phone;
}
