import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, Panel } from "@/components/kit";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Career Draft" },
      {
        name: "description",
        content: "Why Career Draft exists and how it helps students turn experience into career-ready materials.",
      },
      { property: "og:title", content: "About — Career Draft" },
      {
        property: "og:description",
        content: "Free tools that help students describe their experience with confidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="About"
        title="Helping students tell their story"
        description="Career Draft turns everyday experience into clear résumé bullets, case studies, and career fair intros."
      />
      <div className="mx-auto max-w-3xl space-y-6 px-5">
        <Panel title="How it works">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Every tool runs in your browser. Your drafts are saved on this device only — nothing is
            sent anywhere, and there's no account to create.
          </p>
        </Panel>
        <Panel title="Who it's for">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Students and early-career job seekers who have real experience but aren't sure how to
            describe it.
          </p>
        </Panel>
      </div>
    </div>
  );
}
