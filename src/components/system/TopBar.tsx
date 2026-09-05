import { site, skillGroups } from "@/lib/site";

export function TopBar() {
  return (
    <div className="mac-menubar h-full w-full">
      <span className="text-[13px] font-semibold tracking-tight text-white">
        {site.name}
      </span>
      <span className="hidden text-[13px] text-white/70 sm:inline">Finder</span>
      <span className="hidden text-[13px] text-white/55 md:inline">
        {site.role}
      </span>
      <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] text-white/80">
        <span className="h-1.5 w-1.5 rounded-full bg-[#30d158] shadow-[0_0_8px_#30d158]" />
        {site.status}
      </span>
      <div className="no-scrollbar hidden max-w-[46%] items-center gap-2 overflow-x-auto lg:flex">
        <iframe
          src="https://selldocs.vercel.app/embed/6a9b8a259ec8ebbef01552d5"
          width="420"
          height="620"
          style="border:none;border-radius:12px;max-width:100%;"
          allow="payment"
          loading="lazy"
        ></iframe>
        {skillGroups.map((group) => (
          <span
            key={group.label}
            className="shrink-0 text-[11px] text-white/45"
          >
            {group.short}
            <span className="ml-1 text-white/70">
              {group.items.slice(0, 2).join(" · ")}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkillsMarquee() {
  const loop = [...skillGroups, ...skillGroups];
  return (
    <div className="marquee-mask overflow-hidden">
      <div className="marquee-track flex w-max items-center">
        {loop.map((group, i) => (
          <span key={`${group.label}-${i}`} className="flex items-center">
            <span className="ml-3 text-[11px] font-semibold tracking-wide text-white/45 uppercase">
              {group.label}
            </span>
            {group.items.map((skill) => (
              <span
                key={`${skill}-${i}`}
                className="px-2 py-1 text-xs whitespace-nowrap text-white/70"
              >
                {skill}
              </span>
            ))}
            <span className="mx-1 text-white/20">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
