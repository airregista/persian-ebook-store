# Plan 009: یکپارچه‌سازی دسته‌بندی‌ها در فایل ثابت مرکزی و رفع باگ ناوبری فوتر

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 6e1c9c6..HEAD -- src/components/category-nav.tsx src/app/page.tsx src/components/header.tsx src/components/footer.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `6e1c9c6`, 2026-10-24

## Why this matters

شناسه‌ها و عناوین دسته‌بندی کتاب‌ها در ۴ فایل مستقل به صورت کدهای تکراری هاردکد شده‌اند:
1. `src/components/category-nav.tsx` (آرایه ۱۸تایی `CATEGORIES`)
2. `src/app/page.tsx` (آبجکت `CATEGORY_NAMES`)
3. `src/components/header.tsx` (۱۴ دکمه بازشونده با عناوین دستی)
4. `src/components/footer.tsx` (لیست لینک‌های دسته‌بندی)

به دلیل نبود منبع واحد داده (Single Source of Truth)، ناهماهنگی و باگ ایجاد شده است؛ در فایل `src/components/footer.tsx:100` روی کلیک آیتم «روانشناسی و موفقیت»، شناسه نامعتبر `"society"` ارسال می‌شود که در کاتالوگ و سیستم فیلتر وجود ندارد و صفحه خالی یا بدون نتیجه لود می‌شود (شناسه صحیح در دیتابیس `"social-sciences"` یا `"psychology"` است).
با ایجاد یک ماژول ثابت در `src/lib/constants.ts`، هم بیش از ۱۵۰ سطر کد تکراری حذف می‌شود و هم باگ فیلتر دسته‌بندی فوتر برای همیشه رفع می‌گردد.

## Current state

- در `src/components/footer.tsx:98-105`:
  ```tsx
  98:               <li>
  99:                 <button
  100:                  type="button"
  101:                  onClick={() => onSelectCategory?.("society")}
  102:                  className="hover:text-primary transition-colors cursor-pointer"
  103:                >
  104:                  روانشناسی و موفقیت
  105:                </button>
  106:              </li>
  ```
  شناسه `"society"` در کاتالوگ فیدیبو وجود ندارد. شناسه روانشناسی `"psychology"` است.
- در `src/app/page.tsx:25-40`:
  ```tsx
  25: const CATEGORY_NAMES: Record<string, string> = {
  26:   all: "همه دسته‌ها",
  27:   "story-foreign": "داستان و رمان خارجی",
  ...
  ```
- در `src/components/header.tsx:158-264`:
  ۱۴ دکمه پشت سر هم تکرار شده‌اند و هر بار متن و آیکون به صورت دستی تکرار شده است.

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Typecheck | `npx tsc --noEmit`       | exit 0, no errors   |
| Build     | `npm run build`          | exit 0, Compiled successfully |
| Check bug | `git grep '"society"'`   | no matches found |

## Scope

**In scope**:
- `src/lib/constants.ts` (ایجاد فایل جدید)
- `src/components/category-nav.tsx`
- `src/app/page.tsx`
- `src/components/header.tsx`
- `src/components/footer.tsx`

**Out of scope**:
- کاتالوگ دیتابیس `src/lib/fidibo-catalog.json` و فایل‌های API Route در `src/app/api/` (تایپ‌ها و شناسه‌های موجود در کاتالوگ حفظ می‌شوند).

## Git workflow

- Branch: `advisor/009-centralize-categories`
- Commit message: `fix(categories): centralize categories in constants and fix invalid category id in footer`

## Steps

### Step 1: ایجاد فایل `src/lib/constants.ts`

یک فایل جدید به آدرس `src/lib/constants.ts` بسازید و تمام دسته‌بندی‌های استاندارد، نام‌های نمایشی، شناسه‌ها، نوع (قفسه شگفت‌انگیز، قفسه صوتی، یا دسته‌بندی موضوعی) را در آن متمرکز کنید:

```ts
export interface CategoryDefinition {
  id: string;
  label: string;
  type?: "category" | "shelf";
  shelfId?: string;
  iconName?: string;
}

export const CATEGORIES: CategoryDefinition[] = [
  { id: "all", label: "همه دسته‌ها", type: "category" },
  { id: "deals", label: "پیشنهاد شگفت‌انگیز", type: "shelf", shelfId: "shelf-deals" },
  { id: "audio", label: "کتاب‌های صوتی", type: "shelf", shelfId: "shelf-audio" },
  { id: "story-foreign", label: "داستان و رمان خارجی", type: "category" },
  { id: "story-persian", label: "داستان و رمان فارسی", type: "category" },
  { id: "psychology", label: "روانشناسی و تحول فردی", type: "category" },
  { id: "management", label: "مدیریت و کسب‌وکار", type: "category" },
  { id: "philosophy", label: "فلسفه و اندیشه", type: "category" },
  { id: "history", label: "تاریخ و زندگی‌نامه", type: "category" },
  { id: "social-sciences", label: "جامعه‌شناسی و علوم اجتماعی", type: "category" },
  { id: "literature", label: "شعر و ادبیات کلاسیک", type: "category" },
  { id: "lifestyle", label: "سبک زندگی و سلامت", type: "category" },
  { id: "scientific", label: "علمی و فناوری", type: "category" },
  { id: "kid-teen", label: "کودک و نوجوان", type: "category" },
  { id: "freebooks", label: "کتاب‌های رایگان", type: "category" },
];

export const CATEGORY_NAMES: Record<string, string> = {
  all: "همه دسته‌ها",
  "story-foreign": "داستان و رمان خارجی",
  "story-persian": "داستان و رمان فارسی",
  psychology: "روانشناسی، خودشناسی و رشد فردی",
  management: "مدیریت، بازاریابی و کسب‌وکار",
  philosophy: "فلسفه، اندیشه و منطق",
  history: "تاریخ جهان، ایران و زندگی‌نامه‌ها",
  "social-sciences": "جامعه‌شناسی، اقتصاد و علوم اجتماعی",
  audio: "کتاب‌های صوتی و پادکست",
  literature: "شعر و ادبیات کلاسیک",
  lifestyle: "سبک زندگی، سلامت و تندرستی",
  scientific: "دانش، علوم و فناوری",
  "kid-teen": "کودک و نوجوان",
  freebooks: "کتاب‌های رایگان و همگانی",
};
```

**Verify**: `npx tsc --noEmit` → بدون خطا.

### Step 2: اتصال `src/app/page.tsx` و `src/components/category-nav.tsx` به `src/lib/constants.ts`

- در `src/app/page.tsx`: تعریف تکراری `const CATEGORY_NAMES` را حذف کنید و آن را مستقیماً از `@/lib/constants` ایمپورت نمایید.
- در `src/components/category-nav.tsx`: از آرایه مرکزی `CATEGORIES` استفاده کنید.

**Verify**: `npm run build` → موفقیت‌آمیز بودن بیلد.

### Step 3: اصلاح هدر و بازنویسی داینامیک منوی دسته‌بندی‌ها

در `src/components/header.tsx`، کدهای تکراری خطوط ۱۵۸ تا ۲۶۴ را با یک حلقه ساده `CATEGORIES.filter(c => c.type === 'category').map(...)` جایگزین کنید. این کار بیش از ۱۰۰ سطر کد تکراری را حذف می‌کند.

**Verify**: منوی کشویی دسته‌بندی در هدر همچنان به درستی کار کند و با کلیک روی هر آیتم، دسته‌بندی مورد نظر فیلتر شود.

### Step 4: اصلاح لینک نامعتبر در `src/components/footer.tsx`

در فایل `src/components/footer.tsx:101`:
دستور `onSelectCategory?.("society")` را به `onSelectCategory?.("psychology")` یا `onSelectCategory?.("social-sciences")` تغییر دهید تا با کلیک کاربر، کتاب‌های معتبر نمایش داده شوند.

**Verify**: اجرای `git grep '"society"'` نباید هیچ موردی در کد پیدا کند.

## Done criteria

- [ ] `npx tsc --noEmit` با کد خروج صفر اجرا می‌شود.
- [ ] `npm run build` با موفقیت پایان می‌یابد.
- [ ] فایل `src/lib/constants.ts` منبع مرکزی دسته‌بندی‌هاست.
- [ ] در `src/components/footer.tsx` هیچ شناسه نامعتبر یا گم‌نامی مانند `"society"` وجود ندارد.
- [ ] وضعیت پلن 009 در `plans/README.md` به `DONE` تغییر می‌یابد.

## STOP conditions

- در صورتی که تغییر شناسه باعث اختلال در فیلتر کتاب‌های موجود در `fidibo-catalog.json` شود، فوراً متوقف شده و بررسی نمایید.
