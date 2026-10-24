# Plan 013: Establish Agent Rules and Architectural Guidelines in English

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 6e1c9c6..HEAD -- agent.md plans/README.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `6e1c9c6`, 2026-10-24

## Why this matters

AI coding agents collaborating on this project frequently introduce architectural drift: using raw HTML `<button>` and `<input>` elements instead of official Shadcn UI primitives, hardcoding arbitrary hex colors and unmapped Tailwind palettes instead of semantic CSS variables, duplicating category metadata across multiple frontend files, and importing non-standard packages.
Establishing an authoritative, English-language `agent.md` file in the repository root ensures that every autonomous model and subagent immediately ingests clear constraints, code conventions, accessibility requirements, and verification gates before writing code.

## Current state

- The repository currently contains mixed practices:
  - 35+ instances of raw `<button>` and `<input>` tags bypassing Shadcn UI primitives (`header.tsx`, `book-card.tsx`, `footer.tsx`).
  - Hardcoded hex codes (`#ffffff`, `#fbf0d9`, `#141416`) in `src/components/reader/ebook-reader.tsx`.
  - Missing `--success` token in `src/app/globals.css`, causing scattered `emerald-*` and `teal-*` utility classes.
  - Duplicated category definitions across 4 files (`src/app/page.tsx`, `src/components/category-nav.tsx`, `src/components/header.tsx`, `src/components/footer.tsx`) causing broken filters (`"society"` instead of `"social-sciences"`).
  - An initial draft of rules was written in Persian, but agent instructions and system prompts perform with significantly higher accuracy and zero ambiguity when codified in structured English.

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Verification | `git status`          | agent.md staged/tracked cleanly |
| Read check   | `type agent.md`       | complete English rules content |

## Scope

**In scope**:
- `agent.md` (root directory)
- `plans/README.md` (index update)

**Out of scope**:
- Source code in `src/` (implementation plans 008 through 012 handle actual code refactoring).

## Git workflow

- Branch: `advisor/013-agent-rules`
- Commit message: `docs: define agent rules and architectural guidelines in english`

## Steps

### Step 1: Draft the Comprehensive English Agent Guidelines in `agent.md`

Write `agent.md` with explicit, unambiguous rules covering:
1. **Shadcn UI Enforcement**:
   - Zero raw HTML `<button>` or `<input>` tags. Always use `@/components/ui/button` (`Button`), `@/components/ui/input` (`Input`), `@/components/ui/badge` (`Badge`), `@/components/ui/dialog` (`Dialog`), etc.
   - Icon-only buttons must use `variant="ghost"` or `variant="outline"` with `size="icon"` or `size="icon-sm"`, and explicitly provide `aria-label` and `title`.
   - Popups, sheets, and dialogs must use Base UI / Radix primitives from `@/components/ui/` rather than manual `useState` + `document.addEventListener` implementations.
   - Always import `cn` from `@/lib/utils` (`import { cn } from "@/lib/utils"`). Never import from the external `"cn"` npm package.
2. **Design Tokens & Theme Consistency (`globals.css`)**:
   - Strict prohibition of arbitrary hex codes (`#[...]`) in Tailwind classes.
   - Semantic tokens only:
     - Success / Purchases / Confirmations: `bg-success`, `text-success`, `border-success` (do not hardcode `emerald-*`).
     - Gold / Ratings / Audiobooks: `text-gold`, `fill-gold`, `bg-gold` (do not hardcode `amber-*`).
     - Deals / Discounts / Danger: `bg-deal`, `text-deal`, `text-destructive` (do not hardcode `red-500`).
     - Theme backgrounds/surfaces: `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`.
   - Reader themes (Day, Sepia, Night) must consume CSS variables (`--reader-sepia-bg`, `--reader-dark-bg`, etc.).
3. **DRY & Single Source of Truth**:
   - Category constants, IDs, and Persian display labels must reside exclusively in `src/lib/constants.ts`.
   - Reusable composite components (e.g., horizontal book rows in dialogs) must be extracted into standalone components (`BookListItem`) rather than duplicated across tabs.
   - Formatting of currency and numbers must strictly use `formatToman` and `toPersianDigits` from `src/lib/formatters.ts`.
4. **Persian Typography & A11y Standards**:
   - Always use Vazirmatn font (`font-sans`). Do not use `font-mono` for Persian text or timers; use `tabular-nums font-sans font-bold`.
   - All interactive icons must have accessible labels.
5. **Mandatory Verification Gates**:
   - Every code modification must pass:
     1. `npx tsc --noEmit` (zero TypeScript errors)
     2. `npm run build` (successful production Next.js build)

**Verify**: Verify that `agent.md` contains the full English specification without truncation.

### Step 2: Update `plans/README.md` Index

Add Plan 013 to the execution and status table in `plans/README.md`.

**Verify**: Review table in `plans/README.md`.

## Done criteria

- [ ] `agent.md` is written in clear, structured English.
- [ ] All five audited problem areas (Shadcn primitives, design tokens, DRY constants, typography/A11y, and verification gates) are codified.
- [ ] `plans/README.md` is updated with Plan 013.

## STOP conditions

- If any conflict is detected between `agent.md` and `components.json` or `next.config.ts`, stop and report.
