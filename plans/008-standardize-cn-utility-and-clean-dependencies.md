# Plan 008: استانداردسازی ابزار cn و حذف وابستگی پکیج مستقیم cn

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 6e1c9c6..HEAD -- src/lib/utils.ts package.json src/components/ui/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tech-debt
- **Planned at**: commit `6e1c9c6`, 2026-10-24

## Why this matters

پروژه در حال حاضر از یک پکیج نامتعارف شخص ثالث npm به نام `"cn"` به جای پیاده‌سازی استاندارد شادسن (`clsx` + `tailwind-merge`) استفاده می‌کند. در فایل `src/lib/utils.ts` صرفاً دستور `export { cn } from "cn"` قرار دارد و ۱۱ کامپوننت پایه شادسن مستقیماً `import { cn } from "cn"` می‌کنند.
این کار باعث ایجاد دوگانگی مسیرهای ایمپورت در پروژه، عدم سازگاری با دستورات CLI رسمی شادسن و اضافه شدن یک وابستگی غیرضروری به `package.json` شده است، در حالی که بسته‌های استاندارد `clsx` و `tailwind-merge` از قبل در پروژه نصب هستند.

## Current state

- `src/lib/utils.ts` — فایل ابزار اصلی پروژه:
  ```ts
  1: export { cn } from "cn"
  ```
- `package.json` — پکیج `"cn"` در لیست وابستگی‌ها قرار دارد:
  ```json
  14:     "clsx": "^2.1.1",
  15:     "cn": "^0.5.0",
  ...
  23:     "tailwind-merge": "^3.7.0",
  ```
- تمام فایل‌های `src/components/ui/*.tsx` مستقیماً از پکیج `"cn"` ایمپورت کرده‌اند:
  ```ts
  // Exemplar from src/components/ui/button.tsx:3
  import { cn } from "cn"
  ```
- در مقابل، `src/components/reader/ebook-reader.tsx:9` از مسیر استاندارد شادسن استفاده کرده است:
  ```ts
  import { cn } from "@/lib/utils";
  ```

الگوی هدف رسمی Shadcn UI:
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Typecheck | `npx tsc --noEmit`       | exit 0, no errors   |
| Build     | `npm run build`          | exit 0, Compiled successfully |
| Check old import | `git grep 'from "cn"'` | no matches found |

## Scope

**In scope**:
- `src/lib/utils.ts`
- `package.json`
- تمام فایل‌هایی در `src/` که در حال حاضر دارای عبارت `from "cn"` یا `from 'cn'` هستند:
  - `src/components/ui/button.tsx`
  - `src/components/ui/card.tsx`
  - `src/components/ui/badge.tsx`
  - `src/components/ui/dialog.tsx`
  - `src/components/ui/input.tsx`
  - `src/components/ui/progress.tsx`
  - `src/components/ui/scroll-area.tsx`
  - `src/components/ui/separator.tsx`
  - `src/components/ui/sheet.tsx`
  - `src/components/ui/slider.tsx`
  - `src/components/ui/tabs.tsx`
  - `src/components/book-card.tsx`
  - `src/components/book-shelf.tsx`
  - `src/components/book-detail-dialog.tsx`
  - `src/components/category-nav.tsx`
  - `src/components/header.tsx`
  - `src/components/subscription-dialog.tsx`

**Out of scope**:
- تغییر در منطق عملکردی هیچ‌کدام از کامپوننت‌ها
- اضافه کردن پکیج‌های جدید

## Git workflow

- Branch: `advisor/008-standardize-cn-utility`
- Commit message: `refactor(utils): standardize cn helper with clsx and twMerge and remove cn package`

## Steps

### Step 1: بازنویسی فایل `src/lib/utils.ts` بر اساس استاندارد شادسن

محتوای فایل `src/lib/utils.ts` را به شکل زیر بازنویسی کنید:
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Verify**: `npx tsc --noEmit` → بدون خطای تایپ در `src/lib/utils.ts`.

### Step 2: تصحیح ایمپورت‌ها در تمامی فایل‌های پروژه به `@/lib/utils`

در تمامی فایل‌های ذکر شده در بخش Scope، ایمپورت:
```ts
import { cn } from "cn";
```
را به:
```ts
import { cn } from "@/lib/utils";
```
تغییر دهید.

**Verify**: اجرای دستور زیر باید هیچ نتیجه‌ای بازنگرداند:
`git grep 'from "cn"'`

### Step 3: حذف پکیج `"cn"` از `package.json`

خط `"cn": "^0.5.0",` را از بخش `dependencies` فایل `package.json` حذف کنید و دستور `npm install` یا `npm prune` را در صورت لزوم اجرا کنید تا پکیج‌های اضافی پاکسازی شوند.

**Verify**: `npm run build` → خروجی `Compiled successfully`.

## Done criteria

- [ ] `npx tsc --noEmit` با کد صفر خاتمه می‌یابد.
- [ ] `npm run build` بدون خطا بیلد می‌شود.
- [ ] دستور `git grep 'from "cn"'` هیچ نتیجه‌ای بازنمی‌گرداند.
- [ ] فایل `src/lib/utils.ts` تابع استاندارد `cn` را با استفاده از `clsx` و `twMerge` اکسپورت می‌کند.
- [ ] سطر پلن 008 در `plans/README.md` به وضعیت `DONE` تغییر یافته است.

## STOP conditions

- اگر بعد از تغییر `cn`، استایل‌های Tailwind v4 دچار شکست شوند یا خروجی کلاس‌ها ادغام نشوند، متوقف شده و گزارش دهید.
- اگر هر فایلی خارج از لیست Scope نیاز به ویرایش داشته باشد، متوقف شوید.
