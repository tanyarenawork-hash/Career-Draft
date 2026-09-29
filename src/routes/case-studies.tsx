import { createFileRoute } from "@tanstack/react-router";
import { FilePlus2, Pencil, Save, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

import {
  CopyButton,
  EmptyState,
  ExampleTag,
  Field,
  PageHeader,
  Panel,
  TextArea,
  TextInput,
} from "@/components/kit";
import { Button } from "@/components/ui/button";
import { newId, useLocalStore } from "@/lib/local-store";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: "Project case study builder — NextStep Lab" },
      {
        name: "description",
        content:
          "Write a concise portfolio case study: problem, audience, role, process, tools, solution, result, and what you'd improve.",
      },
      { property: "og:title", content: "Project case study builder — NextStep Lab" },
      {
        property: "og:description",
        content: "A live-preview case study builder with save, edit, delete, and copy.",
      },
    ],
  }),
  component: CaseStudiesPage,
});

type CaseStudy = {
  id: string;
  title: string;
  problem: string;
  audience: string;
  role: string;
  process: string;
  tools: string;
  solution: string;
  result: string;
  improve: string;
  updatedAt: number;
};

const EMPTY: Omit<CaseStudy, "id" | "updatedAt"> = {
  title: "",
  problem: "",
  audience: "",
  role: "",
  process: "",
  tools: "",
  solution: "",
  result: "",
  improve: "",
};

const EXAMPLE: Omit<CaseStudy, "id" | "updatedAt"> = {
  title: "Campus bike-share signup redesign (class project)",
  problem:
    "Students gave up partway through the campus bike-share signup form and support got repeat questions about the deposit.",
  audience: "First-year students signing up for the campus bike share",
  role: "I led research and built the prototype with two teammates",
  process:
    "Reviewed the existing form, interviewed 6 students, mapped where they hesitated, prototyped a shorter two-step flow, then tested it with 5 more students",
  tools: "Figma, Google Forms, Notion",
  solution:
    "A two-step signup that asks for ID details first and explains the deposit in plain language before payment",
  result: "All 5 test participants finished the prototype signup without asking a question",
  improve:
    "I would test on a phone with real payment steps instead of a prototype, and track completion over a full semester",
};

const FIELDS: { key: keyof typeof EMPTY; label: string; hint?: string; long?: boolean }[] = [
  { key: "title", label: "Project title" },
  { key: "problem", label: "Problem", hint: "What was broken, missing, or hard?", long: true },
  { key: "audience", label: "Audience", hint: "Who was it for?" },
  { key: "role", label: "My role", hint: "Be specific about what you personally did." },
  { key: "process", label: "Process", hint: "The steps you took, in order.", long: true },
  { key: "tools", label: "Tools" },
  { key: "solution", label: "Solution", long: true },
  { key: "result", label: "Result", hint: "Only real outcomes. Leave blank if you don't know." },
  { key: "improve", label: "What I would improve", long: true },
];

function renderText(cs: Omit<CaseStudy, "id" | "updatedAt">) {
  const lines: string[] = [];
  if (cs.title) lines.push(cs.title, "");
  const push = (label: string, value: string) => {
    if (value.trim()) lines.push(`${label}: ${value.trim()}`, "");
  };
  push("Problem", cs.problem);
  push("Audience", cs.audience);
  push("My role", cs.role);
  push("Process", cs.process);
  push("Tools", cs.tools);
  push("Solution", cs.solution);
  push("Result", cs.result);
  push("What I would improve", cs.improve);
  return lines.join("\n").trim();
}

function CaseStudiesPage() {
  const { value: saved, setValue: setSaved } = useLocalStore<CaseStudy[]>("nsl.cases.v1", []);
  const { value: form, setValue: setForm } = useLocalStore("nsl.caseform.v1", EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const preview = useMemo(() => renderText(form), [form]);
  const filled = Object.values(form).some((v) => v.trim().length > 0);

  function update(key: keyof typeof EMPTY, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function save() {
    if (form.title.trim().length < 3) {
      setError("Give the project a title before saving.");
      return;
    }
    if (form.problem.trim().length < 10) {
      setError("Describe the problem in at least a sentence.");
      return;
    }
    setError(null);
    if (editingId) {
      setSaved((list) =>
        list.map((c) => (c.id === editingId ? { ...c, ...form, updatedAt: Date.now() } : c)),
      );
      setEditingId(null);
    } else {
      setSaved((list) => [{ id: newId(), ...form, updatedAt: Date.now() }, ...list]);
    }
    setForm(EMPTY);
  }

  function edit(cs: CaseStudy) {
    const { id: _id, updatedAt: _updatedAt, ...rest } = cs;
    setForm(rest);
    setEditingId(cs.id);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Step 2"
        title="Project case study builder"
        description="One page a recruiter can skim in a minute: what the problem was, what you did, and what happened."
      />

      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-6 lg:grid-cols-2">
        <Panel
          title={editingId ? "Editing case study" : "New case study"}
          action={
            <div className="flex gap-2">
              <Button
                type="button"
                variant="soft"
                size="sm"
                onClick={() => {
                  setForm(EXAMPLE);
                  setEditingId(null);
                  setError(null);
                }}
              >
                Load example
              </Button>
              {(filled || editingId) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setForm(EMPTY);
                    setEditingId(null);
                    setError(null);
                  }}
                >
                  <X className="size-4" /> Reset
                </Button>
              )}
            </div>
          }
        >
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            {FIELDS.map((f) => (
              <Field
                key={f.key}
                label={f.label}
                htmlFor={`cs-${f.key}`}
                hint={f.hint}
                error={
                  (f.key === "title" && error?.includes("title")) ||
                  (f.key === "problem" && error?.includes("problem"))
                    ? error ?? undefined
                    : undefined
                }
              >
                {f.long ? (
                  <TextArea
                    id={`cs-${f.key}`}
                    value={form[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                  />
                ) : (
                  <TextInput
                    id={`cs-${f.key}`}
                    value={form[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                  />
                )}
              </Field>
            ))}

            <div className="flex flex-wrap gap-2 pt-1">
              <Button type="submit" variant="hero">
                {editingId ? <Save className="size-4" /> : <FilePlus2 className="size-4" />}
                {editingId ? "Save changes" : "Save case study"}
              </Button>
              <CopyButton text={preview} label="Copy preview" disabled={!filled} />
            </div>
          </form>
        </Panel>

        <div className="space-y-6">
          <Panel title="Live preview">
            {!filled ? (
              <EmptyState
                title="Nothing to preview yet"
                body="Start typing on the left, or load the labeled example to see the shape of a finished case study."
              />
            ) : (
              <article className="space-y-3">
                {form.title && <h3 className="text-xl">{form.title}</h3>}
                {FIELDS.filter((f) => f.key !== "title" && form[f.key].trim()).map((f) => (
                  <div key={f.key}>
                    <p className="text-xs font-semibold tracking-wide text-cobalt uppercase">
                      {f.label}
                    </p>
                    <p className="mt-1 text-sm whitespace-pre-line text-foreground/90">
                      {form[f.key]}
                    </p>
                  </div>
                ))}
              </article>
            )}
          </Panel>

          <Panel title="Saved case studies" description="Stored in this browser only.">
            {saved.length === 0 ? (
              <EmptyState
                title="No saved case studies"
                body="Once you save one it appears here, ready to edit, copy, or delete."
              />
            ) : (
              <ul className="space-y-3">
                {saved.map((cs) => (
                  <li key={cs.id} className="rounded-xl border border-border bg-secondary/50 p-4">
                    <p className="font-medium">{cs.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{cs.problem}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => edit(cs)}>
                        <Pencil className="size-4" /> Edit
                      </Button>
                      <CopyButton text={renderText(cs)} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSaved((list) => list.filter((c) => c.id !== cs.id));
                          if (editingId === cs.id) {
                            setEditingId(null);
                            setForm(EMPTY);
                          }
                        }}
                      >
                        <Trash2 className="size-4" /> Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel>
            <ExampleTag>the example above is sample content</ExampleTag>
            <p className="mt-3 text-sm text-muted-foreground">
              The bike-share case study is a demonstration of format only. Replace every line with
              your own work before showing it to anyone.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
