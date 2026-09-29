import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw, Trash2, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";

import {
  CopyButton,
  EmptyState,
  ExampleTag,
  Field,
  PageHeader,
  Panel,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/kit";
import { Button } from "@/components/ui/button";
import {
  CATEGORIES,
  EXAMPLE_EXPERIENCE,
  generateBullets,
  hasMetric,
  measurementSuggestions,
  transferableSkills,
  type ExperienceInput,
} from "@/lib/bullet-rules";
import { useLocalStore } from "@/lib/local-store";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "Experience-to-skills builder — Career Draft" },
      {
        name: "description",
        content:
          "Enter one experience and get editable résumé bullets plus the transferable skills it demonstrates.",
      },
      { property: "og:title", content: "Experience-to-skills builder — Career Draft" },
      {
        property: "og:description",
        content: "Turn what you actually did into honest, editable résumé bullets.",
      },
    ],
  }),
  component: BuilderPage,
});

const EMPTY: ExperienceInput = {
  title: "",
  category: "small-business",
  actions: "",
  tools: "",
  outcome: "",
};

type Draft = { input: ExperienceInput; bullets: string[] };

function BuilderPage() {
  const { value: draft, setValue: setDraft } = useLocalStore<Draft>("nsl.builder.v1", {
    input: EMPTY,
    bullets: [],
  });
  const [errors, setErrors] = useState<{ title?: string; actions?: string }>({});

  const input = draft.input;
  const skills = useMemo(
    () => (input.actions.trim() || input.title.trim() ? transferableSkills(input) : []),
    [input],
  );
  const suggestions = useMemo(() => measurementSuggestions(input), [input]);

  function update<K extends keyof ExperienceInput>(key: K, val: ExperienceInput[K]) {
    setDraft((d) => ({ ...d, input: { ...d.input, [key]: val } }));
  }

  function validate() {
    const next: { title?: string; actions?: string } = {};
    if (input.title.trim().length < 3) next.title = "Add a short title (at least 3 characters).";
    if (input.actions.trim().length < 10)
      next.actions = "Describe what you did — one sentence is enough.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onGenerate() {
    if (!validate()) return;
    setDraft((d) => ({ ...d, bullets: generateBullets(d.input) }));
  }

  function loadExample() {
    setErrors({});
    setDraft({ input: EXAMPLE_EXPERIENCE, bullets: generateBullets(EXAMPLE_EXPERIENCE) });
  }

  function clearAll() {
    setErrors({});
    setDraft({ input: EMPTY, bullets: [] });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Step 1 & 2"
        title="Experience-to-skills builder"
        description="Describe one experience in plain language. You get editable résumé bullets and the transferable skills behind them — nothing invented."
      />

      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-6 lg:grid-cols-2">
        <Panel
          title="Your experience"
          description="Everything here is optional except the title and what you did."
          action={
            <Button type="button" variant="soft" size="sm" onClick={loadExample}>
              Load example
            </Button>
          }
        >
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onGenerate();
            }}
          >
            <Field label="Experience title" htmlFor="title" error={errors.title}>
              <TextInput
                id="title"
                value={input.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="a weekend baking business"
                aria-invalid={Boolean(errors.title)}
              />
            </Field>

            <Field
              label="Category"
              htmlFor="category"
              hint={CATEGORIES.find((c) => c.value === input.category)?.hint}
            >
              <SelectInput
                id="category"
                value={input.category}
                onChange={(e) => update("category", e.target.value as ExperienceInput["category"])}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </SelectInput>
            </Field>

            <Field
              label="What did you do?"
              htmlFor="actions"
              hint="Separate tasks with commas or new lines."
              error={errors.actions}
            >
              <TextArea
                id="actions"
                value={input.actions}
                onChange={(e) => update("actions", e.target.value)}
                placeholder="taking custom orders over Instagram, planning weekly ingredient purchases"
                aria-invalid={Boolean(errors.actions)}
              />
            </Field>

            <Field label="Tools used" htmlFor="tools" hint="Apps, software, equipment — comma separated.">
              <TextInput
                id="tools"
                value={input.tools}
                onChange={(e) => update("tools", e.target.value)}
                placeholder="Google Sheets, Square, Canva"
              />
            </Field>

            <Field
              label="Measurable outcome (only if you have one)"
              htmlFor="outcome"
              hint="Leave blank if you don't know a real number. Never estimate."
            >
              <TextInput
                id="outcome"
                value={input.outcome}
                onChange={(e) => update("outcome", e.target.value)}
                placeholder="filled about 8 custom orders per month"
              />
            </Field>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button type="submit" variant="hero">
                <Wand2 className="size-4" /> Generate bullets
              </Button>
              <Button type="button" variant="ghost" onClick={clearAll}>
                <Trash2 className="size-4" /> Clear
              </Button>
            </div>
          </form>
        </Panel>

        <div className="space-y-6">
          <Panel
            title="Draft résumé bullets"
            description="Edit each line directly — they are yours to rewrite."
            action={
              draft.bullets.length > 0 ? (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDraft((d) => ({ ...d, bullets: generateBullets(d.input) }))}
                  >
                    <RotateCcw className="size-4" /> Regenerate
                  </Button>
                  <CopyButton text={draft.bullets.map((b) => `• ${b}`).join("\n")} />
                </div>
              ) : null
            }
          >
            {draft.bullets.length === 0 ? (
              <EmptyState
                title="No bullets yet"
                body="Fill in the title and what you did, then choose Generate bullets."
              />
            ) : (
              <ul className="space-y-3">
                {draft.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span aria-hidden className="pt-2.5 text-cobalt">
                      •
                    </span>
                    <label className="sr-only" htmlFor={`bullet-${i}`}>
                      Résumé bullet {i + 1}
                    </label>
                    <TextArea
                      id={`bullet-${i}`}
                      className="min-h-20"
                      value={bullet}
                      onChange={(e) =>
                        setDraft((d) => {
                          const bullets = [...d.bullets];
                          bullets[i] = e.target.value;
                          return { ...d, bullets };
                        })
                      }
                    />
                  </li>
                ))}
              </ul>
            )}

            {draft.bullets.length > 0 && !hasMetric(input.outcome) && (
              <div className="mt-5 rounded-xl border border-border bg-accent/50 p-4">
                <p className="text-sm font-semibold text-accent-foreground">
                  No number yet — here's what you could measure
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
                  {suggestions.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">
                  Only add a number you can honestly stand behind in an interview.
                </p>
              </div>
            )}
          </Panel>

          <Panel title="Transferable skills" description="Pulled from the words you used.">
            {skills.length === 0 ? (
              <EmptyState
                title="Nothing to read yet"
                body="Describe what you did and skills will appear here as you type."
              />
            ) : (
              <ul className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-border bg-secondary px-3 py-1.5 text-sm"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel>
            <ExampleTag>how to phrase a bullet</ExampleTag>
            <p className="mt-3 text-sm text-muted-foreground">
              Strong pattern: <span className="text-foreground">action verb</span> +{" "}
              <span className="text-foreground">what you did</span> +{" "}
              <span className="text-foreground">tool or context</span> + (a real number, if you have
              one). Skip adjectives like “passionate” or “hardworking” — recruiters read past them.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
