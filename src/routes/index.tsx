import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, FileText, Lightbulb, MessagesSquare, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ExampleTag } from "@/components/kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Career Draft — Your experience counts. Learn how to show it." },
      {
        name: "description",
        content:
          "Career Draft helps college students identify skills, build evidence, and prepare a pitch for internship applications and career fairs.",
      },
      { property: "og:title", content: "Career Draft — Your experience counts." },
      {
        property: "og:description",
        content:
          "Turn freelance, small business, class project, and volunteer experience into internship-ready résumé bullets and case studies.",
      },
    ],
  }),
  component: Index,
});

const STEPS = [
  {
    icon: Sparkles,
    step: "Step 01",
    title: "Identify your skills",
    body: "Describe what you actually did. The skills builder names the transferable skills hiding in that work.",
  },
  {
    icon: FileText,
    step: "Step 02",
    title: "Build evidence",
    body: "Turn one experience into résumé bullets and a short case study a recruiter can read in a minute.",
  },
  {
    icon: MessagesSquare,
    step: "Step 03",
    title: "Prepare your pitch",
    body: "Draft a 30-second introduction, questions to ask, and the follow-up email before the fair starts.",
  },
];

const TOOLS = [
  {
    to: "/builder" as const,
    icon: Sparkles,
    name: "Experience-to-skills builder",
    body: "Enter an experience and get editable résumé bullets plus a transferable skills list.",
  },
  {
    to: "/case-studies" as const,
    icon: FileText,
    name: "Project case study builder",
    body: "Problem, role, process, result — with a live preview you can save and copy.",
  },
  {
    to: "/career-fair" as const,
    icon: ClipboardList,
    name: "Career fair prep",
    body: "Intro builder, a before/during/after checklist, recruiter questions, and a follow-up email.",
  },
  {
    to: "/library" as const,
    icon: Lightbulb,
    name: "Learning library",
    body: "Four short lessons with an example and one exercise each, with progress tracking.",
  },
];

function Index() {
  return (
    <div>
      <section className="hero-glow border-b border-border">
        <div className="mx-auto max-w-4xl px-5 pt-20 pb-20 text-center sm:pt-28 sm:pb-24">
          <span className="eyebrow-label inline-block rounded-full border border-border bg-card px-4 py-1.5">
            For students with nontraditional experience
          </span>
          <h1 className="mt-7 text-5xl leading-[1.02] sm:text-7xl">
            Your experience counts.
            <span className="block italic">Learn how to show it.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg font-light text-muted-foreground">
            You ran a side business, freelanced, led a club, or shipped a class project. Career
            Draft helps you translate that into the language internship recruiters read for.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="hero" size="xl">
              <Link to="/builder">
                Start building <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="text-xs tracking-widest uppercase">
              <Link to="/library">See the lessons</Link>
            </Button>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            No account needed. Your drafts stay in your browser.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16" aria-labelledby="how-it-works">
        <p className="eyebrow-label">How this works</p>
        <h2 id="how-it-works" className="mt-3 text-3xl sm:text-4xl">
          Three steps, in order
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Each one produces something you can paste into an application.
        </p>
        <div className="mt-10 grid gap-0 border-t border-l border-border md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="border-r border-b border-border bg-card/40 p-10 transition-colors duration-500 hover:bg-secondary"
            >
              <span className="eyebrow-label block">{step.step}</span>
              <h3 className="mt-6 text-2xl italic">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50">
        <div className="mx-auto max-w-6xl px-5 py-16" aria-labelledby="tools">
          <p className="eyebrow-label">The tools</p>
          <h2 id="tools" className="mt-3 text-3xl sm:text-4xl">
            Four ways to build your case
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {TOOLS.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="surface-card group flex flex-col p-7 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
              >
                <span className="grid size-10 place-items-center rounded-full border border-border bg-accent text-accent-foreground">
                  <tool.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-xl">{tool.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.body}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium tracking-widest text-cobalt uppercase">
                  Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="surface-card p-6 sm:p-8">
          <ExampleTag>sample output, not a personal accomplishment</ExampleTag>
          <p className="mt-4 font-display text-lg">From a one-line description…</p>
          <p className="mt-1 text-sm text-muted-foreground">
            “I took custom cake orders over Instagram and planned my bake days around classes.”
          </p>
          <p className="mt-5 font-display text-lg">…to a résumé bullet you can edit:</p>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="rounded-lg bg-secondary px-3 py-2">
              Launched and operated a weekend baking business by taking custom orders over Instagram.
            </li>
            <li className="rounded-lg bg-secondary px-3 py-2">
              Used Instagram, Google Sheets, Square to take custom orders over Instagram.
            </li>
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Bullets are assembled only from what you type. Numbers, tools, and employers are never
            invented — if a metric is missing, the app suggests what you could measure instead.
          </p>
        </div>
      </section>
    </div>
  );
}
