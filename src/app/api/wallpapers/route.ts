import { listWallpapers } from "@/lib/wallpapers.server";
import { FALLBACK_WALLPAPER } from "@/lib/wallpapers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const wallpapers = await listWallpapers();
    return Response.json(wallpapers.length > 0 ? wallpapers : [FALLBACK_WALLPAPER]);
  } catch {
    return Response.json([FALLBACK_WALLPAPER]);
  }
}
