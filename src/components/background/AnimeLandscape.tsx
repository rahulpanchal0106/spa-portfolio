"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useWallpaper } from "@/components/background/WallpaperProvider";

function FadeImage({
  src,
  show,
  priority,
  onLoaded,
  onShown,
}: {
  src: string;
  show: boolean;
  priority?: boolean;
  onLoaded: () => void;
  onShown?: () => void;
}) {
  const isGif = /\.gif($|\?)/i.test(src);
  const isRemote = /^https?:\/\//i.test(src);
  const wasShown = useRef(false);

  useEffect(() => {
    if (!show || !onShown || wasShown.current) return;
    wasShown.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(onShown, reduced ? 0 : 700);
    return () => window.clearTimeout(timer);
  }, [show, onShown]);

  useEffect(() => {
    wasShown.current = false;
  }, [src]);

  return (
    <Image
      src={src}
      alt=""
      fill
      priority={priority}
      sizes="100vw"
      unoptimized={isGif || isRemote}
      onLoad={onLoaded}
      className={`absolute inset-0 object-cover object-[center_42%] transition-opacity duration-700 ease-out motion-reduce:transition-none ${
        show ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

export function AnimeLandscape() {
  const { src } = useWallpaper();
  const [bottom, setBottom] = useState<string | null>(null);
  const [bottomLoaded, setBottomLoaded] = useState(false);
  const [top, setTop] = useState<string | null>(null);
  const [topLoaded, setTopLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;

    if (!bottom) {
      setBottom(src);
      setBottomLoaded(false);
      return;
    }

    if (src === bottom || src === top) return;

    setTop(src);
    setTopLoaded(false);
  }, [src, bottom, top]);

  // After the overlay finishes fading in, copy it underneath, then drop the overlay
  // only once the bottom layer has that same image ready (avoids a snap).
  useEffect(() => {
    if (!top || bottom !== top || !bottomLoaded || !topLoaded) return;
    setTop(null);
    setTopLoaded(false);
  }, [top, bottom, bottomLoaded, topLoaded]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#1c1c1e]">
      {bottom ? (
        <FadeImage
          src={bottom}
          priority
          show={bottomLoaded}
          onLoaded={() => setBottomLoaded(true)}
        />
      ) : null}

      {top ? (
        <FadeImage
          src={top}
          show={topLoaded}
          onLoaded={() => setTopLoaded(true)}
          onShown={() => {
            setBottom(top);
            setBottomLoaded(false);
          }}
        />
      ) : null}

      <div className="wallpaper-scrim absolute inset-0" aria-hidden />
    </div>
  );
}
