# Rename the site to "Career Draft"

## What changes

Replace "NextStep Lab" with "Career Draft" everywhere it appears on the site, keeping the current Quiet luxury grid design untouched.

## Wordmark style

Mirror the existing header treatment: **Career** in roman serif with **Draft** in italics, matching how "NextStep *Lab*" looks today. Footer and body text use plain "Career Draft".

## Files to edit

1. `src/components/site-chrome.tsx` — header wordmark ("Career *Draft*"), footer line ("Career Draft — a student portfolio project about internship readiness.").
2. `src/routes/__root.tsx` — default page title: "Career Draft — Turn your experience into internship evidence".
3. `src/routes/index.tsx` — title, description, og:title, hero paragraph ("Career Draft helps college students…").
4. `src/routes/builder.tsx` — title and og:title.
5. `src/routes/case-studies.tsx` — title and og:title.
6. `src/routes/career-fair.tsx` — title and og:title.
7. `src/routes/library.tsx` — title and og:title.
8. `src/routes/about.tsx` — title, og:title, description, and the PageHeader description sentence.
9. `src/styles.css` — comment header only (no visual change).

## Untouched on purpose

- localStorage keys (`nsl-*`) — internal identifiers; renaming them would wipe users' saved drafts for no visible benefit.
- Colors, fonts, layout — the rename is name-only.
- README.md — not user-facing; can be updated later if wanted.

## Verification

- Typecheck with `tsc --noEmit` equivalent, check build log for "build OK".
- Confirm zero remaining "NextStep" matches in `src/`.
- Load the home page in the preview and screenshot the header + hero to confirm the new name renders.
