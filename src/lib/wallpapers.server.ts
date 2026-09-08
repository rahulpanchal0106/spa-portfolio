import {
  FALLBACK_WALLPAPER,
  WALLPAPER_MENU_COUNT,
  WALLPAPERS_FEED_URL,
  defaultWallpapersFeedUrl,
  type Wallpaper,
} from "@/lib/wallpapers";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function isLiveSrc(src: string) {
  return /\.gif($|\?)/i.test(src);
}

function normalizeItem(item: unknown, index: number): Wallpaper | null {
  if (!isRecord(item)) return null;

  const src =
    asString(item.src) ||
    asString(item.url) ||
    asString(item.image) ||
    (asString(item.urlbase) ? `https://www.bing.com${asString(item.urlbase)}_1920x1080.jpg` : null);

  if (!src) return null;

  const absolute = src.startsWith("//")
    ? `https:${src}`
    : src.startsWith("/")
      ? `https://www.bing.com${src}`
      : src;

  const label =
    asString(item.label) ||
    asString(item.title) ||
    asString(item.caption) ||
    asString(item.copyright) ||
    asString(item.date) ||
    `Wallpaper ${index + 1}`;

  const id = asString(item.id) || asString(item.date) || asString(item.hsh) || absolute;

  return {
    id,
    src: absolute,
    label,
    live: typeof item.live === "boolean" ? item.live : isLiveSrc(absolute),
  };
}

export function normalizeWallpaperCatalog(data: unknown): Wallpaper[] {
  if (Array.isArray(data)) {
    return data.map(normalizeItem).filter((item): item is Wallpaper => item !== null);
  }
  if (!isRecord(data)) return [];

  if (Array.isArray(data.wallpapers)) {
    return normalizeWallpaperCatalog(data.wallpapers);
  }
  if (Array.isArray(data.images)) {
    return data.images.map((item, index) => {
      if (!isRecord(item)) return null;
      const path = asString(item.url);
      const urlbase = asString(item.urlbase);
      const src = path
        ? path.startsWith("http")
          ? path
          : `https://www.bing.com${path}`
        : urlbase
          ? `https://www.bing.com${urlbase}_1920x1080.jpg`
          : null;
      if (!src) return null;
      return normalizeItem(
        {
          ...item,
          src,
          label: asString(item.title) || asString(item.copyright) || `Bing ${index + 1}`,
        },
        index,
      );
    }).filter((item): item is Wallpaper => item !== null);
  }

  return [];
}

function shufflePick<T>(items: T[], count: number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Feed ${res.status} for ${url}`);
  return res.json();
}

export async function fetchWallpaperCatalog(feedUrl = WALLPAPERS_FEED_URL): Promise<Wallpaper[]> {
  const year = new Date().getUTCFullYear();
  const candidates = [
    feedUrl,
    defaultWallpapersFeedUrl(year),
    defaultWallpapersFeedUrl(year - 1),
    "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=en-US",
  ];

  const tried = new Set<string>();
  let lastError: Error | null = null;

  for (const url of candidates) {
    if (!url || tried.has(url)) continue;
    tried.add(url);
    try {
      const data = await fetchJson(url);
      const catalog = normalizeWallpaperCatalog(data);
      if (catalog.length > 0) return catalog;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError ?? new Error("No wallpaper feed available");
}

export async function listWallpapers(count = WALLPAPER_MENU_COUNT): Promise<Wallpaper[]> {
  try {
    const catalog = await fetchWallpaperCatalog();
    const picked = shufflePick(catalog, count);
    return picked.length > 0 ? picked : [FALLBACK_WALLPAPER];
  } catch {
    return [FALLBACK_WALLPAPER];
  }
}
