export const site = {
  name: "Rahul Panchal",
  role: "Full-Stack Engineer",
  status: "Available for Work",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "rm5901960@gmail.com",
  location: "Ahmedabad, Gujarat",
  github: "https://github.com/rahulpanchal0106",
  linkedin: "https://www.linkedin.com/in/rahul-panchal-05610824a",
  twitter: "https://x.com/rahulpanchal0106",
  site: "https://rahulpanchal.dev",
} as const;

export type SkillGroup = {
  label: string;
  short: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Frontend",
    short: "FE",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "WebGPU"],
  },
  {
    label: "Backend",
    short: "BE",
    items: ["Node.js", "Express", "MongoDB", "WebSockets"],
  },
  {
    label: "Systems",
    short: "SYS",
    items: ["AWS Lambda", "S3", "SQS", "Nginx", "GitLab CI", "PM2"],
  },
];
