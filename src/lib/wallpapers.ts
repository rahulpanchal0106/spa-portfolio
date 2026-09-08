export type Wallpaper = {
  id: string;
  src: string;
  label: string;
  live: boolean;
};

export const WALLPAPER_STORAGE_KEY = "portfolio-wallpaper";
/** Local safe image used when the remote feed fails. */
export const FALLBACK_WALLPAPER_SRC = "/wallpapers/fallback.jpg";
export const FALLBACK_WALLPAPER: Wallpaper = {
  id: "fallback",
  src: FALLBACK_WALLPAPER_SRC,
  label: "Fallback",
  live: false,
};
/** How many remote wallpapers to show in the menubar picker. */
export const WALLPAPER_MENU_COUNT = 6;

/**
 * Default catalog URL (Bing daily wallpaper archive for the current year).
 * Override with WALLPAPERS_FEED_URL. Accepts:
 * - Bing archive JSON array ({ title, url, date, ... })
 * - Bing HPImageArchive `{ images: [...] }`
 * - Simple `{ wallpapers: Wallpaper[] }` or `Wallpaper[]`
 */
export function defaultWallpapersFeedUrl(year = new Date().getUTCFullYear()) {
  return `https://bing.npanuhin.me/US-en.${year}.min.json`;
}

export const WALLPAPERS_FEED_URL =
  process.env.WALLPAPERS_FEED_URL?.trim() || defaultWallpapersFeedUrl();
