export type ChessSnapshot = {
  fen: string;
  connections: number;
  realtime: "upstash" | "local";
};

export type ChessLiveEvent = {
  type: "state";
  fen: string;
  connections: number;
};

export function parseChessLiveEvent(raw: string): ChessLiveEvent | null {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== "object") return null;
    const rec = data as Record<string, unknown>;
    if (typeof rec.fen !== "string") return null;
    return {
      type: "state",
      fen: rec.fen,
      connections: typeof rec.connections === "number" ? rec.connections : 0,
    };
  } catch {
    return null;
  }
}
