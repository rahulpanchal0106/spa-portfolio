import "server-only";

import { publishSandMemory } from "@/lib/sand-hub";
import { getRedis } from "@/lib/redis";
import { parseSandEventFromUnknown, type SandEvent } from "@/lib/sand-core";

export const SAND_CHANNEL = "sand_sync";

let missingRedisWarned = false;

function sandRedis() {
  // Local `next dev` is one process — memory fan-out is enough.
  // Vercel runs POST and SSE on different isolates, so they need Redis.
  if (!process.env.VERCEL) return null;
  const redis = getRedis();
  if (!redis && !missingRedisWarned) {
    missingRedisWarned = true;
    console.warn("[sand] UPSTASH Redis env missing; SSE will not cross Vercel isolates");
  }
  return redis;
}

function safeJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function publishSand(event: SandEvent) {
  publishSandMemory(event);
  const redis = sandRedis();
  if (!redis) return;
  await redis.publish(SAND_CHANNEL, JSON.stringify(event));
}

export function subscribeSandRedis(onEvent: (event: SandEvent) => void, signal: AbortSignal) {
  const redis = sandRedis();
  if (!redis) return () => {};

  const subscriber = redis.subscribe<SandEvent>(SAND_CHANNEL);
  subscriber.on("message", (payload) => {
    const raw = payload.message;
    const event =
      typeof raw === "string" ? parseSandEventFromUnknown(safeJson(raw)) : parseSandEventFromUnknown(raw);
    if (event && (event.type === "stroke" || event.type === "strokes" || event.type === "clear")) {
      onEvent(event);
    }
  });

  const stop = () => {
    void subscriber.unsubscribe();
  };
  signal.addEventListener("abort", stop, { once: true });
  return stop;
}
