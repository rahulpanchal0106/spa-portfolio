"use client";

import { useWallpaper } from "@/components/background/WallpaperProvider";
import { cn } from "@/lib/cn";

function ShuffleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M16 3h5v5M8 3H3v5M21 3 3 21M21 16v5h-5M16 21l5-5M3 8l5-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WallpaperShuffleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-11 w-11", className)} aria-hidden>
      <rect width="64" height="64" rx="14" fill="#ff9f0a" />
      <path
        d="M18 22h10M36 22h10M28 18v8M46 18v8M18 42h10M36 42h10M28 38v8M46 38v8"
        stroke="#fff"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path d="M22 32h20" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

/** Compact menubar control — picks a random wallpaper from the API. */
export function WallpaperShuffleButton({ className }: { className?: string }) {
  const { shuffleWallpaper, loading } = useWallpaper();

  return (
    <button
      type="button"
      title="Random wallpaper"
      aria-label="Set a random wallpaper"
      disabled={loading}
      onClick={() => void shuffleWallpaper()}
      className={cn(
        "grid h-6 w-6 place-items-center rounded-md text-white/85 transition hover:bg-white/12 hover:text-white disabled:opacity-45",
        className,
      )}
    >
      <ShuffleGlyph className="h-3.5 w-3.5" />
    </button>
  );
}

export function useShuffleWallpaper() {
  return useWallpaper().shuffleWallpaper;
}
