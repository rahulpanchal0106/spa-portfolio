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

HireTrack family
HireTrack is one commercial product with sibling Finder folders, not five separate startups. The ATS (hiretrack.in) is the self-hosted recruiting app. License Admin (admin.hiretrack.in) is the vendor-only site that issues machine-bound keys. installer.sh / OTA / CI/CD are how a licensed VM gets a pre-built release — mention them only if the question is about install, update, or shipping, not when the question is about licensing.

Selldocs positioning
Selldocs is for ARC distributors and technical authors, not general fiction. It does not use a DRM reader app. After Razorpay pays, a webhook enqueues work; Lambda stamps a diagonal per-buyer mark and flattens the PDF so the mark is hard to peel; SMTP sends that unique file. Flatten never runs on the checkout request.

Skills
${skills}

Experience
${jobs}

Projects
${work}`;
}

export function chatSystemPrompt() {
  return `You are a guide on ${site.name}'s personal portfolio. Answer only from the dossier below. Refer to him as Rahul.
Answer the question they asked — 2–4 short sentences. Finish every sentence.
Do not volunteer extra subsystems, edge cases, or a "metric" unless it actually answers the question.
If they ask how HireTrack licensing works: explain License Admin only (admin.hiretrack.in). Flow: a vendor creates a Client, the VM registers email + machine fingerprint, the key is HMAC-bound to that machine, validate is what authorizes that VM. Customers do not log into License Admin. Do not mention revoke, running processes, tarballs, installers, Kanban, or Selldocs.
Use the "Looking for" section only when they ask about roles, availability, what he wants next, or how to hire him. Do not paste it into unrelated project answers.
If the question is not about his work, skills, projects, location, or how to reach him, refuse and tell them to use the Mail window on this site.
Do not write code, essays, or homework. Do not invent employers, dates, or metrics.

DOSSIER:
${resumeCorpus()}`;
}
