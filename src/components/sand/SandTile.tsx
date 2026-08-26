"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import {
  applyStroke,
  clearGrid,
  paintGrid,
  parseSandEvent,
  SAND_H,
  SAND_W,
  stepSand,
  strokesFromEvent,
  type SandElement,
  type SandStroke,
} from "@/lib/sand-core";

const TOOLS: { id: SandElement; label: string }[] = [
  { id: "sand", label: "⏳ Sand" },
  { id: "water", label: "💧 Water" },
  { id: "fire", label: "🔥 Fire" },
  { id: "wall", label: "🧱 Wall" },
  { id: "erase", label: "🧼 Erase" },
];

const BRUSH = 3;
const FLUSH_MS = 40;
/** Reconnect before Vercel Hobby kills the function at maxDuration 300s. */
const STREAM_LIFE_MS = 270_000;
const STREAM_RETRY_MS = 800;
const DESKTOP_MQ = "(min-width: 1024px)";

function subscribeDesktopMq(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP_MQ);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useStreamLive(layout?: "desktop" | "mobile") {
  const desktop = useSyncExternalStore(
    subscribeDesktopMq,
    () => window.matchMedia(DESKTOP_MQ).matches,
    () => layout !== "mobile",
  );
  if (!layout) return true;
  return layout === "desktop" ? desktop : !desktop;
}

function cellFromPointer(canvas: HTMLCanvasElement, clientX: number, clientY: number) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(((clientX - rect.left) / rect.width) * SAND_W);
  const y = Math.floor(((clientY - rect.top) / rect.height) * SAND_H);
  return {
    x: Math.max(0, Math.min(SAND_W - 1, x)),
    y: Math.max(0, Math.min(SAND_H - 1, y)),
  };
}

async function postSand(body: Record<string, unknown>) {
  await fetch("/api/sand/stroke", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function SandTile({
  className,
  layout,
}: {
  className?: string;
  layout?: "desktop" | "mobile";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef(new Uint8Array(SAND_W * SAND_H));
  const elementRef = useRef<SandElement>("sand");
  const drawingRef = useRef(false);
  const lastCellRef = useRef<{ x: number; y: number } | null>(null);
  const clientIdRef = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `sand-${Math.random()}`,
  );
  const seqRef = useRef(0);
  const seenRef = useRef(new Set<string>());
  const pendingRef = useRef<SandStroke[]>([]);
  const flushTimerRef = useRef<number | undefined>(undefined);
  const [element, setElement] = useState<SandElement>("sand");
  const live = useStreamLive(layout);

  const remember = (id: string) => {
    const seen = seenRef.current;
    seen.add(id);
    if (seen.size > 240) {
      const first = seen.values().next().value;
      if (first) seen.delete(first);
    }
  };

  const flushNetwork = useCallback(() => {
    if (flushTimerRef.current !== undefined) {
      window.clearTimeout(flushTimerRef.current);
      flushTimerRef.current = undefined;
    }
    const batch = pendingRef.current;
    pendingRef.current = [];
    if (!batch.length) return;
    void postSand({ strokes: batch });
  }, []);

  const queueNetwork = useCallback(
    (stroke: SandStroke) => {
      remember(stroke.id);
      pendingRef.current.push(stroke);
      if (pendingRef.current.length >= 32) {
        flushNetwork();
        return;
      }
      if (flushTimerRef.current !== undefined) return;
      flushTimerRef.current = window.setTimeout(flushNetwork, FLUSH_MS);
    },
    [flushNetwork],
  );

  const stampSegment = useCallback(
    (from: { x: number; y: number }, to: { x: number; y: number }) => {
      seqRef.current += 1;
      const stroke: SandStroke = {
        id: `${clientIdRef.current}-${seqRef.current}`,
        element: elementRef.current,
        brushSize: BRUSH,
        startX: from.x,
        startY: from.y,
        endX: to.x,
        endY: to.y,
      };
      applyStroke(gridRef.current, stroke);
      queueNetwork(stroke);
    },
    [queueNetwork],
  );

  useEffect(() => {
    elementRef.current = element;
  }, [element]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    const image = ctx.createImageData(SAND_W, SAND_H);
    let frame = 0;
    let raf = 0;
    const loop = () => {
      stepSand(gridRef.current);
      stepSand(gridRef.current);
      paintGrid(gridRef.current, image.data, frame++);
      ctx.putImageData(image, 0, 0);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!live) return;

    let source: EventSource | null = null;
    let retry: number | undefined;
    let rotate: number | undefined;
    let closed = false;

    const connect = () => {
      if (closed) return;
      if (retry !== undefined) {
        window.clearTimeout(retry);
        retry = undefined;
      }
      if (rotate !== undefined) {
        window.clearTimeout(rotate);
        rotate = undefined;
      }
      source?.close();
      source = new EventSource(`/api/sand/stream?t=${Date.now()}`);
      source.onmessage = (message) => {
        const event = parseSandEvent(message.data);
        if (!event || event.type === "ready" || event.type === "ping") return;
        if (event.type === "clear") {
          clearGrid(gridRef.current);
          return;
        }
        for (const stroke of strokesFromEvent(event)) {
          if (seenRef.current.has(stroke.id)) continue;
          remember(stroke.id);
          applyStroke(gridRef.current, stroke);
        }
      };
      source.onerror = () => {
        source?.close();
        source = null;
        if (!closed) retry = window.setTimeout(connect, STREAM_RETRY_MS);
      };
      rotate = window.setTimeout(connect, STREAM_LIFE_MS);
    };

    connect();
    return () => {
      closed = true;
      if (retry !== undefined) window.clearTimeout(retry);
      if (rotate !== undefined) window.clearTimeout(rotate);
      if (flushTimerRef.current !== undefined) window.clearTimeout(flushTimerRef.current);
      source?.close();
    };
  }, [live]);

  function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    const cell = cellFromPointer(event.currentTarget, event.clientX, event.clientY);
    lastCellRef.current = cell;
    stampSegment(cell, cell);
  }

  function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const cell = cellFromPointer(event.currentTarget, event.clientX, event.clientY);
    const prev = lastCellRef.current ?? cell;
    if (prev.x === cell.x && prev.y === cell.y) return;
    stampSegment(prev, cell);
    lastCellRef.current = cell;
  }

  function onPointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    drawingRef.current = false;
    lastCellRef.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // already released
    }
    flushNetwork();
  }

  async function onClear() {
    clearGrid(gridRef.current);
    await postSand({ type: "clear" });
  }

  return (
    <div
      className={cn(
        "flex min-h-[280px] min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-neutral-950/80 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex shrink-0 flex-wrap gap-0.5 border-b border-white/10 px-1.5 py-1">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => setElement(tool.id)}
            className={cn(
              "rounded-md px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap",
              element === tool.id ? "bg-white/14 text-white" : "text-white/55 hover:bg-white/8 hover:text-white/80",
            )}
          >
            {tool.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void onClear()}
          className="rounded-md px-1.5 py-0.5 text-[10px] font-medium text-white/55 whitespace-nowrap hover:bg-white/8 hover:text-white/80"
        >
          🗑️ Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={SAND_W}
        height={SAND_H}
        aria-label="Falling sand sandbox"
        className="sand-canvas min-h-0 w-full flex-1 cursor-crosshair"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
    </div>
  );
}
