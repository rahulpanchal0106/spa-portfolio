"use client";

import { ChatTile } from "@/components/chat/ChatTile";
import { ContactForm } from "@/components/contact/ContactForm";
import { SplitPane } from "@/components/desktop/SplitPane";
import { FolderGrid } from "@/components/folders/FolderGrid";
import { SystemsOverview, SystemsOverviewCarousel } from "@/components/spotlight/SystemsOverview";
import { SkillsIconRow, SkillsMarquee, TopBar } from "@/components/system/TopBar";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { site } from "@/lib/site";

export function DesktopLayout() {
  return (
    <div className="flex h-screen flex-col">
      <div className="h-8 shrink-0">
        <TopBar />
      </div>
      <div className="min-h-0 flex-1 p-2">
        <SplitPane
          axis="horizontal"
          defaultSize={48}
          minFirst={32}
          minSecond={36}
          storageKey="split-finder"
          className="h-full gap-0"
        >
          <FolderGrid className="h-full" columns={4} />
          <SplitPane
            axis="vertical"
            defaultSize={58}
            minFirst={32}
            minSecond={28}
            storageKey="split-systems"
            className="h-full"
          >
            <SystemsOverview className="h-full" />
            <SplitPane
              axis="horizontal"
              defaultSize={50}
              minFirst={34}
              minSecond={34}
              storageKey="split-ask-mail"
              className="h-full"
            >
              <ChatTile className="h-full min-h-0" />
              <ContactForm className="h-full" />
            </SplitPane>
          </SplitPane>
        </SplitPane>
      </div>
    </div>
  );
}

export function MobileLayout() {
  return (
    <div className="space-y-3 p-3 pb-6">
      <GlassPanel className="p-3">
        <h1 className="text-[17px] font-semibold tracking-tight text-white">{site.name}</h1>
        <p className="text-sm text-white/65">{site.role}</p>
        <div className="mt-3">
          <SkillsIconRow />
        </div>
        <div className="mt-3">
          <SkillsMarquee />
        </div>
      </GlassPanel>
      <SystemsOverviewCarousel />
      <FolderGrid columns={3} />
      <ContactForm />
      <ChatTile />
    </div>
  );
}

export function PortfolioShell() {
  return (
    <>
      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
      <div className="block min-h-screen lg:hidden">
        <MobileLayout />
      </div>
    </>
  );
}
