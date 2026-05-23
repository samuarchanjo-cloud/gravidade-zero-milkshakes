const INSTASIZE_PAGE = /instasize\.com\/p\/([a-f0-9]+)/i;
const INSTASIZE_API = /instasize\.com\/api\/image\/([a-f0-9]+)/i;

/** Extrai hash Instasize de URL de página, API ou proxy */
export function extractInstasizeHash(url: string): string | null {
  const trimmed = url?.trim() ?? "";
  if (!trimmed) return null;
  const page = trimmed.match(INSTASIZE_PAGE);
  if (page) return page[1];
  const api = trimmed.match(INSTASIZE_API);
  if (api) return api[1];
  try {
    const parsed = new URL(trimmed, "http://localhost");
    if (parsed.pathname.startsWith("/api/image")) {
      const q = parsed.searchParams.get("url");
      if (q) return extractInstasizeHash(q);
    }
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * URL direta para fetch no servidor (API Instasize).
 */
export function resolveImageUrl(url: string): string {
  const trimmed = url?.trim() ?? "";
  if (!trimmed) return "";

  const hash = extractInstasizeHash(trimmed);
  if (hash) {
    return `https://instasize.com/api/image/${hash}.jpeg`;
  }

  return trimmed;
}

/**
 * URL usada no navegador — link direto da API Instasize (sem proxy).
 */
export function getImageSrc(url: string): string {
  return resolveImageUrl(url);
}

/** Imagem principal do topo: hero tem prioridade sobre banner legado */
export function getHeroImageUrl(heroImageUrl: string, bannerImageUrl: string): string {
  const hero = heroImageUrl?.trim();
  const banner = bannerImageUrl?.trim();
  return hero || banner || "";
}

export function isDirectImageUrl(url: string): boolean {
  if (!url) return false;
  if (/instasize\.com\/api\/image\//i.test(url)) return true;
  return /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(url);
}
