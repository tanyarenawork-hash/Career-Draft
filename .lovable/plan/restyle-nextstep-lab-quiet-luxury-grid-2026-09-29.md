# Restyle NextStep Lab — "Quiet luxury grid"

Apply the selected design direction across all six pages. Visual changes only — no functionality, content, or data changes.

## Design tokens (src/styles.css)

- Palette: warm sand background #F9F6F0, deeper sand bands #F0EBE3, hairline borders #E5D1B8, taupe accent #8B7E6A, near-black ink text #33302C, muted text #6B6358
- Fonts: DM Serif Display for headings, Fira Sans for body (loaded via link in the root route)
- Cards: hairline 1px sand borders, soft warm shadows, small corner radius (editorial, not bubbly)
- Primary buttons: dark ink background with uppercase letter-spaced labels
- New `eyebrow-label` utility for the small uppercase section labels

## Page updates

- **Header/footer** (`site-chrome.tsx`): hairline bottom border, serif wordmark "NextStep *Lab*" (italic "Lab"), uppercase letter-spaced nav links, taupe active state
- **Home** (`index.tsx`): centered hero with large serif headline and italic second line, two buttons (dark primary, outlined secondary); "How this works" as a three-cell hairline grid with "Step 01/02/03" labels and italic serif titles; tools grid keeps four cards with sand icon chips and hover lift; example section keeps its content on the new card style
- **Shared kit** (`kit.tsx`): page headers use the taupe eyebrow label; panels, inputs, tags, and empty states pick up the new tokens automatically
- **Other pages** (builder, case studies, career fair, library, about): no structural edits — they inherit the new tokens, fonts, and card styles

## Verification

- `bunx tsgo --noEmit` passes
- All six routes return 200 and render with the new fonts and palette
