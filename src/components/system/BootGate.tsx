"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useWallpaper } from "@/components/background/WallpaperProvider";
import { resume } from "@/lib/profile";
import { site } from "@/lib/site";

const BOOT_SESSION_KEY = "portfolio-booted";
const EXIT_MS = 780;
const EXIT_MS_REDUCED = 0;
const WALLPAPER_FADE_MS = 900;

type Phase = "checking" | "intro" | "exiting" | "ready";

function LockWallpaper({ onReady }: { onReady: (ready: boolean) => void }) {
  const { src } = useWallpaper();
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setVisible(false);
    onReady(false);
  }, [src, onReady]);

  useEffect(() => {
    if (!loaded) return;
    onReady(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }
    const frame = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, [loaded, onReady]);

  if (!src) {
    return <div className="absolute inset-0 bg-[#121214]" aria-hidden />;
  }

  const isGif = /\.gif($|\?)/i.test(src);
  const isRemote = /^https?:\/\//i.test(src);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#121214]" aria-hidden>
      <Image
        key={src}
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        unoptimized={isGif || isRemote}
        onLoad={() => setLoaded(true)}
        className="object-cover object-[center_45%] transition-opacity ease-out motion-reduce:transition-none"
        style={{
          opacity: visible ? 1 : 0,
          transitionDuration: `${WALLPAPER_FADE_MS}ms`,
        }}
      />
    </div>
  );
}

function LockSpinner() {
  return (
    <div className="flex flex-col items-center gap-3" aria-live="polite">
      <span className="boot-spinner" role="status" aria-label="Loading wallpaper" />
      <span className="text-[11px] tracking-wide text-white/35">Preparing desktop</span>
    </div>
  );
}

export function BootGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("checking");
  /** Subtle zoom only on direct desktop entry (reload / same-session), never after lock slide-up. */
  const [zoomReveal, setZoomReveal] = useState(false);
  const [wallpaperReady, setWallpaperReady] = useState(false);

  const onWallpaperReady = useCallback((ready: boolean) => {
    setWallpaperReady(ready);
  }, []);

  const enter = useCallback(() => {
    setPhase((current) => {
      if (current !== "intro") return current;
      try {
        window.sessionStorage.setItem(BOOT_SESSION_KEY, "1");
      } catch {
        /* private mode */
      }
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return "ready";
      return "exiting";
    });
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(BOOT_SESSION_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) {
      setZoomReveal(true);
      setPhase("ready");
    } else {
      setPhase("intro");
    }
  }, []);

  useEffect(() => {
    if (phase !== "intro") return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
        event.preventDefault();
        enter();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, enter]);

  useEffect(() => {
    if (phase !== "exiting") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setPhase("ready"), reduced ? EXIT_MS_REDUCED : EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const showIntro = phase === "intro" || phase === "exiting";
  const desktopLive = phase === "ready" || phase === "exiting" || phase === "intro";

  if (phase === "checking") {
    return <div className="fixed inset-0 z-[80] bg-[#121214]" aria-hidden />;
  }

  return (
    <>
      <div
        className={
          phase === "intro"
            ? "pointer-events-none opacity-0"
            : zoomReveal && phase === "ready"
              ? "boot-desktop-in opacity-100"
              : "opacity-100"
        }
        aria-hidden={phase !== "ready"}
      >
        {desktopLive ? children : null}
      </div>

      {showIntro ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="boot-name"
          aria-describedby="boot-blurb"
          className={`boot-screen fixed inset-0 z-[80] flex cursor-pointer flex-col items-center justify-center overflow-hidden px-6 text-center ${
            phase === "exiting" ? "boot-screen-out" : "boot-screen-in"
          }`}
          onClick={enter}
        >
          <LockWallpaper onReady={onWallpaperReady} />
          <div className="boot-veil absolute inset-0" />
          <div className="relative z-10 max-w-xl">
            <p className="boot-rise text-[12px] font-medium tracking-[0.22em] text-white/45 uppercase">
              {site.location}
            </p>
            <h1
              id="boot-name"
              className="boot-rise boot-rise-delay-1 mt-4 text-[clamp(2.4rem,7vw,4.25rem)] leading-[1.05] font-semibold tracking-tight text-white"
            >
              {site.name}
            </h1>
            <p className="boot-rise boot-rise-delay-2 mt-3 text-[15px] font-medium text-white/70 sm:text-[17px]">
              {site.role}
            </p>
            <p
              id="boot-blurb"
              className="boot-rise boot-rise-delay-3 mx-auto mt-5 max-w-md text-[14px] leading-relaxed text-white/55 sm:text-[15px]"
            >
              {resume.headline}
            </p>

            <div className="relative mt-10 min-h-[3.25rem]">
              <div
                className={`absolute inset-x-0 top-0 flex justify-center transition-opacity duration-500 ${
                  wallpaperReady ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
                aria-hidden={wallpaperReady}
              >
                {!wallpaperReady ? <LockSpinner /> : null}
              </div>
              <p
                className={`text-[12px] text-white/40 transition-opacity duration-500 ${
                  wallpaperReady ? "opacity-100" : "opacity-0"
                }`}
              >
                Click anywhere to enter
                <span className="hidden sm:inline"> · or press Enter</span>
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
