import {
  Compass,
  Map as MapIcon,
  Workflow,
  LineChart,
  Users,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const CAL_URL = "https://cal.com/angus-ai-hello";
export const CONTACT_EMAIL = "angus.ai.hello@gmail.com";

export const hero = {
  eyebrow: "AI strategy and implementation",
  title: "Practical AI for businesses that want results, not hype.",
  subtitle:
    "Independent guidance to identify where AI earns its keep, implement it cleanly, and measure the return. No jargon, no overreach.",
  primaryCta: "Book a call",
  secondaryCta: "What we do",
};

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const services: Service[] = [
  {
    icon: Compass,
    title: "AI assessment",
    description:
      "We map your operations and identify where AI delivers measurable value - and where it does not.",
  },
  {
    icon: MapIcon,
    title: "Implementation strategy",
    description:
      "A clear roadmap covering tooling, sequencing, team training, and risk - sized to your business.",
  },
  {
    icon: Workflow,
    title: "Technical integration",
    description:
      "We embed AI into your existing systems and workflows with minimal disruption and full handover.",
  },
  {
    icon: LineChart,
    title: "Performance optimisation",
    description:
      "Ongoing tuning so the systems we deliver get better with use, not worse.",
  },
  {
    icon: Users,
    title: "Team training",
    description:
      "Pragmatic upskilling for the people who will use these tools every day - not vendor demos.",
  },
  {
    icon: Sparkles,
    title: "Innovation consulting",
    description:
      "An honest read on emerging AI capability and how it applies to your sector right now.",
  },
];

export const approaches = [
  {
    title: "Discover",
    description:
      "We start with your operations, constraints, and goals - then identify where AI creates real value.",
  },
  {
    title: "Design",
    description:
      "A focused plan aligned with your timeline and budget. No platforms before problems.",
  },
  {
    title: "Deploy",
    description:
      "We execute the rollout with care, keeping disruption low and the team across what is changing.",
  },
  {
    title: "Optimise",
    description:
      "Continuous refinement using real performance data and your team's feedback loop.",
  },
];

export const ctaSection = {
  eyebrow: "Get started",
  title: "Ready to put AI to work?",
  subtitle:
    "Book a short call. We will tell you honestly whether AI is the right move - and if it is, what shape it should take.",
  buttonLabel: "Book a call",
};
