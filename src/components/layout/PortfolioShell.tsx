"use client";

import { ChatTile } from "@/components/chat/ChatTile";
import { ContactForm } from "@/components/contact/ContactForm";
import { AppPane } from "@/components/desktop/AppPane";
import { DesktopHome } from "@/components/desktop/DesktopHome";
import { DesktopModeProvider, useDesktopMode } from "@/components/desktop/DesktopModeProvider";
import { SplitPane } from "@/components/desktop/SplitPane";
import { FolderGrid } from "@/components/folders/FolderGrid";
import { MobileHome } from "@/components/mobile/MobileHome";
import { SystemsOverview } from "@/components/spotlight/SystemsOverview";
import { BootGate } from "@/components/system/BootGate";
import { TopBar } from "@/components/system/TopBar";
import { cn } from "@/lib/cn";

function DesktopWorkspace() {
  const { isHome, isSolo, isCluster, goHome } = useDesktopMode();

  return (
    <div className="relative flex h-screen flex-col">
      <div className="relative z-50 h-8 shrink-0">
        <TopBar />
      </div>

      <div className="relative min-h-0 flex-1">
        {isHome ? <DesktopHome /> : null}

        {isSolo ? (
          <button
            type="button"
            className="solo-backdrop absolute inset-0 z-30 cursor-default"
            aria-label="Back to Home"
            onClick={goHome}
          />
        ) : null}

        <div
          className={cn(
            "desktop-windows absolute inset-0 p-2",
            isHome && "desktop-windows--home",
            isCluster && "desktop-windows--active",
            isSolo && "desktop-windows--solo",
          )}
          aria-hidden={isHome}
        >
          <SplitPane
            axis="horizontal"
            defaultSize={48}
            minFirst={32}
            minSecond={36}
            storageKey="split-finder"
            className="h-full gap-0"
          >
            <AppPane app="finder">
              <FolderGrid className="h-full" columns={4} />
            </AppPane>
            <SplitPane
              axis="vertical"
              defaultSize={58}
              minFirst={32}
              minSecond={28}
              storageKey="split-systems"
              className="h-full"
            >
              <AppPane app="systems">
                <SystemsOverview className="h-full" />
              </AppPane>
              <SplitPane
                axis="horizontal"
                defaultSize={50}
                minFirst={34}
                minSecond={34}
                storageKey="split-ask-mail"
                className="h-full"
              >
                <AppPane app="ask" className="min-h-0">
                  <ChatTile className="h-full min-h-0" />
                </AppPane>
                <AppPane app="mail">
                  <ContactForm className="h-full" />
                </AppPane>
              </SplitPane>
            </SplitPane>
          </SplitPane>
        </div>
      </div>
    </div>
  );
}

export function DesktopLayout() {
  return (
    <DesktopModeProvider>
      <DesktopWorkspace />
    </DesktopModeProvider>
  );
}

export function MobileLayout() {
  return <MobileHome />;
}

export function PortfolioShell() {
  return (
    <BootGate>
      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
      <div className="block lg:hidden">
        <MobileLayout />
      </div>
    </BootGate>
  );
}
