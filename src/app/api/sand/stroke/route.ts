import { clearSandWorld, publishSandStrokes } from "@/app/actions/sand";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ ok: false }, { status: 400 });

  if (body.type === "clear") {
    const result = await clearSandWorld();
    return Response.json(result);
  }

  const payload = Array.isArray(body.strokes) ? body.strokes : (body.stroke ?? body);
  const result = await publishSandStrokes(payload);
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
