# Plan 011: تکمیل توکن‌های طراحی در globals.css و حذف رنگ‌های هاردکد شده

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 6e1c9c6..HEAD -- src/app/globals.css src/components/reader/ebook-reader.tsx src/components/checkout-dialog.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/008-standardize-cn-utility-and-clean-dependencies.md
- **Category**: tech-debt
- **Planned at**: commit `6e1c9c6`, 2026-10-24

## Why this matters

در حال حاضر فایل `src/app/globals.css` فاقد توکن‌های معنایی موفقیت (`--success`) است که باعث شده در حداقل ۶ فایل مختلف کلاس‌های سخت‌کدشده مثل `bg-emerald-600` و `text-emerald-500` پراکنده شوند.
همچنین در کامپوننت کتابخوان `src/components/reader/ebook-reader.tsx`، مقادیر هگز مستقیماً در کلاس‌های Tailwind (`bg-[#ffffff]`, `text-[#18181b]`, `bg-[#fbf0d9]`, `border-[#ebdcc0]`, `bg-[#141416]`) نوشته شده‌اند و توکن‌های ریدر از متغیرهای CSS جدا مانده‌اند.
علاوه بر این، در بخش‌های ستاره‌ها و تخفیف‌ها به‌جای توکن‌های موجود `--gold` و `--deal` از رنگ‌های ثابت پالت پیش‌فرض Tailwind (`amber-500`, `red-500`) استفاده شده است. تکمیل توکن‌ها و حذف هاردکدها، سازگاری تم تیره/روشن و یکپارچگی دیزاین سیستم شادسن را تضمین می‌کند.

## Current state

- در `src/app/globals.css`:
  توکن `--success` و `--success-foreground` وجود ندارد.
  متغیرهای `--reader-sepia-border` و `--reader-sepia-muted` تعریف نشده‌اند.
- در `src/components/reader/ebook-reader.tsx:28-56`:
  ```tsx
  const THEME_CONFIG: Record<ReaderTheme, ThemeConfig> = {
    day: {
      name: "روز",
      bg: "bg-[#ffffff]",
      text: "text-[#18181b]",
      headerBg: "bg-[#ffffff]/95",
      border: "border-zinc-200",
      mutedText: "text-zinc-500",
      cardBg: "bg-zinc-50 border-zinc-200",
    },
    sepia: {
      name: "کاغذی",
      bg: "bg-[#fbf0d9]",
      text: "text-[#5f4b32]",
      headerBg: "bg-[#fbf0d9]/95",
      border: "border-[#ebdcc0]",
      mutedText: "text-[#8c7456]",
      cardBg: "bg-[#f4e7cd] border-[#ebdcc0]",
    },
    night: {
      name: "شب",
      bg: "bg-[#141416]",
      text: "text-[#f4f4f5]",
      headerBg: "bg-[#141416]/95",
      border: "border-zinc-800",
      mutedText: "text-zinc-400",
      cardBg: "bg-zinc-900 border-zinc-800",
    },
  };
  ```
- در `src/components/checkout-dialog.tsx:44, 70, 86`:
  استفاده از `bg-emerald-500/15`, `text-emerald-600`, `bg-emerald-600 hover:bg-emerald-700` به دلیل نبود توکن موفقیت.

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Typecheck | `npx tsc --noEmit`       | exit 0, no errors   |
| Build     | `npm run build`          | exit 0, Compiled successfully |
| Check hex in reader | `git grep '#\[' src/components/reader/` | no matches found |

## Scope

**In scope**:
- `src/app/globals.css`
- `src/components/reader/ebook-reader.tsx`
- `src/components/checkout-dialog.tsx`
- `src/components/subscription-dialog.tsx`
- `src/components/book-card.tsx`
- `src/components/book-shelf.tsx`

**Out of scope**:
- تغییر در فونت و تایپوگرافی وزیرمتن
- کاتالوگ دیتابیس `fidibo-catalog.json`

## Git workflow

- Branch: `advisor/011-css-tokens-and-remove-hardcoded-colors`
- Commit message: `style(theme): add success tokens and reader semantic variables in globals.css and replace hardcoded colors`

## Steps

### Step 1: اضافه کردن توکن‌های معنایی جدید در `src/app/globals.css`

در `src/app/globals.css`:
1. در بلوک `:root`:
   ```css
   --success: #10b981;
   --success-foreground: #ffffff;
   --success-hover: #059669;

   --reader-sepia-border: #ebdcc0;
   --reader-sepia-muted: #8c7456;
   --reader-sepia-card: #f4e7cd;
   ```
2. در بلوک `.dark`:
   ```css
   --success: #059669;
   --success-foreground: #ecfdf5;
   --success-hover: #10b981;

   --reader-sepia-border: #4a3a25;
   --reader-sepia-muted: #a89478;
   --reader-sepia-card: #2e2316;
   ```
3. در بلوک `@theme inline`:
   ```css
   --color-success: var(--success);
   --color-success-foreground: var(--success-foreground);
   --color-success-hover: var(--success-hover);

   --color-reader-sepia-border: var(--reader-sepia-border);
   --color-reader-sepia-muted: var(--reader-sepia-muted);
   --color-reader-sepia-card: var(--reader-sepia-card);
   ```

**Verify**: `npx tsc --noEmit; npm run build` → موفقیت‌آمیز.

### Step 2: حذف هگزهای هاردکد شده از `src/components/reader/ebook-reader.tsx`

در فایل `ebook-reader.tsx`:
کانفیگ `THEME_CONFIG` را طوری به‌روز کنید که از کلاس‌های معنایی متصل به توکن‌ها استفاده کند:
- تم `day`:
  - `bg: "bg-background"`
  - `text: "text-foreground"`
  - `headerBg: "bg-background/95"`
  - `border: "border-border"`
  - `mutedText: "text-muted-foreground"`
  - `cardBg: "bg-muted border-border"`
- تم `sepia`:
  - `bg: "bg-reader-sepia-bg"`
  - `text: "text-reader-sepia-fg"`
  - `headerBg: "bg-reader-sepia-bg/95"`
  - `border: "border-reader-sepia-border"`
  - `mutedText: "text-reader-sepia-muted"`
  - `cardBg: "bg-reader-sepia-card border-reader-sepia-border"`
- تم `night`:
  - `bg: "bg-reader-dark-bg"`
  - `text: "text-reader-dark-fg"`
  - `headerBg: "bg-reader-dark-bg/95"`
  - `border: "border-border"`
  - `mutedText: "text-muted-foreground"`
  - `cardBg: "bg-card border-border"`
- کلیه دکمه‌های تم در خطوط ۲۷۰ تا ۳۱۰ را نیز با متغیرهای تم هماهنگ کنید تا هیچ `#[...]` در فایل باقی نماند.

**Verify**: `git grep '#\[' src/components/reader/` → هیچ نتیجه‌ای نیابد.

### Step 3: جایگزینی کلاس‌های `emerald-*` با توکن‌های `success` در دیالوگ‌ها

- در `src/components/checkout-dialog.tsx`:
  - `bg-emerald-500/15` → `bg-success/15`
  - `border-emerald-500/30` → `border-success/30`
  - `text-emerald-600 dark:text-emerald-400` → `text-success`
  - `bg-emerald-600 hover:bg-emerald-700` → `bg-success text-success-foreground hover:bg-success-hover`
- در `src/components/subscription-dialog.tsx`:
  - آیکون‌ها و تیک‌های سبز با `text-success` و پکیج‌های اشتراک با توکن‌های `gold` و `success` یکدست شوند.

### Step 4: هماهنگی ستاره‌ها با توکن `--gold` و تخفیف‌ها با `--deal`

در `src/components/book-card.tsx` و `src/components/book-shelf.tsx`:
- رنگ ستاره‌های امتیاز (`text-amber-500 fill-amber-500`) با `text-gold fill-gold` هماهنگ شود.
- رنگ تخفیف‌ها با `bg-deal text-white` و بنرهای شگفت‌انگیز با ترکیب معنایی `deal` و `destructive` تنظیم شوند.

**Verify**: `npm run build` → بیلد موفق، بررسی بصری تم روشن و تیره.

## Done criteria

- [ ] متغیرهای `--success` و `--success-foreground` و `--success-hover` در `src/app/globals.css` تعریف و در `@theme inline` ثبت شده‌اند.
- [ ] در فایل `ebook-reader.tsx` هیچ رنگ هگز هاردکدشده‌ای (`#[...]`) وجود ندارد.
- [ ] دیالوگ تسویه‌حساب و اشتراک از توکن `success` بهره می‌برند.
- [ ] `npm run build` با کد صفر تمام می‌شود.
- [ ] وضعیت پلن 011 در `plans/README.md` به `DONE` تغییر می‌یابد.

## STOP conditions

- اگر در حالت دارک، کنتراست متن در تم کاغذی (sepia) ناخوانا شود، استایل‌های اختصاصی تم سپیا را ایزوله و بررسی نمایید.
