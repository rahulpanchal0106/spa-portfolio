import { menubarSkills } from "@/lib/skill-icons";
import { site, skillGroups } from "@/lib/site";

export function TopBar() {
  return (
    <div className="mac-menubar h-full w-full">
      <span className="text-[13px] font-semibold tracking-tight text-white">{site.name}</span>
      <span className="hidden text-[13px] text-white/70 sm:inline">Finder</span>
      <span className="hidden text-[13px] text-white/55 md:inline">{site.role}</span>
      <div className="ml-auto hidden items-center gap-1.5 lg:flex" aria-label="Core skills">
        {menubarSkills.map((skill) => (
          <span
            key={skill.id}
            title={skill.name}
            className="grid h-6 w-6 place-items-center rounded-md text-white/55 transition hover:bg-white/10 hover:text-white"
          >
            {skill.icon}
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
              <span key={`${skill}-${i}`} className="px-2 py-1 text-xs whitespace-nowrap text-white/70">
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

export function SkillsIconRow() {
  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-label="Core skills">
      {menubarSkills.map((skill) => (
        <span
          key={skill.id}
          title={skill.name}
          className="grid h-7 w-7 place-items-center rounded-md bg-white/8 text-white/70"
        >
          {skill.icon}
        </span>
      ))}
    </div>
  );
}
