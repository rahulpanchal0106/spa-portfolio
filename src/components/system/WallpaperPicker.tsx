"use client";

import Image from "next/image";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useWallpaper } from "@/components/background/WallpaperProvider";

function isRemote(src: string) {
  return /^https?:\/\//i.test(src);
}

type MenuCoords = {
  top: number;
  left?: number;
  right?: number;
};

export function WallpaperPicker({
  align = "right",
  variant = "menubar",
  trigger,
}: {
  align?: "left" | "right";
  variant?: "menubar" | "desktop";
  trigger?: ReactNode;
}) {
  const { src, wallpapers, loading, setWallpaper, refreshWallpapers } = useWallpaper();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<MenuCoords | null>(null);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }

    const update = () => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(288, window.innerWidth - 24);
      if (align === "left") {
        const left = Math.min(rect.left, window.innerWidth - width - 12);
        setCoords({ top: rect.bottom + 6, left: Math.max(12, left) });
      } else {
        const right = Math.max(12, window.innerWidth - rect.right);
        setCoords({ top: rect.bottom + 6, right });
      }
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const menu =
    open && coords && mounted ? (
      <div
        ref={menuRef}
        id={menuId}
        role="dialog"
        aria-label="Wallpapers"
        style={{
          position: "fixed",
          top: coords.top,
          left: coords.left,
          right: coords.right,
          zIndex: 200,
          width: "min(18rem, calc(100vw - 1.5rem))",
        }}
        className="rounded-xl border border-white/15 bg-[rgb(36_36_38_/_0.96)] p-2 shadow-[0_18px_50px_rgb(0_0_0_/_0.45)] backdrop-blur-xl"
      >
        <div className="mb-1.5 flex items-center justify-between gap-2 px-1">
          <p className="text-[11px] font-medium tracking-wide text-white/45 uppercase">Wallpaper</p>
          <button
            type="button"
            title="Shuffle options"
            onClick={refreshWallpapers}
            disabled={loading}
            className="rounded-md px-1.5 py-0.5 text-[10px] font-medium text-white/55 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            {loading ? "Loading…" : "Shuffle"}
          </button>
        </div>
        {wallpapers.length === 0 ? (
          <p className="px-1 py-3 text-[12px] text-white/55">
            {loading ? "Fetching wallpapers…" : "Couldn’t load wallpaper feed"}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {wallpapers.map((paper) => {
              const active = paper.src === src;
              return (
                <button
                  key={paper.id}
                  type="button"
                  title={paper.label}
                  onClick={() => {
                    setWallpaper(paper.src);
                    setOpen(false);
                  }}
                  className={`group relative overflow-hidden rounded-lg border text-left transition ${
                    active
                      ? "border-[#0a84ff] ring-1 ring-[#0a84ff]/60"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <span className="relative block aspect-video bg-black/40">
                    <Image
                      src={paper.src}
                      alt=""
                      fill
                      sizes="140px"
                      unoptimized={paper.live || isRemote(paper.src)}
                      className="object-cover"
                    />
                  </span>
                  <span className="flex items-center justify-between gap-1 px-1.5 py-1">
                    <span className="truncate text-[10px] text-white/75">{paper.label}</span>
                    {paper.live ? (
                      <span className="shrink-0 rounded bg-white/12 px-1 py-0.5 text-[9px] font-medium text-white/70">
                        Live
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    ) : null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        title="Wallpaper"
        aria-label="Choose wallpaper"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={
          variant === "desktop"
            ? "appearance-none border-0 bg-transparent p-0"
            : "grid h-6 w-6 place-items-center rounded-md text-white/85 transition hover:bg-white/12 hover:text-white"
        }
      >
        {trigger ?? (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M3 14.5 8.2 10l3.3 3.2L15.8 9.5 21 14.2"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="8.2" cy="9.2" r="1.15" fill="currentColor" />
          </svg>
        )}
      </button>
      {mounted ? createPortal(menu, document.body) : null}
    </div>
  );
}
