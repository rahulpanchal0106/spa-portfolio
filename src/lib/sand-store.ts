import "server-only";

import { publishSandMemory } from "@/lib/sand-hub";
import { freshRedisGet, getRedis } from "@/lib/redis";
import { parseSandEvent, parseSandEventFromUnknown, type SandEvent } from "@/lib/sand-core";

export const SAND_SEQ_KEY = "sand_seq";
export const SAND_EVT_PREFIX = "sand_evt:";
const POLL_MS = 500;
const EVENT_TTL_SEC = 180;
const CATCH_UP = 40;

let missingRedisWarned = false;

function sandRedis() {
  const redis = getRedis();
  if (!redis) {
    if (process.env.VERCEL && !missingRedisWarned) {
      missingRedisWarned = true;
      console.warn("[sand] UPSTASH Redis env missing; SSE will not cross Vercel isolates");
    }
    return null;
  }
  if (process.env.VERCEL) return redis;
  if (process.env.NODE_ENV === "production") return redis;
  return null;
}

function parsePayload(raw: string): SandEvent | null {
  const direct = parseSandEvent(raw);
  if (direct) return direct;
  try {
    const inner = JSON.parse(raw) as unknown;
    if (typeof inner === "string") return parseSandEvent(inner);
    return parseSandEventFromUnknown(inner);
  } catch {
    return null;
  }
}

export function sandBus(): "memory" | "redis" {
  return sandRedis() ? "redis" : "memory";
}

export async function publishSand(event: SandEvent) {
  publishSandMemory(event);
  const redis = sandRedis();
  if (!redis) return;
  const seq = Number(await redis.incr(SAND_SEQ_KEY));
  if (!Number.isFinite(seq) || seq < 1) return;
  await redis.set(`${SAND_EVT_PREFIX}${seq}`, JSON.stringify(event), { ex: EVENT_TTL_SEC });
}

export function watchSandMailbox(onEvent: (event: SandEvent) => void, signal: AbortSignal) {
  if (!sandRedis()) return () => {};

  let last = -1;
  let busy = false;
  let timer: ReturnType<typeof setInterval> | undefined;

  const tick = async () => {
    if (busy || signal.aborted) return;
    busy = true;
    try {
      const seq = Number((await freshRedisGet(SAND_SEQ_KEY)) ?? 0);
      if (!Number.isFinite(seq)) return;
      if (last < 0) {
        last = seq;
        return;
      }
      if (seq <= last) return;
      const until = Math.min(seq, last + CATCH_UP);
      for (let i = last + 1; i <= until; i++) {
        const payload = await freshRedisGet(`${SAND_EVT_PREFIX}${i}`);
        if (!payload) {
          last = i - 1;
          return;
        }
        const event = parsePayload(payload);
        if (event && (event.type === "stroke" || event.type === "strokes" || event.type === "clear")) {
          onEvent(event);
        }
        last = i;
      }
    } catch {
      // keep the stream alive; next tick retries
    } finally {
      busy = false;
    }
  };

  timer = setInterval(() => {
    void tick();
  }, POLL_MS);
  void tick();

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = undefined;
  };
  signal.addEventListener("abort", stop, { once: true });
  return stop;
}
