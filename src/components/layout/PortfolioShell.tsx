"use client";

import { ChessTile } from "@/components/chess/ChessTile";
import { ContactForm } from "@/components/contact/ContactForm";
import { FolderGrid } from "@/components/folders/FolderGrid";
import { Spotlight, SpotlightCarousel } from "@/components/spotlight/Spotlight";
import { SkillsMarquee, TopBar } from "@/components/system/TopBar";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { site } from "@/lib/site";
import type { ChessSnapshot } from "@/lib/types";

export function DesktopLayout({ initialChess }: { initialChess: ChessSnapshot }) {
  return (
    <div className="flex h-screen flex-col">
      <div className="h-8 shrink-0">
        <TopBar />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-12 grid-rows-11 gap-2 p-2">
        <FolderGrid className="col-span-6 row-span-11 h-full" columns={4} />
        <Spotlight className="col-span-6 row-span-6 h-full" />
        <ContactForm className="col-span-3 row-span-5 h-full" />
        <ChessTile className="col-span-3 row-span-5 h-full" initial={initialChess} />
      </div>
    </div>
  );
}

export function MobileLayout({ initialChess }: { initialChess: ChessSnapshot }) {
  return (
    <div className="space-y-3 p-3 pb-6">
      <GlassPanel className="p-3">
        <h1 className="text-[17px] font-semibold tracking-tight text-white">{site.name}</h1>
        <p className="text-sm text-white/65">{site.role}</p>
        <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80">
          <span className="h-2 w-2 rounded-full bg-[#30d158] shadow-[0_0_8px_#30d158]" />
          {site.status}
        </span>
        <div className="mt-3">
          <SkillsMarquee />
        </div>
      </GlassPanel>
      <SpotlightCarousel />
      <FolderGrid columns={3} />
      <ContactForm />
      <ChessTile initial={initialChess} />
    </div>
  );
}

export function PortfolioShell({ initialChess }: { initialChess: ChessSnapshot }) {
  return (
    <>
      <div className="hidden lg:block">
        <DesktopLayout initialChess={initialChess} />
      </div>
      <div className="block min-h-screen lg:hidden">
        <MobileLayout initialChess={initialChess} />
      </div>
    </>
  );
}
