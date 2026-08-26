import "server-only";

import { Redis } from "@upstash/redis";
import { START_FEN } from "@/lib/chess-core";
import type { ChessLiveEvent } from "@/lib/types";

export type { ChessLiveEvent as ChessEvent } from "@/lib/types";
export const CHESS_FEN_KEY = "chess_fen";
export const CHESS_CONNECTIONS_KEY = "chess_connections";
export const CHESS_CHANNEL = "chess_sync";
export const CONTACT_KEY = "contact_messages";

const CAS_SCRIPT = `
local current = redis.call('GET', KEYS[1])
if (not current) then
  current = ARGV[3]
end
if current == ARGV[2] then
  return ARGV[2]
end
if current ~= ARGV[1] then
  return current
end
redis.call('SET', KEYS[1], ARGV[2])
return ARGV[2]
`;

let client: Redis | null = null;

export function getRedis(): Redis | null {
  if (client) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  client = new Redis({ url, token, cache: "no-store" });
  return client;
}

export async function freshRedisGet(key: string): Promise<string | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: "[]",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { result?: string | number | null };
  if (json.result === null || json.result === undefined) return null;
  return String(json.result);
}

export function redisConfigured() {
  return Boolean(getRedis());
}

export async function compareAndSetFen(previousFen: string, newFen: string) {
  const redis = getRedis();
  if (!redis) return null;
  const written = await redis.eval(CAS_SCRIPT, [CHESS_FEN_KEY], [
    previousFen,
    newFen,
    START_FEN,
  ]);
  return typeof written === "string" ? written : String(written);
}

export async function publishChess(event: ChessLiveEvent) {
  const redis = getRedis();
  if (!redis) return;
  await redis.publish(CHESS_CHANNEL, JSON.stringify(event));
}

export function subscribeRedis(
  onEvent: (event: ChessLiveEvent) => void,
  signal: AbortSignal,
) {
  const redis = getRedis();
  if (!redis) return () => {};

  const subscriber = redis.subscribe<ChessLiveEvent>(CHESS_CHANNEL);
  subscriber.on("message", (payload) => {
    const raw = payload.message;
    if (raw && typeof raw === "object" && "fen" in raw && typeof raw.fen === "string") {
      onEvent({
        type: "state",
        fen: raw.fen,
        connections: typeof raw.connections === "number" ? raw.connections : 0,
      });
      return;
    }
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw) as ChessLiveEvent;
        if (parsed && typeof parsed.fen === "string") onEvent(parsed);
      } catch {
        // ignore malformed pub/sub payloads
      }
    }
  });

  const stop = () => {
    void subscriber.unsubscribe();
  };
  signal.addEventListener("abort", stop, { once: true });
  return stop;
}
