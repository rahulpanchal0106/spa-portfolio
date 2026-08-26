"use server";

import { headers } from "next/headers";
import { chatSystemPrompt, normalizeQuestion, questionHash } from "@/lib/chat-knowledge";
import { CHAT_CACHE_PREFIX, CHAT_RATE_PREFIX, getRedis } from "@/lib/redis";

const DAILY_LIMIT = 8;
const CACHE_TTL_SEC = 60 * 60 * 24;
const MAX_QUESTION = 280;
const GEMINI_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
];

export type ChatResult =
  | { ok: true; answer: string; cached: boolean; remaining: number }
  | { ok: false; error: string; remaining?: number };

function clientKey(ip: string) {
  return questionHash(`ip:${ip}`);
}

async function visitorId() {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for")?.split(",")[0]?.trim();
  const real = list.get("x-real-ip")?.trim();
  return forwarded || real || "anon";
}

async function takeRateSlot(id: string): Promise<{ ok: boolean; remaining: number }> {
  const redis = getRedis();
  if (!redis) return { ok: true, remaining: DAILY_LIMIT };
  const key = `${CHAT_RATE_PREFIX}${clientKey(id)}`;
  const used = Number(await redis.incr(key));
  if (used === 1) await redis.expire(key, CACHE_TTL_SEC);
  const remaining = Math.max(0, DAILY_LIMIT - used);
  if (used > DAILY_LIMIT) {
    await redis.decr(key);
    return { ok: false, remaining: 0 };
  }
  return { ok: true, remaining };
}

async function cachedAnswer(hash: string) {
  const redis = getRedis();
  if (!redis) return null;
  const value = await redis.get<string>(`${CHAT_CACHE_PREFIX}${hash}`);
  return typeof value === "string" && value.length ? value : null;
}

async function storeAnswer(hash: string, answer: string) {
  const redis = getRedis();
  if (!redis) return;
  await redis.set(`${CHAT_CACHE_PREFIX}${hash}`, answer, { ex: CACHE_TTL_SEC });
}

function geminiMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const rec = payload as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    error?: { message?: string };
  };
  if (typeof rec.error?.message === "string") return rec.error.message;
  return rec.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim() ?? "";
}

async function generateWithGemini(question: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("missing-key");
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: chatSystemPrompt() }] },
    contents: [{ role: "user", parts: [{ text: question }] }],
    generationConfig: { maxOutputTokens: 640, temperature: 0.4 },
  });

  let lastError = "Gemini is unavailable.";
  for (const model of GEMINI_MODELS) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key,
        },
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      },
    );
    const json: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      lastError = geminiMessage(json) || `Gemini ${response.status}`;
      continue;
    }
    const text = geminiMessage(json);
    if (text) return text;
  }
  throw new Error(lastError);
}

export async function askAboutRahul(question: unknown): Promise<ChatResult> {
  if (typeof question !== "string") return { ok: false, error: "Ask something about Rahul’s work." };
  const trimmed = question.trim();
  if (trimmed.length < 4) return { ok: false, error: "Give me a little more in the question." };
  if (trimmed.length > MAX_QUESTION) return { ok: false, error: "Keep it under 280 characters." };

  const normalized = normalizeQuestion(trimmed);
  const hash = questionHash(normalized);
  const id = await visitorId();

  const hit = await cachedAnswer(hash);
  if (hit) {
    const redis = getRedis();
    let remaining = DAILY_LIMIT;
    if (redis) {
      const used = Number((await redis.get<number | string>(`${CHAT_RATE_PREFIX}${clientKey(id)}`)) ?? 0);
      remaining = Math.max(0, DAILY_LIMIT - used);
    }
    return { ok: true, answer: hit, cached: true, remaining };
  }

  const slot = await takeRateSlot(id);
  if (!slot.ok) {
    return { ok: false, error: "That’s today’s limit. Use Mail if you want to keep going.", remaining: 0 };
  }

  try {
    const answer = await generateWithGemini(trimmed);
    await storeAnswer(hash, answer);
    return { ok: true, answer, cached: false, remaining: slot.remaining };
  } catch (error) {
    const redis = getRedis();
    if (redis) await redis.decr(`${CHAT_RATE_PREFIX}${clientKey(id)}`);
    const message = error instanceof Error ? error.message : "unavailable";
    if (message === "missing-key") {
      return {
        ok: false,
        error: "Chat is not configured yet. Use Mail, or add GEMINI_API_KEY.",
        remaining: Math.min(DAILY_LIMIT, slot.remaining + 1),
      };
    }
    return {
      ok: false,
      error: "The model didn’t answer. Try Mail, or ask again in a moment.",
      remaining: Math.min(DAILY_LIMIT, slot.remaining + 1),
    };
  }
}
