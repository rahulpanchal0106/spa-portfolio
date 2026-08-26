import { getChessSnapshot } from "@/lib/chess-store";
import { PortfolioShell } from "@/components/layout/PortfolioShell";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialChess = await getChessSnapshot();
  return <PortfolioShell initialChess={initialChess} />;
}
