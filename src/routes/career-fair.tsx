import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { CopyButton, Field, PageHeader, Panel, TextArea, TextInput } from "@/components/kit";
import { useLocalStore } from "@/lib/local-store";

export const Route = createFileRoute("/career-fair")({
  head: () => ({
    meta: [
      { title: "Career fair prep — NextStep Lab" },
      {
        name: "description",
        content: "Draft a 30-second intro, plan questions for recruiters, and keep a fair-day checklist.",
      },
      { property: "og:title", content: "Career fair prep — NextStep Lab" },
      {
        property: "og:description",
        content: "Build your elevator pitch and recruiter questions before the fair.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CareerFairPage,
});

type Pitch = { name: string; program: string; interest: string; strength: string; goal: string };

const CHECKLIST = [
  "Research 3–5 employers attending",
  "Print or share a current résumé",
  "Practice your intro out loud twice",
  "Prepare two questions per employer",
  "Plan a professional, comfortable outfit",
  "Send follow-up notes within 48 hours",
];

function CareerFairPage() {
  const pitch = useLocalStore<Pitch>("nsl-pitch", {
    name: "",
    program: "",
    interest: "",
    strength: "",
    goal: "",
  });
  const checks = useLocalStore<Record<string, boolean>>("nsl-fair-checks", {});
  const p = pitch.value;
  const set = (k: keyof Pitch) => (e: { target: { value: string } }) =>
    pitch.setValue({ ...p, [k]: e.target.value });

  const script = useMemo(() => {
    if (!p.name.trim()) return "";
    const parts = [`Hi, I'm ${p.name.trim()}`];
    if (p.program.trim()) parts[0] += `, studying ${p.program.trim()}`;
    parts[0] += ".";
    if (p.interest.trim()) parts.push(`I'm interested in ${p.interest.trim()}.`);
    if (p.strength.trim()) parts.push(`Recently I ${p.strength.trim()}.`);
    if (p.goal.trim()) parts.push(`I'd love to learn more about ${p.goal.trim()}.`);
    return parts.join(" ");
  }, [p]);

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Career fair prep"
        title="Walk up ready"
        description="Write a short intro, then check off what to do before fair day. Everything stays in this browser."
      />
      <div className="mx-auto grid max-w-5xl gap-6 px-5 lg:grid-cols-2">
        <Panel title="Your 30-second intro">
          <div className="space-y-4">
            <Field label="Name" htmlFor="name">
              <TextInput id="name" value={p.name} onChange={set("name")} />
            </Field>
            <Field label="Program or major" htmlFor="program">
              <TextInput id="program" value={p.program} onChange={set("program")} />
            </Field>
            <Field label="Area you're interested in" htmlFor="interest">
              <TextInput id="interest" value={p.interest} onChange={set("interest")} />
            </Field>
            <Field label="Something you did recently" htmlFor="strength" hint="e.g. led a class project on…">
              <TextArea id="strength" rows={2} value={p.strength} onChange={set("strength")} />
            </Field>
            <Field label="What you want to learn from them" htmlFor="goal">
              <TextInput id="goal" value={p.goal} onChange={set("goal")} />
            </Field>
          </div>
        </Panel>
        <div className="space-y-6">
          <Panel title="Preview" action={<CopyButton text={script} disabled={!script} />}>
            <p className="text-sm leading-relaxed">
              {script || "Add your name to start your intro."}
            </p>
          </Panel>
          <Panel title="Fair-day checklist">
            <ul className="space-y-2">
              {CHECKLIST.map((item) => (
                <li key={item}>
                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(checks.value[item])}
                      onChange={(e) => checks.setValue({ ...checks.value, [item]: e.target.checked })}
                    />
                    {item}
                  </label>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
