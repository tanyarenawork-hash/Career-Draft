import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, Panel } from "@/components/kit";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Learning library — NextStep Lab" },
      {
        name: "description",
        content: "Short guides on résumé bullets, portfolios, networking, and interviews.",
      },
      { property: "og:title", content: "Learning library — NextStep Lab" },
      {
        property: "og:description",
        content: "Bite-sized career guides for students building their first portfolio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LibraryPage,
});

const GUIDES = [
  {
    title: "Writing strong bullets",
    tips: ["Start with an action verb", "Name the tool or method", "End with a result or number"],
  },
  {
    title: "Building a portfolio",
    tips: ["Pick 2–3 of your best projects", "Show your process, not just the result", "Explain your role clearly"],
  },
  {
    title: "Networking basics",
    tips: ["Ask questions before asking for jobs", "Follow up within two days", "Keep notes on who you met"],
  },
  {
    title: "Interview prep",
    tips: ["Use the situation-task-action-result format", "Prepare three stories", "Have two questions ready"],
  },
];

function LibraryPage() {
  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Learning library"
        title="Quick guides for your next step"
        description="Short, practical tips you can use today."
      />
      <div className="mx-auto grid max-w-5xl gap-6 px-5 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <Panel key={g.title} title={g.title}>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {g.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </div>
  );
}
