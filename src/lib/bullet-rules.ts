/**
 * Rule-based résumé bullet drafting. No content is invented: every bullet is
 * assembled only from words the user typed. If a metric is missing we omit it
 * and return measurement suggestions instead.
 */

export type ExperienceCategory =
  | "small-business"
  | "freelance"
  | "leadership"
  | "volunteering"
  | "class-project"
  | "employment";

export const CATEGORIES: { value: ExperienceCategory; label: string; hint: string }[] = [
  {
    value: "small-business",
    label: "Small business / side business",
    hint: "You ran something of your own, even informally.",
  },
  { value: "freelance", label: "Freelance or contract work", hint: "Paid work for clients." },
  { value: "leadership", label: "Leadership or student org", hint: "You organized people." },
  { value: "volunteering", label: "Volunteering", hint: "Unpaid community work." },
  { value: "class-project", label: "Class project", hint: "Coursework with a real deliverable." },
  { value: "employment", label: "Employment", hint: "A job with a manager and shifts." },
];

export type ExperienceInput = {
  title: string;
  category: ExperienceCategory;
  actions: string;
  tools: string;
  outcome: string;
};

const LEAD_VERBS: Record<ExperienceCategory, string[]> = {
  "small-business": ["Launched and operated", "Managed", "Built"],
  freelance: ["Delivered", "Produced", "Coordinated"],
  leadership: ["Led", "Organized", "Coordinated"],
  volunteering: ["Supported", "Organized", "Assisted with"],
  "class-project": ["Designed", "Researched and built", "Analyzed"],
  employment: ["Handled", "Operated", "Supported"],
};

const SKILL_RULES: { match: RegExp; skills: string[] }[] = [
  { match: /\b(budget|price|pricing|invoic|cost|profit|revenue|sales|sold)\b/i, skills: ["Budgeting & pricing", "Revenue ownership"] },
  { match: /\b(customer|client|guest|patient|member)\b/i, skills: ["Client communication", "Service mindset"] },
  { match: /\b(schedul|plan|deadline|timeline|calendar)\b/i, skills: ["Planning & scheduling", "Time management"] },
  { match: /\b(team|volunteer|train|mentor|onboard|staff)\b/i, skills: ["Team coordination", "Training others"] },
  { match: /\b(data|spreadsheet|excel|sheets|analy|report|dashboard|sql)\b/i, skills: ["Data analysis", "Reporting"] },
  { match: /\b(design|figma|canva|brand|logo|layout|photo|video)\b/i, skills: ["Visual design", "Brand consistency"] },
  { match: /\b(code|coding|python|javascript|react|app|website|software|github)\b/i, skills: ["Technical problem solving", "Software development"] },
  { match: /\b(social|instagram|tiktok|marketing|campaign|content|email)\b/i, skills: ["Marketing & content", "Audience growth"] },
  { match: /\b(inventory|order|supply|vendor|logistic|ship)\b/i, skills: ["Operations & logistics", "Vendor coordination"] },
  { match: /\b(research|interview|survey|test|usability)\b/i, skills: ["Research methods", "Synthesizing findings"] },
  { match: /\b(write|writing|document|proposal|present|presentation|pitch)\b/i, skills: ["Written communication", "Presenting"] },
  { match: /\b(fix|troubleshoot|problem|issue|resolve|complaint)\b/i, skills: ["Troubleshooting", "Conflict resolution"] },
];

const BASE_SKILLS: Record<ExperienceCategory, string[]> = {
  "small-business": ["Ownership & initiative", "Customer focus"],
  freelance: ["Client management", "Self-direction"],
  leadership: ["Leadership", "Collaboration"],
  volunteering: ["Community engagement", "Reliability"],
  "class-project": ["Structured problem solving", "Collaboration"],
  employment: ["Reliability", "Following process"],
};

const METRIC_PATTERN = /\d|\bpercent\b|%|\$/;

function clean(text: string) {
  return text.trim().replace(/\s+/g, " ").replace(/[.;]+$/, "");
}

function splitList(text: string) {
  return text
    .split(/[,;\n]|\band\b/gi)
    .map((part) => clean(part))
    .filter(Boolean);
}

function lowerFirst(text: string) {
  if (!text) return text;
  // Keep acronyms and proper-ish tokens intact.
  if (text.slice(0, 3) === text.slice(0, 3).toUpperCase() && text.length > 2) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

export function transferableSkills(input: ExperienceInput) {
  const haystack = `${input.title} ${input.actions} ${input.tools} ${input.outcome}`;
  const found = new Set<string>(BASE_SKILLS[input.category]);
  for (const rule of SKILL_RULES) {
    if (rule.match.test(haystack)) rule.skills.forEach((s) => found.add(s));
  }
  return Array.from(found).slice(0, 8);
}

export function measurementSuggestions(input: ExperienceInput) {
  const base = [
    "Number of people served, customers, or teammates involved",
    "How often it happened (per week, per event, per semester)",
    "Time span you did it (months, semesters)",
  ];
  const extra: Record<ExperienceCategory, string> = {
    "small-business": "Orders fulfilled, repeat customers, or average order size",
    freelance: "Projects delivered and typical turnaround time",
    leadership: "Team size and attendance or sign-ups",
    volunteering: "Hours contributed and number of events",
    "class-project": "Users tested with, dataset size, or grade/score outcome",
    employment: "Shifts covered, transactions handled, or accuracy rate",
  };
  return [extra[input.category], ...base];
}

export function generateBullets(input: ExperienceInput): string[] {
  const title = clean(input.title);
  const actions = splitList(input.actions);
  const tools = splitList(input.tools);
  const outcome = clean(input.outcome);
  const verbs = LEAD_VERBS[input.category];
  const bullets: string[] = [];

  if (actions.length > 0) {
    const first = lowerFirst(actions[0]);
    bullets.push(title ? `${verbs[0]} ${title} by ${first}.` : `${verbs[0]} ${first}.`);
  } else if (title) {
    bullets.push(`${verbs[0]} ${title}.`);
  }

  if (actions.length > 1) {
    const rest = actions.slice(1, 3).map(lowerFirst);
    bullets.push(`${verbs[1]} ${rest.join(" and ")}.`);
  }

  if (tools.length > 0) {
    const toolLine = tools.slice(0, 4).join(", ");
    const anchor = actions[0] ? lowerFirst(actions[0]) : title ? lowerFirst(title) : "the work";
    bullets.push(`Used ${toolLine} to ${anchor}.`);
  }

  if (outcome && METRIC_PATTERN.test(outcome)) {
    bullets.push(`Result: ${lowerFirst(outcome)}.`);
  } else if (outcome) {
    bullets.push(`Outcome: ${lowerFirst(outcome)}.`);
  }

  return bullets.slice(0, 3);
}

export function hasMetric(outcome: string) {
  return METRIC_PATTERN.test(outcome);
}

export const EXAMPLE_EXPERIENCE: ExperienceInput = {
  title: "a weekend baking business",
  category: "small-business",
  actions:
    "taking custom orders over Instagram, planning weekly ingredient purchases, scheduling bake days around classes",
  tools: "Instagram, Google Sheets, Square",
  outcome: "filled about 8 custom orders per month for two semesters",
};
