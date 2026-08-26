import { subscribeSandMemory } from "@/lib/sand-hub";
import { sandBus, watchSandMailbox } from "@/lib/sand-store";
import type { SandEvent } from "@/lib/sand-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
/** Hobby Fluid Compute cap. The client reconnects before this. */
export const maxDuration = 300;

function encode(event: SandEvent) {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function GET(request: Request) {
  const encoder = new TextEncoder();
  let shutdown = () => {};

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: SandEvent) => {
        try {
          controller.enqueue(encoder.encode(encode(event)));
        } catch {
          // stream already closed
        }
      };

      try {
        controller.enqueue(encoder.encode(`retry: 1000\n: ${" ".repeat(2048)}\n\n`));
        send({ type: "ready", bus: sandBus() });
      } catch {
        return;
      }

      const unsubMemory = subscribeSandMemory(send);
      const unsubMailbox = watchSandMailbox(send, request.signal);

      const heartbeat = setInterval(() => {
        send({ type: "ping" });
      }, 15000);

      shutdown = () => {
        shutdown = () => {};
        clearInterval(heartbeat);
        unsubMemory();
        unsubMailbox();
        try {
          controller.close();
        } catch {
          // already closed
        }
      };

      request.signal.addEventListener("abort", shutdown, { once: true });
    },
    cancel() {
      shutdown();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-store, no-transform",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Content-Encoding": "none",
    },
  });
}
