export const site = {
  name: "Sugam Kashyap",
  role: "Full Stack Developer & AI Systems Engineer",
  tagline: "Building production-grade agentic AI platforms and LLM-integrated web systems",
  email: "sugamkashyap1@gmail.com",
  location: "Ludhiana, Punjab, India",
  socials: [
    { label: "GitHub", href: "https://github.com/SugamKashyap05" },
    { label: "LinkedIn", href: "https://linkedin.com/in/sugam-kashyap" },
    { label: "Email", href: "mailto:sugamkashyap1@gmail.com" },
  ],
} as const;

export type ProjectStatus = "Live" | "In Development" | "Capstone";

export type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  subtitle: string;
  description: string;
  tags: readonly string[];
  year: string;
};

export const projects = [
  {
    id: "01",
    title: "LivePulse",
    status: "Live",
    subtitle: "AI news aggregator with a multi-agent editorial pipeline",
    description:
      "Production-deployed aggregator running a Gather → Synthesize → Verify → Publish editorial pipeline of cooperating agents. Migrated inference from local Ollama to NVIDIA NIM via a provider abstraction; closed 20 security vulnerabilities through red team/blue team cycles covering the OWASP Top 10; real-time streaming AI chat on a full GitHub Actions + Vercel CI/CD pipeline.",
    tags: ["Next.js", "NestJS", "PostgreSQL", "NVIDIA NIM", "GitHub Actions"],
    year: "2025",
  },
  {
    id: "02",
    title: "RawClaw",
    status: "In Development",
    subtitle: "Local-first multi-agent desktop platform",
    description:
      "Multi-operator research platform in a Turborepo monorepo with a Tauri native shell — ChromaDB vector memory, WebSocket + SSE streaming, and VRAM-aware scheduling for local inference on consumer GPUs.",
    tags: ["Turborepo", "NestJS", "FastAPI", "Tauri", "ChromaDB", "Ollama"],
    year: "2025",
  },
  {
    id: "03",
    title: "LiveTV",
    status: "Live",
    subtitle: "Multi-source IPTV aggregation platform",
    description:
      "Signature-based channel deduplication and a custom reliability scoring engine tracking view counts and broken-stream reports; HLS.js playback with bounded retry, automatic source failover, Prisma-backed favourites, history, and per-channel stats.",
    tags: ["Next.js", "hls.js", "Prisma", "PostgreSQL"],
    year: "2024",
  },
  {
    id: "04",
    title: "SafeGuard",
    status: "Capstone",
    subtitle: "AI-powered parental control platform",
    description:
      "Full-stack platform with content filtering, screen-time management, and gamification; Supabase real-time auth plus content moderation that detects and blocks inappropriate material.",
    tags: ["React", "Node.js", "Supabase"],
    year: "2024",
  },
] satisfies readonly Project[];

export const nowBuilding = {
  name: "RawClaw",
  note: "Local-first multi-agent desktop platform",
} as const;

export const skillGauges = [
  { label: "TypeScript · React/Next", value: 90 },
  { label: "Node · NestJS · FastAPI", value: 86 },
  { label: "Agentic AI · Multi-Agent", value: 88 },
  { label: "RAG · LLM Integration", value: 85 },
  { label: "Databases · Prisma ORM", value: 80 },
  { label: "DevOps · Security Testing", value: 78 },
] as const;

export const logAlts = {
  about: "2,400 M",
  projects: ["9,600 M", "17,500 M", "31,200 M", "46,800 M"],
  systems: "68,000 M",
  contact: "97,500 M",
} as const;

export const certifications = [
  "Agile Project Management — CU Boulder",
  "Project Planning & Execution — CU Boulder",
  "Dynamic Programming & Greedy Algorithms — CU Boulder",
  "Algorithms on Strings — UC San Diego",
  "Approximation Algorithms & LP — CU Boulder",
  "Python & Django Backend Specialization",
  "Intro to Software Testing",
] as const;
