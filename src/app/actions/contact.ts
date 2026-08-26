"use server";

import { CONTACT_KEY, getRedis } from "@/lib/redis";
import { site } from "@/lib/site";

export type ContactState = {
  ok: boolean;
  message: string;
};

export async function sendMessage(
  _prev: ContactState | null,
  formData: FormData,
): Promise<ContactState> {
  const trap = String(formData.get("company") ?? "");
  if (trap) return { ok: true, message: "Sent. I’ll write back soon." };

  const body = String(formData.get("message") ?? "").trim();

  if (body.length < 8) {
    return { ok: false, message: "Give me a little more in the message." };
  }
  if (body.length > 4000) {
    return { ok: false, message: "Let’s keep it under 4,000 characters." };
  }

  const redis = getRedis();
  if (redis) {
    await redis.lpush(
      CONTACT_KEY,
      JSON.stringify({
        message: body,
        to: site.email,
        at: new Date().toISOString(),
      }),
    );
  }

  return { ok: true, message: "Sent. I’ll write back soon." };
}
