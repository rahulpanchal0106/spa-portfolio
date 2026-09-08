"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import "@excalidraw/excalidraw/index.css";

const Excalidraw = dynamic(async () => (await import("@excalidraw/excalidraw")).Excalidraw, {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-[12px] text-zinc-500">Loading diagram…</div>
  ),
});

type Scene = {
  elements?: unknown[];
  appState?: Record<string, unknown>;
  files?: Record<string, unknown>;
};

type ZoomValue = number & { _brand: "normalizedZoom" };

type ExcalidrawApi = {
  updateScene: (data: { appState?: Record<string, unknown> }) => void;
  getAppState: () => { zoom: { value: number }; scrollX: number; scrollY: number };
  getSceneElements: () => readonly unknown[];
  scrollToContent: (
    target?: unknown,
    opts?: { fitToViewport?: boolean; animate?: boolean; duration?: number; maxZoom?: number },
  ) => void;
};

const MAX_ZOOM = 1.6;
const ZOOM_STEP = 0.12;

function clampZoom(value: number) {
  // No zoom-out floor — only cap how far you can zoom in.
  return Math.min(MAX_ZOOM, Math.max(0.01, Math.round(value * 100) / 100));
}

function asZoom(value: number): ZoomValue {
  return clampZoom(value) as ZoomValue;
}

export function ExcalidrawViewer({ sceneUrl }: { sceneUrl: string }) {
  const [scene, setScene] = useState<Scene | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const apiRef = useRef<ExcalidrawApi | null>(null);

  useEffect(() => {
    let cancelled = false;
    setScene(null);
    setError(null);
    setZoom(1);
    apiRef.current = null;
    void fetch(sceneUrl)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Could not load ${sceneUrl}`);
        return (await res.json()) as Scene;
      })
      .then((data) => {
        if (!cancelled) setScene(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [sceneUrl]);

  const applyZoom = useCallback((next: number) => {
    const api = apiRef.current;
    if (!api) return;
    const value = clampZoom(next);
    api.updateScene({ appState: { zoom: { value: asZoom(value) } } });
    setZoom(value);
  }, []);

  const fitView = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    api.scrollToContent(undefined, {
      fitToViewport: true,
      animate: true,
      duration: 280,
      maxZoom: MAX_ZOOM,
    });
    // sync label after fit settles
    window.setTimeout(() => {
      const current = apiRef.current?.getAppState().zoom.value;
      if (typeof current === "number") setZoom(clampZoom(current));
    }, 320);
  }, []);

  const resetView = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    api.updateScene({
      appState: {
        zoom: { value: asZoom(1) },
        scrollX: 0,
        scrollY: 0,
      },
    });
    setZoom(1);
    window.requestAnimationFrame(() => {
      api.scrollToContent(undefined, { fitToViewport: true, animate: false, maxZoom: 1 });
      setZoom(clampZoom(api.getAppState().zoom.value));
    });
  }, []);

  if (error) {
    return <div className="grid h-full place-items-center bg-white px-4 text-center text-[12px] text-[#ff9f0a]">{error}</div>;
  }
  if (!scene) {
    return <div className="grid h-full place-items-center bg-white text-[12px] text-zinc-500">Loading diagram…</div>;
  }

  const { collaborators: _ignored, ...safeAppState } = (scene.appState ?? {}) as Record<string, unknown>;
  const elements = ((scene.elements ?? []) as Array<Record<string, unknown>>).map((el) =>
    el.type === "text" ? { ...el, strokeColor: "#000000" } : el,
  );

  return (
    <div className="excalidraw-host relative h-full min-h-0 w-full bg-white">
      <Excalidraw
        key={sceneUrl}
        excalidrawAPI={(api) => {
          apiRef.current = api as unknown as ExcalidrawApi;
        }}
        initialData={{
          elements: elements as never,
          appState: {
            ...safeAppState,
            viewBackgroundColor: "#ffffff",
            theme: "light",
            zoom: { value: asZoom(1) },
          } as never,
          files: (scene.files ?? {}) as never,
          scrollToContent: true,
        }}
        viewModeEnabled
        zenModeEnabled
        theme="light"
        onScrollChange={(_scrollX, _scrollY, nextZoom) => {
          const value = typeof nextZoom === "number" ? nextZoom : nextZoom?.value;
          if (typeof value !== "number") return;
          if (value > MAX_ZOOM) {
            applyZoom(value);
            return;
          }
          setZoom(clampZoom(value));
        }}
        UIOptions={{
          canvasActions: {
            changeViewBackgroundColor: false,
            clearCanvas: false,
            export: false,
            loadScene: false,
            saveToActiveFile: false,
            toggleTheme: false,
            saveAsImage: false,
          },
        }}
      />

      <div className="absolute top-2 right-2 z-20 flex items-center gap-0.5 rounded-lg border border-zinc-200 bg-white/95 p-0.5 shadow-sm">
        <ControlButton label="Zoom out" onClick={() => applyZoom(zoom - ZOOM_STEP)}>
          −
        </ControlButton>
        <button
          type="button"
          title="Reset to 100%"
          onClick={() => applyZoom(1)}
          className="min-w-11 rounded-md px-1.5 py-1 font-mono text-[11px] text-zinc-700 hover:bg-zinc-100"
        >
          {Math.round(zoom * 100)}%
        </button>
        <ControlButton label="Zoom in" onClick={() => applyZoom(zoom + ZOOM_STEP)}>
          +
        </ControlButton>
        <span className="mx-0.5 h-4 w-px bg-zinc-200" />
        <ControlButton label="Fit to view" onClick={fitView}>
          Fit
        </ControlButton>
        <ControlButton label="Reset view" onClick={resetView}>
          Reset
        </ControlButton>
      </div>

      <p className="pointer-events-none absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] text-white/90">
        Drag to pan · scroll / pinch to zoom · max {Math.round(MAX_ZOOM * 100)}%
      </p>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="rounded-md px-2 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100"
    >
      {children}
    </button>
  );
}
