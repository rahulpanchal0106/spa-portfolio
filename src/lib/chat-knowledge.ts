import { createHash } from "node:crypto";
import { experience, resume } from "@/lib/profile";
import { projects } from "@/lib/projects";
import { site, skillGroups } from "@/lib/site";

export function normalizeQuestion(raw: string) {
  return raw.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 280);
}

export function questionHash(normalized: string) {
  return createHash("sha256").update(normalized).digest("hex").slice(0, 32);
}

export function resumeCorpus() {
  const skills = skillGroups.map((group) => `${group.label}: ${group.items.join(", ")}`).join("\n");
  const jobs = experience
    .map((job) => {
      const points = job.points.map((point) => `- ${point}`).join("\n");
      return `${job.role} at ${job.company} (${job.period}, ${job.location})\n${job.summary}\n${points}`;
    })
    .join("\n\n");
  const work = projects
    .map((project) => {
      const live = project.live ? ` Link: ${project.live}` : "";
      const metrics = project.architecture.metrics.join("; ");
      return `${project.name} (${project.shortName}): ${project.subtitle}. ${project.summary} Tags: ${project.tags.join(", ")}. Challenge: ${project.architecture.challenge} Approach: ${project.architecture.approach} Metrics: ${metrics}.${live}`;
    })
    .join("\n\n");

  return `Name: ${site.name}
Role: ${site.role}
Status: ${site.status}
Location: ${site.location}
Email: ${site.email}
Site: ${site.site}
GitHub: ${site.github}
LinkedIn: ${site.linkedin}

Headline: ${resume.headline}
${resume.blurb}
Highlights: ${resume.highlights.join("; ")}

Looking for
${resume.lookingFor}

Skills
${skills}

Experience
${jobs}

Projects
${work}`;
}

export function chatSystemPrompt() {
  return `You are a guide on ${site.name}'s personal portfolio. Answer only from the dossier below. Refer to him as Rahul.
Give a complete answer in 2–4 short sentences: what it is, what he built, and one concrete metric if the dossier has one. Finish every sentence.
Use the "Looking for" section only when they ask about roles, availability, what he wants next, or how to hire him. Do not paste it into unrelated project answers.
If the question is not about his work, skills, projects, location, or how to reach him, refuse and tell them to use the Mail window on this site.
Do not write code, essays, or homework. Do not invent employers, dates, or metrics.

DOSSIER:
${resumeCorpus()}`;
}
