export function normalizeWhatsAppLink(value: string | undefined | null, message?: string | undefined | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  let url = "";

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      if (parsed.hostname === "wa.me" || parsed.hostname.endsWith(".whatsapp.com")) {
        url = parsed.toString();
      } else {
        url = raw;
      }
    } catch {
      url = "";
    }
  } else {
    const digits = raw.replace(/\D/g, "");
    if (digits) url = `https://wa.me/${digits}`;
  }

  const text = String(message ?? "").trim();
  if (!url || !text) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}text=${encodeURIComponent(text)}`;
}
