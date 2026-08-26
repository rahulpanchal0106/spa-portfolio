import { makeMove } from "@/app/actions/chess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    previousFen?: unknown;
    newFen?: unknown;
  } | null;
  if (!body || typeof body.previousFen !== "string" || typeof body.newFen !== "string") {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }
  const result = await makeMove(body.previousFen, body.newFen);
  return Response.json(result);
}
