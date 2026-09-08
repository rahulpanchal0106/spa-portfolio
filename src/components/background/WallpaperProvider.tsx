"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { FALLBACK_WALLPAPER, FALLBACK_WALLPAPER_SRC, WALLPAPER_STORAGE_KEY, type Wallpaper } from "@/lib/wallpapers";

type WallpaperContextValue = {
  src: string;
  wallpapers: Wallpaper[];
  ready: boolean;
  loading: boolean;
  setWallpaper: (src: string) => void;
  refreshWallpapers: () => void;
};

const WallpaperContext = createContext<WallpaperContextValue | null>(null);

function readSavedWallpaper() {
  try {
    const savedRaw = window.localStorage.getItem(WALLPAPER_STORAGE_KEY);
    if (!savedRaw) return null;
    // Drop legacy local GIF path that no longer exists.
    if (savedRaw === "/wallpapers/beach-seaside.gif") return null;
    return savedRaw;
  } catch {
    return null;
  }
}

function mergeWithCurrent(list: Wallpaper[], currentSrc: string): Wallpaper[] {
  if (!currentSrc || list.some((item) => item.src === currentSrc)) return list;
  return [
    {
      id: `current:${currentSrc}`,
      src: currentSrc,
      label: "Current",
      live: /\.gif($|\?)/i.test(currentSrc),
    },
    ...list,
  ];
}

function applyFallback() {
  return [FALLBACK_WALLPAPER];
}

export function WallpaperProvider({ children }: { children: ReactNode }) {
  const [src, setSrc] = useState("");
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  // Restore saved wallpaper immediately so the image can start loading
  // without waiting on the remote catalog.
  useEffect(() => {
    const saved = readSavedWallpaper();
    if (saved) setSrc(saved);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    void fetch(`/api/wallpapers?t=${nonce}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load wallpapers");
        return (await res.json()) as Wallpaper[];
      })
      .then((list) => {
        if (cancelled) return;

        const catalog = list.length > 0 ? list : applyFallback();
        const savedSrc = readSavedWallpaper();

        if (savedSrc) {
          setSrc(savedSrc);
          setWallpapers(mergeWithCurrent(catalog, savedSrc));
          return;
        }

        const first = catalog[0]?.src ?? FALLBACK_WALLPAPER_SRC;
        setSrc(first);
        try {
          window.localStorage.setItem(WALLPAPER_STORAGE_KEY, first);
        } catch {
          /* private mode */
        }
        setWallpapers(catalog);
      })
      .catch(() => {
        if (cancelled) return;
        const savedSrc = readSavedWallpaper();
        const catalog = applyFallback();
        const next = savedSrc ?? FALLBACK_WALLPAPER_SRC;
        setSrc(next);
        setWallpapers(mergeWithCurrent(catalog, next));
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const setWallpaper = useCallback((next: string) => {
    setSrc(next);
    try {
      window.localStorage.setItem(WALLPAPER_STORAGE_KEY, next);
    } catch {
      /* private mode */
    }
    setWallpapers((prev) =>
      mergeWithCurrent(
        prev.filter((item) => !item.id.startsWith("current:")),
        next,
      ),
    );
  }, []);

  const refreshWallpapers = useCallback(() => {
    setNonce((n) => n + 1);
  }, []);

  const value = useMemo(
    () => ({ src, wallpapers, ready, loading, setWallpaper, refreshWallpapers }),
    [src, wallpapers, ready, loading, setWallpaper, refreshWallpapers],
  );

  return <WallpaperContext.Provider value={value}>{children}</WallpaperContext.Provider>;
}

export function useWallpaper() {
  const ctx = useContext(WallpaperContext);
  if (!ctx) throw new Error("useWallpaper must be used within WallpaperProvider");
  return ctx;
}
