import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  className?: string;
  children: ReactNode;
  sidebar?: ReactNode;
  toolbar?: ReactNode;
};

export function MacWindow({ title, className, children, sidebar, toolbar }: Props) {
  return (
    <div className={cn("mac-window flex min-h-0 flex-col", className)}>
      <div className="mac-titlebar">
        <div className="mac-traffic" aria-hidden>
          <span className="mac-dot close" />
          <span className="mac-dot min" />
          <span className="mac-dot max" />
        </div>
        <p className="mac-title">{title}</p>
      </div>
      {toolbar ? <div className="mac-toolbar">{toolbar}</div> : null}
      <div className="flex min-h-0 flex-1">
        {sidebar ? <aside className="mac-sidebar">{sidebar}</aside> : null}
        <div className="mac-body flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
