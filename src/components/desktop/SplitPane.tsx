"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type Axis = "horizontal" | "vertical";

type SplitPaneProps = {
  axis: Axis;
  /** First pane size as percent of the container (0–100). */
  defaultSize?: number;
  minFirst?: number;
  minSecond?: number;
  storageKey?: string;
  className?: string;
  children: [ReactNode, ReactNode];
};

function readStored(key: string | undefined, fallback: number) {
  if (!key || typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function SplitPane({
  axis,
  defaultSize = 50,
  minFirst = 22,
  minSecond = 22,
  storageKey,
  className,
  children,
}: SplitPaneProps) {
  const [size, setSize] = useState(defaultSize);
  const sizeRef = useRef(size);
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = readStored(storageKey, defaultSize);
    setSize(stored);
    sizeRef.current = stored;
  }, [defaultSize, storageKey]);

  const clamp = useCallback(
    (next: number) => Math.min(100 - minSecond, Math.max(minFirst, next)),
    [minFirst, minSecond],
  );

  const applySize = useCallback(
    (next: number) => {
      const value = clamp(next);
      sizeRef.current = value;
      setSize(value);
    },
    [clamp],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    document.body.style.cursor = axis === "horizontal" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const next =
      axis === "horizontal"
        ? ((event.clientX - rect.left) / rect.width) * 100
        : ((event.clientY - rect.top) / rect.height) * 100;
    applySize(next);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // already released
    }
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, String(sizeRef.current));
      } catch {
        // ignore
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex min-h-0 min-w-0 flex-1",
        axis === "horizontal" ? "flex-row" : "flex-col",
        className,
      )}
    >
      <div
        className="min-h-0 min-w-0 overflow-hidden"
        style={{ flex: `0 0 ${size}%` }}
      >
        <div className="h-full w-full min-h-0">{children[0]}</div>
      </div>
      <div
        role="separator"
        aria-orientation={axis === "horizontal" ? "vertical" : "horizontal"}
        aria-valuenow={Math.round(size)}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={(event) => {
          const step = event.shiftKey ? 5 : 2;
          if (axis === "horizontal") {
            if (event.key === "ArrowLeft") applySize(sizeRef.current - step);
            if (event.key === "ArrowRight") applySize(sizeRef.current + step);
          } else {
            if (event.key === "ArrowUp") applySize(sizeRef.current - step);
            if (event.key === "ArrowDown") applySize(sizeRef.current + step);
          }
          if (storageKey && (event.key.startsWith("Arrow"))) {
            try {
              localStorage.setItem(storageKey, String(sizeRef.current));
            } catch {
              // ignore
            }
          }
        }}
        className={cn(
          "group relative z-10 shrink-0 touch-none",
          axis === "horizontal" ? "w-1.5 cursor-col-resize px-0" : "h-1.5 cursor-row-resize",
        )}
      >
        <span
          className={cn(
            "absolute rounded-full bg-white/15 transition group-hover:bg-[#0a84ff]/80 group-active:bg-[#0a84ff]",
            axis === "horizontal"
              ? "inset-y-4 left-1/2 w-0.5 -translate-x-1/2"
              : "inset-x-4 top-1/2 h-0.5 -translate-y-1/2",
          )}
        />
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="h-full w-full min-h-0">{children[1]}</div>
      </div>
    </div>
  );
}
