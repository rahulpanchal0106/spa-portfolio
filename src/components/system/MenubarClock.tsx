"use client";

import { useEffect, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatMenubarClock(date: Date) {
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/** macOS menubar-style live clock: `Wed 9 Sep 13:22:05` */
export function MenubarClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const label = now ? formatMenubarClock(now) : "— — — —:—:—";

  return (
    <time
      dateTime={now?.toISOString()}
      title={now?.toLocaleString()}
      className="menubar-clock hidden select-none text-[12px] tracking-tight text-white/90 tabular-nums sm:inline"
      aria-label={now ? `Current time ${label}` : "Clock"}
    >
      {label}
    </time>
  );
}
