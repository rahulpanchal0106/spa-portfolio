import { subscribeMemory } from "@/lib/memory-chess";
import { bumpConnections, getChessSnapshotFresh } from "@/lib/chess-store";
import { subscribeRedis } from "@/lib/redis";
import type { ChessLiveEvent } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const maxDuration = 300;

function encode(event: ChessLiveEvent) {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function GET(request: Request) {
  const encoder = new TextEncoder();
  let cleaned = false;

  const cleanup = async () => {
    if (cleaned) return;
    cleaned = true;
    await bumpConnections(-1);
  };

  let shutdown = () => {
    void cleanup();
  };

  const stream = new ReadableStream({
    start(controller) {
      let lastFen = "";
      let lastConnections = -1;

      const send = (event: ChessLiveEvent) => {
        if (!event.fen) return;
        if (event.fen === lastFen && event.connections === lastConnections) return;
        lastFen = event.fen;
        lastConnections = event.connections;
        try {
          controller.enqueue(encoder.encode(encode(event)));
        } catch {
          // stream already closed
        }
      };

      try {
        controller.enqueue(encoder.encode("retry: 1000\n: connected\n\n"));
      } catch {
        return;
      }

      const unsubscribeMemory = subscribeMemory(send);
      const unsubscribeRedis = subscribeRedis(send, request.signal);

      const poll = setInterval(() => {
        void getChessSnapshotFresh()
          .then((next) => {
            if (next) send({ type: "state", fen: next.fen, connections: next.connections });
          })
          .catch(() => {});
      }, 250);

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          // stream already closed
        }
      }, 15000);

      shutdown = () => {
        shutdown = () => {};
        clearInterval(poll);
        clearInterval(heartbeat);
        unsubscribeMemory();
        unsubscribeRedis();
        void cleanup();
        try {
          controller.close();
        } catch {
          // already closed
        }
      };

      request.signal.addEventListener("abort", shutdown, { once: true });

      void bumpConnections(1)
        .then(async () => {
          const snapshot = await getChessSnapshotFresh();
          if (snapshot) send({ type: "state", fen: snapshot.fen, connections: snapshot.connections });
        })
        .catch(() => {});
    },
    cancel() {
      shutdown();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-store, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Content-Encoding": "none",
    },
  });
}
