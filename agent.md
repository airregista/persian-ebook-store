# Agent Rules & Architecture Guidelines (KetabGard)

This document establishes the mandatory engineering standards, design constraints, and quality gates for the **KetabGard** project (Next.js 16 App Router, Tailwind CSS v4, Base UI / Shadcn, TypeScript). All agents, subagents, and contributors must strictly adhere to these rules.

---

## 1. Shadcn UI Component Standards

### 1.1 Prohibition of Raw HTML Interactive Elements
- **Never use raw HTML `<button>` or `<input>` elements** in application views.
- Always use the audited Shadcn UI primitives located in `@/components/ui/`:
  - Buttons: `<Button variant="..." size="...">` from `@/components/ui/button`
  - Text & Search inputs: `<Input ... />` from `@/components/ui/input`
  - Badges & status pills: `<Badge variant="...">` from `@/components/ui/badge`
  - Modals & dialogs: `<Dialog>`, `<DialogContent>`, `<DialogHeader>`, `<DialogTitle>` from `@/components/ui/dialog`
  - Drawers & side sheets: `<Sheet>`, `<SheetContent>` from `@/components/ui/sheet`
  - Tabs: `<Tabs>`, `<TabsList>`, `<TabsTrigger>`, `<TabsContent>` from `@/components/ui/tabs`
  - Sliders & seekbars: `<Slider ... />` from `@/components/ui/slider`

### 1.2 Icon-Only Buttons & Accessibility
- Icon-only buttons must specify `variant="ghost"` or `variant="outline"`, along with `size="icon"` or `size="icon-sm"`.
- Always provide explicit `aria-label` and `title` attributes in Persian for assistive technologies.

### 1.3 No Hand-Rolled Popups or Flyouts
- Do not build custom flyouts using `useState(isOpen)` coupled with manual `document.addEventListener("mousedown", ...)` click-outside handlers. Use standardized Base UI / Radix dropdown or popover primitives to ensure roving tabindex, keyboard navigation, and ARIA focus trap compliance.

### 1.4 Class Name Merging (`cn`) Import Rule
- Always import `cn` from `@/lib/utils`:
  ```ts
  import { cn } from "@/lib/utils";
  ```
- **Never** import from the external `"cn"` npm package (`import { cn } from "cn"`).

---

## 2. Design Tokens & Styling in `globals.css`

### 2.1 Absolute Ban on Hardcoded Hex Colors in JSX
- Never hardcode raw hex values in Tailwind utility classes (e.g. `bg-[#ffffff]`, `text-[#18181b]`, `border-[#ebdcc0]`, `bg-[#141416]`).
- Every color must resolve to an active semantic CSS variable defined in `src/app/globals.css`.

### 2.2 Semantic Color Mapping
- **Success / Purchases / Library Badges:** Use `bg-success`, `text-success`, `border-success`, and `hover:bg-success-hover`. Do not hardcode `emerald-*` or `teal-*`.
- **Gold / Ratings / Audiobooks:** Use `text-gold`, `fill-gold`, `bg-gold`. Do not hardcode `amber-*` or `yellow-*`.
- **Deals / Discounts / Danger:** Use `bg-deal`, `text-deal`, `text-destructive`, and `bg-destructive`. Do not hardcode `red-500` or `rose-500`.
- **Surfaces & Layouts:** Use `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `bg-muted`, `text-muted-foreground`, and `border-border`.
- **E-book Reader Themes:** Day, Sepia, and Night themes must bind to CSS variables in `globals.css` (`--reader-sepia-bg`, `--reader-sepia-fg`, `--reader-sepia-border`, `--reader-dark-bg`, etc.).

### 2.3 Defining New Design Tokens
- If a new color or design variable is required, add it to `:root`, `.dark`, and the `@theme inline` block in `src/app/globals.css` before referencing it in code.

---

## 3. DRY Principles & Single Source of Truth

### 3.1 Centralized Catalog Metadata & Categories
- All category IDs, slugs, Persian labels, and shelf definitions must reside exclusively in `src/lib/constants.ts` (`CATEGORIES` and `CATEGORY_NAMES`).
- Duplicating category arrays or dictionaries across `header.tsx`, `footer.tsx`, `category-nav.tsx`, and `page.tsx` is prohibited.

### 3.2 Component Extraction for Repeated UI Patterns
- Any UI pattern rendered in multiple contexts (e.g. horizontal book cards in library dialogs, rating star clusters, discount price badges) must be extracted into a reusable component (such as `BookListItem`) rather than copy-pasted.

### 3.3 Formatting Helpers
- Always format book prices using `formatToman(price)` from `src/lib/formatters.ts`.
- Format numbers, page counts, durations, and ratings using `toPersianDigits(n)`.

---

## 4. Persian Typography, RTL & Accessibility

### 4.1 Uniform Vazirmatn Typography
- All typography, headings, labels, and timer displays must render with the primary Persian font (`font-sans`).
- Do not use `font-mono` for Persian text or timers. Use `tabular-nums font-sans font-bold` for jitter-free numbers.

### 4.2 RTL Layout Conventions
- The entire interface operates in right-to-left orientation (`dir="rtl"`).
- Prefer flex/grid `gap-*` utilities over asymmetric directional paddings or margins.

---

## 5. Mandatory Verification Gates

Before completing any task or committing changes, both commands must execute cleanly with exit code 0:

```bash
# 1. Typecheck the entire project
npx tsc --noEmit

# 2. Verify Next.js production build
npm run build
```

No work is considered complete if either command produces warnings or errors.
