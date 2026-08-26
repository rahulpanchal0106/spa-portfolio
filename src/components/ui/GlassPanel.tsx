import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  children: ReactNode;
};

export function GlassPanel({ className, children }: Props) {
  return (
    <div
      className={cn(
        "glass min-h-0 overflow-hidden rounded-[10px] border-white/16 bg-[#242426]/80 backdrop-blur-3xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
