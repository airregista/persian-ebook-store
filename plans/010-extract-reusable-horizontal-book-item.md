# Plan 010: استخراج کامپوننت اشتراکی کارت افقی کتاب (BookListItem)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 6e1c9c6..HEAD -- src/components/library-dialog.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/008-standardize-cn-utility-and-clean-dependencies.md
- **Category**: tech-debt
- **Planned at**: commit `6e1c9c6`, 2026-10-24

## Why this matters

در کامپوننت `src/components/library-dialog.tsx` ساختار نمایش کارت کتاب افقی به صورت مضاعف و کپی‌شده در دو تب وجود دارد:
1. تب «کتاب‌های من» (خریده‌شده‌ها): خطوط ۱۲۲ تا ۱۹۲
2. تب «علاقه‌مندی‌ها»: خطوط ۲۴۰ تا ۳۲۲

این دو بخش دقیقاً یک ساختار کارت، تصویر جلد، عنوان دو خطی، نام دسته‌بندی و دکمه‌های عملیاتی دارند و با هر تغییر در استایل یا ریسپانسیو بودن، باید در دو نقطه جداگانه نگهداری شوند. استخراج کامپوننت `BookListItem` باعث کاهش حجم فایل `library-dialog.tsx`، رعایت اصل DRY و استفاده مجدد از این کارت در نتایج جستجو یا سبد خرید می‌شود.

## Current state

- در `src/components/library-dialog.tsx:122-192`:
  ```tsx
  <div
    key={book.id}
    className="group flex gap-3.5 p-3 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all text-right items-center"
  >
    <div className="relative w-16 sm:w-18 aspect-[3/4] rounded-lg overflow-hidden bg-muted shrink-0 cursor-pointer shadow-xs group-hover:scale-105 transition-transform" ...>
      <img src={book.cover} ... />
    </div>
    <div className="flex-1 min-w-0 space-y-1.5">
      ...
    </div>
  </div>
  ```
- در همان فایل، خطوط ۲۴۰ تا ۳۲۲، همان بلوک کد برای لیست علاقه‌مندی‌ها با تغییرات جزئی در دکمه‌ها دوباره کپی شده است.

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Typecheck | `npx tsc --noEmit`       | exit 0, no errors   |
| Build     | `npm run build`          | exit 0, Compiled successfully |

## Scope

**In scope**:
- `src/components/book-list-item.tsx` (ایجاد کامپوننت جدید)
- `src/components/library-dialog.tsx`

**Out of scope**:
- تغییر در رفتار یا استیت‌های هوک `useBookStorage`
- تغییر در دیالوگ جزئیات کتاب (`book-detail-dialog.tsx`)

## Git workflow

- Branch: `advisor/010-extract-book-list-item`
- Commit message: `refactor(components): extract reusable BookListItem from library dialog`

## Steps

### Step 1: ایجاد کامپوننت `src/components/book-list-item.tsx`

یک کامپوننت سبک و بهینه با پراپ‌های استاندارد بسازید:
```tsx
"use client";

import * as React from "react";
import type { Book } from "@/types/book";
import { formatToman } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export interface BookListItemProps {
  book: Book;
  onSelect: (id: string) => void;
  actions?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

export function BookListItem({
  book,
  onSelect,
  actions,
  subtitle,
  className,
}: BookListItemProps) {
  return (
    <div
      className={cn(
        "group flex gap-3.5 p-3 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-xs transition-all text-right items-center",
        className
      )}
    >
      <div
        onClick={() => onSelect(book.id)}
        className="relative w-16 sm:w-18 aspect-[3/4] rounded-lg overflow-hidden bg-muted shrink-0 cursor-pointer shadow-xs group-hover:scale-105 transition-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <span className="text-[10px] text-muted-foreground block truncate">
          {book.categoryName}
        </span>

        <h4
          onClick={() => onSelect(book.id)}
          className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 cursor-pointer hover:text-primary transition-colors"
          title={book.title}
        >
          {book.title}
        </h4>

        {subtitle ? (
          subtitle
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-foreground">
              {formatToman(book.price)}
            </span>
          </div>
        )}

        {actions && (
          <div className="flex items-center gap-2 pt-1">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Verify**: `npx tsc --noEmit` → بدون خطای تایپ.

### Step 2: جایگزینی در `src/components/library-dialog.tsx`

در `src/components/library-dialog.tsx`:
- کامپوننت `BookListItem` را ایمپورت کنید.
- حلقه‌های مپ در هر دو تب خریده‌شده‌ها و علاقه‌مندی‌ها را با `<BookListItem ... actions={...} />` جایگزین کنید.
- بررسی کنید دکمه‌های «مطالعه کتاب»، «شنیدن کتاب صوتی»، «خرید و پرداخت» و «حذف از علاقه‌مندی‌ها» مانند قبل کار کنند.

**Verify**: `npm run build` → بیلد موفق، تست دیالوگ در صفحه.

## Done criteria

- [ ] `npx tsc --noEmit` با موفقیت خاتمه می‌یابد.
- [ ] `npm run build` با موفقیت اجرا می‌شود.
- [ ] حجم فایل `src/components/library-dialog.tsx` حداقل ۶۰ تا ۱۰۰ خط کاهش یافته و کدهای رندر آیتم کتاب افقی متمرکز شده است.
- [ ] سطر پلن 010 در `plans/README.md` به `DONE` تغییر یافته است.

## STOP conditions

- در صورتی که دکمه بستن مدال روی کلیک آیتم متوقف شود یا متدهای `onOpenReader` و `onOpenCheckout` پراپ مناسب دریافت نکنند، متوقف شوید.
